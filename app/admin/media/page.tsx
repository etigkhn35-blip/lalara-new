"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db, storage } from "@/lib/firebase";

type MediaItem = {
  key: string;
  name: string;
  fallback: string;
  url: string;
  storagePath?: string;
};

const initialImages: MediaItem[] = [
  { key: "hero", name: "Hero", fallback: "/images/home/1.jpg", url: "/images/home/1.jpg" },
  { key: "atmosphere", name: "Atmosphere", fallback: "/images/home/2.jpg", url: "/images/home/2.jpg" },
  { key: "food", name: "Food", fallback: "/images/home/3.jpg", url: "/images/home/3.jpg" },
  { key: "drinks", name: "Drinks", fallback: "/images/home/4.jpg", url: "/images/home/4.jpg" },
  { key: "breakfast", name: "Breakfast", fallback: "/images/home/5.jpg", url: "/images/home/5.jpg" },
  { key: "sunset", name: "Sunset", fallback: "/images/home/6.jpg", url: "/images/home/6.jpg" },
  { key: "story", name: "Story", fallback: "/images/home/7.jpg", url: "/images/home/7.jpg" },
  { key: "gallery", name: "Gallery", fallback: "/images/home/8.jpg", url: "/images/home/8.jpg" },
];

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>(initialImages);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "media"));
        const saved = snap.data()?.images as Record<string, { url?: string; storagePath?: string }> | undefined;
        if (!saved) return;
        setImages((items) => items.map((item) => ({
          ...item,
          url: saved[item.key]?.url || item.fallback,
          storagePath: saved[item.key]?.storagePath || undefined,
        })));
      } catch (error) {
        console.error(error);
        setMessage("Media could not be loaded.");
      }
    })();
  }, []);

  async function persist(next: MediaItem[]) {
    const user = auth.currentUser;
    if (!user) throw new Error("Session expired");

    await setDoc(doc(db, "siteSettings", "media"), {
      images: Object.fromEntries(next.map((item) => [item.key, {
        name: item.name,
        url: item.url,
        storagePath: item.storagePath || "",
      }])),
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
      updatedByEmail: user.email || "",
    }, { merge: true });
  }

  function selectFile(key: string) {
    setTarget(key);
    inputRef.current?.click();
  }

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !target) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10 MB.");
      return;
    }

    const old = images.find((item) => item.key === target);
    if (!old) return;

    setBusy(target);
    setMessage(`Uploading ${old.name}...`);

    try {
      const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
      const path = `website/home/${target}-${Date.now()}.${ext}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file, { contentType: file.type });
      const url = await getDownloadURL(fileRef);

      const next = images.map((item) =>
        item.key === target ? { ...item, url, storagePath: path } : item
      );
      await persist(next);
      setImages(next);

      if (old.storagePath) {
        try { await deleteObject(ref(storage, old.storagePath)); } catch {}
      }
      setMessage(`${old.name} updated ✓`);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Check Firebase Storage and Storage Rules.");
    } finally {
      setBusy("");
    }
  }

  async function remove(item: MediaItem) {
    if (!confirm(`Delete custom ${item.name} image and restore original?`)) return;
    setBusy(item.key);
    try {
      if (item.storagePath) {
        try { await deleteObject(ref(storage, item.storagePath)); } catch {}
      }
      const next = images.map((x) =>
        x.key === item.key ? { ...x, url: x.fallback, storagePath: undefined } : x
      );
      await persist(next);
      setImages(next);
      setMessage(`${item.name} restored to original ✓`);
    } catch (error) {
      console.error(error);
      setMessage("Delete failed. Check Firebase permissions.");
    } finally {
      setBusy("");
    }
  }

  async function save() {
    setMessage("Saving...");
    try {
      await persist(images);
      setMessage("Media library saved ✓");
    } catch (error) {
      console.error(error);
      setMessage("Save failed. Check Firebase permissions.");
    }
  }

  return (
    <AdminShell eyebrow="Website" title="Media Library">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />

      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Photography</p>
          <h1>Media library.</h1>
        </div>
        <button className="admin-button primary" onClick={save}>Save</button>
      </div>

      {message && <p className="admin-save-message">{message}</p>}

      <div className="media-grid">
        {images.map((item) => (
          <article className="media-card" key={item.key}>
            <img src={item.url} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{item.storagePath ? "Firebase Storage" : "Original website image"}</span>
            </div>
            <div className="admin-form-actions">
              <button disabled={busy === item.key} onClick={() => selectFile(item.key)}>
                {busy === item.key ? "Working..." : "Replace"}
              </button>
              <button disabled={busy === item.key} onClick={() => remove(item)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-note">
        Replace uploads to Firebase Storage and saves the image reference in Firestore.
        Delete restores the original website image.
      </div>
    </AdminShell>
  );
}
