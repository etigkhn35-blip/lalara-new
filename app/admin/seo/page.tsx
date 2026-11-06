
"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";

type Language = "EN" | "TR";

type SeoForm = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
};

const pages = [
  { key: "home", label: "Homepage", pathEN: "/", pathTR: "/tr" },
  { key: "story", label: "Our Story", pathEN: "/our-story", pathTR: "/tr/hikayemiz" },
  { key: "menus", label: "Menu", pathEN: "/menu", pathTR: "/tr/menu" },
  { key: "offers", label: "Offers", pathEN: "/offers", pathTR: "/tr/offers" },
  { key: "private-events", label: "Private Events", pathEN: "/private-events", pathTR: "/tr/ozel-etkinlikler" },
  { key: "contact", label: "Contact", pathEN: "/contact", pathTR: "/tr/iletisim" },
] as const;

type PageKey = (typeof pages)[number]["key"];

const blank: SeoForm = {
  title: "",
  description: "",
  canonical: "",
  ogImage: "/images/home/1.jpg",
};

export default function SeoPage() {
  const [lang, setLang] = useState<Language>("EN");
  const [page, setPage] = useState<PageKey>("home");
  const [form, setForm] = useState<SeoForm>(blank);
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = pages.find((item) => item.key === page) ?? pages[0];
  const documentId = `${page}-${lang.toLowerCase()}`;

  useEffect(() => {
    let active = true;
    setBusy(true);
    setState("Loading SEO settings...");

    getDoc(doc(db, "seo", documentId))
      .then((snapshot) => {
        if (!active) return;

        const data = snapshot.data();

        setForm({
          title: typeof data?.title === "string" ? data.title : "",
          description: typeof data?.description === "string" ? data.description : "",
          canonical: typeof data?.canonical === "string" ? data.canonical : "",
          ogImage: typeof data?.ogImage === "string" ? data.ogImage : blank.ogImage,
        });

        setState("");
      })
      .catch((error) => {
        console.error("SEO load failed", error);
        if (active) setState("Could not load SEO settings.");
      })
      .finally(() => {
        if (active) setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [documentId]);

  async function saveSeo() {
    const user = auth.currentUser;

    if (!user) {
      setState("Session expired.");
      return;
    }

    setBusy(true);
    setState("Saving...");

    try {
      await setDoc(
        doc(db, "seo", documentId),
        {
          ...form,
          language: lang.toLowerCase(),
          page,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
          updatedByEmail: user.email ?? "",
        },
        { merge: true }
      );

      setState("SEO settings saved ✓");
    } catch (error) {
      console.error("SEO save failed", error);
      setState("Save failed. Check Firestore permissions.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell eyebrow="Discoverability" title="SEO">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Search & social</p>
          <h1>SEO settings.</h1>
        </div>

        <div className="admin-segmented">
          {(["EN", "TR"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={lang === value ? "active" : ""}
              onClick={() => setLang(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <section className="admin-panel-card seo-form">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">Page-specific SEO</p>
            <h2>{selected.label} · {lang}</h2>
          </div>
        </div>

        <label className="admin-field">
          <span>Website page</span>

          <select
            className="admin-select"
            value={page}
            onChange={(event) => setPage(event.target.value as PageKey)}
          >
            {pages.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>

          <small>
            Page route: {lang === "EN" ? selected.pathEN : selected.pathTR}
          </small>
        </label>

        <label className="admin-field">
          <span>Meta title</span>
          <input
            disabled={busy}
            value={form.title}
            onChange={(event) =>
              setForm((old) => ({ ...old, title: event.target.value }))
            }
          />
          <small>{form.title.length} characters</small>
        </label>

        <label className="admin-field">
          <span>Meta description</span>
          <textarea
            disabled={busy}
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((old) => ({ ...old, description: event.target.value }))
            }
          />
          <small>{form.description.length} characters</small>
        </label>

        <label className="admin-field">
          <span>Canonical URL</span>
          <input
            disabled={busy}
            value={form.canonical}
            onChange={(event) =>
              setForm((old) => ({ ...old, canonical: event.target.value }))
            }
          />
        </label>

        <label className="admin-field">
          <span>Open Graph image</span>
          <input
            disabled={busy}
            value={form.ogImage}
            onChange={(event) =>
              setForm((old) => ({ ...old, ogImage: event.target.value }))
            }
          />
        </label>

        {state && (
          <p className="admin-save-message" role="status">
            {state}
          </p>
        )}

        <div className="admin-form-actions">
          <button
            type="button"
            disabled={busy}
            className="admin-button primary"
            onClick={saveSeo}
          >
            Save SEO settings
          </button>
        </div>
      </section>
    </AdminShell>
  );
}
