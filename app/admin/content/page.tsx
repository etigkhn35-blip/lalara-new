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

const sections = [
  "Hero",
  "Intro",
  "At the Table",
  "Pink Elephant",
  "People Behind It",
  "Menus",
  "Experience",
  "Our Story",
  "Gallery",
  "Reservation",
];

type Language = "EN" | "TR";

type FormData = {
  eyebrow: string;
  heading: string;
  body: string;
  headingSize: number;
  textSize: number;
  buttonLabel: string;
};

const emptyForm: FormData = {
  eyebrow: "",
  heading: "",
  body: "",
  headingSize: 72,
  textSize: 12,
  buttonLabel: "",
};

function sectionKey(section: string) {
  return section
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

export default function ContentPage() {
  const [language, setLanguage] = useState<Language>("EN");
  const [section, setSection] = useState("Hero");
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("");

  const documentId = `${language.toLowerCase()}-${sectionKey(section)}`;

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setSaveState("");

      try {
        const snapshot = await getDoc(
          doc(db, "siteContent", documentId)
        );

        if (snapshot.exists()) {
          const data = snapshot.data();

          setForm({
            eyebrow: data.eyebrow ?? "",
            heading: data.heading ?? "",
            body: data.body ?? "",
            headingSize: data.headingSize ?? 72,
            textSize: data.textSize ?? 12,
            buttonLabel: data.buttonLabel ?? "",
          });
        } else {
          setForm(emptyForm);
        }
      } catch (error) {
        console.error(error);
        setSaveState("Could not load content.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [documentId]);

  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveContent(status: "draft" | "published") {
    const user = auth.currentUser;

    if (!user) {
      setSaveState("Session expired. Please sign in again.");
      return;
    }

    setSaveState(
      status === "draft" ? "Saving draft..." : "Publishing..."
    );

    try {
      await setDoc(
        doc(db, "siteContent", documentId),
        {
          ...form,
          language: language.toLowerCase(),
          section,
          sectionKey: sectionKey(section),
          status,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
          updatedByEmail: user.email ?? "",
        },
        {
          merge: true,
        }
      );

      setSaveState(
        status === "draft"
          ? "Draft saved ✓"
          : "Published ✓"
      );
    } catch (error) {
      console.error(error);
      setSaveState("Save failed. Check Firestore permissions.");
    }
  }

  return (
    <AdminShell eyebrow="Website" title="Site Editor">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Edit the website.</h1>
        </div>

        <div className="admin-segmented">
          <button
            className={language === "EN" ? "active" : ""}
            onClick={() => setLanguage("EN")}
          >
            EN
          </button>

          <button
            className={language === "TR" ? "active" : ""}
            onClick={() => setLanguage("TR")}
          >
            TR
          </button>
        </div>
      </div>

      <div className="editor-layout">
        <aside className="editor-sections">
          <span>Page sections</span>

          {sections.map((item) => (
            <button
              key={item}
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="editor-form admin-panel-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-eyebrow">{language} content</p>
              <h2>{section}</h2>
            </div>
          </div>

          {loading ? (
            <p className="admin-save-message">Loading content...</p>
          ) : (
            <>
              <label className="admin-field">
                <span>Eyebrow</span>
                <input
                  value={form.eyebrow}
                  onChange={(event) =>
                    updateField("eyebrow", event.target.value)
                  }
                  placeholder="Yalıkavak · Bodrum"
                />
              </label>

              <label className="admin-field">
                <span>Heading</span>
                <textarea
                  rows={3}
                  value={form.heading}
                  onChange={(event) =>
                    updateField("heading", event.target.value)
                  }
                  placeholder="Main section heading"
                />
              </label>

              <label className="admin-field">
                <span>Body copy</span>
                <textarea
                  rows={6}
                  value={form.body}
                  onChange={(event) =>
                    updateField("body", event.target.value)
                  }
                  placeholder="Section text"
                />
              </label>

              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Heading size</span>
                  <input
                    type="number"
                    value={form.headingSize}
                    onChange={(event) =>
                      updateField(
                        "headingSize",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Text size</span>
                  <input
                    type="number"
                    value={form.textSize}
                    onChange={(event) =>
                      updateField(
                        "textSize",
                        Number(event.target.value)
                      )
                    }
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Button label</span>
                <input
                  value={form.buttonLabel}
                  onChange={(event) =>
                    updateField("buttonLabel", event.target.value)
                  }
                  placeholder="Discover our menus"
                />
              </label>

              {saveState && (
                <p className="admin-save-message">{saveState}</p>
              )}

              <div className="admin-form-actions">
                <button
                  className="admin-button secondary"
                  onClick={() => saveContent("draft")}
                >
                  Save draft
                </button>

                <button
                  className="admin-button primary"
                  onClick={() => saveContent("published")}
                >
                  Publish changes
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="editor-preview admin-panel-card">
          <div className="preview-toolbar">
            <span>Live preview</span>
          </div>

          <div className="preview-canvas">
            <span>
              {form.eyebrow || `${language} · ${section}`}
            </span>

            <h3
              style={{
                fontSize: `${Math.min(form.headingSize, 80)}px`,
              }}
            >
              {form.heading || "Your changes appear here."}
            </h3>

            <p
              style={{
                fontSize: `${Math.min(form.textSize, 18)}px`,
              }}
            >
              {form.body || "Edit the fields to preview this section."}
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
