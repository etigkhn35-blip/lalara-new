"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db, storage } from "@/lib/firebase";

type DocumentKey = "food" | "drinks" | "breakfast";

type DocumentItem = {
  key: DocumentKey;
  name: string;
  description: string;
  fallback: string;
  url: string;
  storagePath?: string;
};

const defaults: DocumentItem[] = [
  { key: "food", name: "Food Menu", description: "Main food menu", fallback: "/lalara-menu.pdf", url: "/lalara-menu.pdf" },
  { key: "drinks", name: "Drinks Menu", description: "Cocktails, wine & drinks", fallback: "/lalara-drinks.pdf", url: "/lalara-drinks.pdf" },
  { key: "breakfast", name: "Breakfast Menu", description: "Breakfast menu", fallback: "/lalara-breakfast.pdf", url: "/lalara-breakfast.pdf" },
];

export default function MenusPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(defaults);
  const [target, setTarget] = useState<DocumentKey | null>(null);
  const [state, setState] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "documents"));
        const data = snap.data();

        if (!data) return;

        setDocuments((items) =>
          items.map((item) => ({
            ...item,
            url: data[item.key]?.url || item.fallback,
            storagePath: data[item.key]?.storagePath || undefined,
          }))
        );
      } catch (error) {
        console.error(error);
        setState("Could not load menu documents.");
      }
    })();
  }, []);

  async function persist(next: DocumentItem[]) {
    const user = auth.currentUser;
    if (!user) throw new Error("Session expired");

    await setDoc(
      doc(db, "siteSettings", "documents"),
      {
        ...Object.fromEntries(
          next.map((item) => [
            item.key,
            {
              url: item.url,
              storagePath: item.storagePath || "",
              name: item.name,
            },
          ])
        ),
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        updatedByEmail: user.email || "",
      },
      { merge: true }
    );
  }

  function choose(key: DocumentKey) {
    setTarget(key);
    input.current?.click();
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !target) return;

    if (file.type !== "application/pdf") {
      setState("Please choose a PDF file.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setState("PDF must be smaller than 20 MB.");
      return;
    }

    const old = documents.find((item) => item.key === target);
    if (!old) return;

    setState(`Uploading ${old.name}...`);

    try {
      const path = `website/menus/${target}-${Date.now()}.pdf`;
      const fileRef = ref(storage, path);

      await uploadBytes(fileRef, file, { contentType: "application/pdf" });
      const url = await getDownloadURL(fileRef);

      const next = documents.map((item) =>
        item.key === target ? { ...item, url, storagePath: path } : item
      );

      await persist(next);
      setDocuments(next);

      if (old.storagePath) {
        try {
          await deleteObject(ref(storage, old.storagePath));
        } catch {}
      }

      setState(`${old.name} updated ✓`);
    } catch (error) {
      console.error(error);
      setState("PDF upload failed. Check Firebase Storage permissions.");
    }
  }

  async function restore(item: DocumentItem) {
    if (!confirm(`Restore original ${item.name}?`)) return;

    try {
      if (item.storagePath) {
        try {
          await deleteObject(ref(storage, item.storagePath));
        } catch {}
      }

      const next = documents.map((current) =>
        current.key === item.key
          ? { ...current, url: current.fallback, storagePath: undefined }
          : current
      );

      await persist(next);
      setDocuments(next);
      setState(`${item.name} restored ✓`);
    } catch (error) {
      console.error(error);
      setState("Restore failed.");
    }
  }

  return (
    <AdminShell eyebrow="Website" title="Menus & PDFs">
      <input
        ref={input}
        type="file"
        accept="application/pdf"
        hidden
        onChange={upload}
      />

      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Documents</p>
          <h1>Menus & PDFs.</h1>
        </div>
      </div>

      {state && <p className="admin-save-message">{state}</p>}

      <div className="document-list">
        {documents.map((item) => (
          <article className="document-row" key={item.key}>
            <div className="document-icon">PDF</div>

            <div>
              <strong>{item.name}</strong>
              <span>
                {item.storagePath ? "Firebase Storage · " : "Original file · "}
                {item.description}
              </span>
            </div>

            <a href={item.url} target="_blank" rel="noreferrer">
              View ↗
            </a>

            <button
              className="admin-button secondary"
              onClick={() => choose(item.key)}
            >
              Replace
            </button>

            <button
              className="admin-button secondary"
              disabled={!item.storagePath}
              onClick={() => restore(item)}
            >
              Restore
            </button>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
