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

type SeoForm = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
};

const emptySeo: SeoForm = {
  title: "",
  description: "",
  canonical: "",
  ogImage: "/images/home/1.jpg",
};

export default function SeoPage() {
  const [lang, setLang] = useState<"EN" | "TR">("EN");
  const [form, setForm] = useState<SeoForm>(emptySeo);
  const [state, setState] = useState("");

  useEffect(() => {
    async function loadSeo() {
      setState("Loading...");

      try {
        const snapshot = await getDoc(
          doc(db, "seo", `home-${lang.toLowerCase()}`)
        );

        if (snapshot.exists()) {
          const data = snapshot.data();

          setForm({
            title: data.title ?? "",
            description: data.description ?? "",
            canonical: data.canonical ?? "",
            ogImage: data.ogImage ?? "/images/home/1.jpg",
          });
        } else {
          setForm(emptySeo);
        }

        setState("");
      } catch (error) {
        console.error(error);
        setState("Could not load SEO settings.");
      }
    }

    loadSeo();
  }, [lang]);

  async function saveSeo() {
    const user = auth.currentUser;

    if (!user) {
      setState("Session expired.");
      return;
    }

    setState("Saving...");

    try {
      await setDoc(
        doc(db, "seo", `home-${lang.toLowerCase()}`),
        {
          ...form,
          language: lang.toLowerCase(),
          page: "home",
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
          updatedByEmail: user.email ?? "",
        },
        {
          merge: true,
        }
      );

      setState("SEO settings saved ✓");
    } catch (error) {
      console.error(error);
      setState("Save failed. Check Firestore permissions.");
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
          <button
            className={lang === "EN" ? "active" : ""}
            onClick={() => setLang("EN")}
          >
            EN
          </button>

          <button
            className={lang === "TR" ? "active" : ""}
            onClick={() => setLang("TR")}
          >
            TR
          </button>
        </div>
      </div>

      <section className="admin-panel-card seo-form">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">{lang} homepage</p>
            <h2>Search appearance</h2>
          </div>
        </div>

        <label className="admin-field">
          <span>Meta title</span>
          <input
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
          <small>{form.title.length} characters</small>
        </label>

        <label className="admin-field">
          <span>Meta description</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
          />
          <small>{form.description.length} characters</small>
        </label>

        <label className="admin-field">
          <span>Canonical URL</span>
          <input
            value={form.canonical}
            onChange={(event) =>
              setForm({
                ...form,
                canonical: event.target.value,
              })
            }
          />
        </label>

        <label className="admin-field">
          <span>Open Graph image</span>
          <input
            value={form.ogImage}
            onChange={(event) =>
              setForm({
                ...form,
                ogImage: event.target.value,
              })
            }
          />
        </label>

        {state && <p className="admin-save-message">{state}</p>}

        <div className="admin-form-actions">
          <button
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
