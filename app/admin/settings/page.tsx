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

type SettingsForm = {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tripadvisor: string;
};

const defaults: SettingsForm = {
  phone: "+90 545 894 18 38",
  email: "reservation.bodrum@lalara.com.tr",
  address:
    "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",
  instagram: "https://www.instagram.com/lalara.bodrum/",
  facebook: "https://www.facebook.com/lalararestaurant",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaults);
  const [state, setState] = useState("Loading...");

  useEffect(() => {
    async function loadSettings() {
      try {
        const [contactSnapshot, socialSnapshot] =
          await Promise.all([
            getDoc(doc(db, "siteSettings", "contact")),
            getDoc(doc(db, "siteSettings", "social")),
          ]);

        setForm({
          phone:
            contactSnapshot.data()?.phone ?? defaults.phone,
          email:
            contactSnapshot.data()?.email ?? defaults.email,
          address:
            contactSnapshot.data()?.address ?? defaults.address,
          instagram:
            socialSnapshot.data()?.instagram ??
            defaults.instagram,
          facebook:
            socialSnapshot.data()?.facebook ??
            defaults.facebook,
          tripadvisor:
            socialSnapshot.data()?.tripadvisor ??
            defaults.tripadvisor,
        });

        setState("");
      } catch (error) {
        console.error(error);
        setState("Could not load settings.");
      }
    }

    loadSettings();
  }, []);

  async function saveSettings() {
    const user = auth.currentUser;

    if (!user) {
      setState("Session expired.");
      return;
    }

    setState("Saving...");

    try {
      const audit = {
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        updatedByEmail: user.email ?? "",
      };

      await Promise.all([
        setDoc(
          doc(db, "siteSettings", "contact"),
          {
            phone: form.phone,
            email: form.email,
            address: form.address,
            ...audit,
          },
          { merge: true }
        ),
        setDoc(
          doc(db, "siteSettings", "social"),
          {
            instagram: form.instagram,
            facebook: form.facebook,
            tripadvisor: form.tripadvisor,
            ...audit,
          },
          { merge: true }
        ),
      ]);

      setState("Settings saved ✓");
    } catch (error) {
      console.error(error);
      setState("Save failed. Check Firestore permissions.");
    }
  }

  return (
    <AdminShell eyebrow="Configuration" title="Settings">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">
            Restaurant information
          </p>
          <h1>Site settings.</h1>
        </div>
      </div>

      <div className="settings-grid">
        <section className="admin-panel-card">
          <p className="admin-eyebrow">Contact</p>
          <h2>Restaurant details</h2>

          <label className="admin-field">
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(event) =>
                setForm({
                  ...form,
                  phone: event.target.value,
                })
              }
            />
          </label>

          <label className="admin-field">
            <span>Email</span>
            <input
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />
          </label>

          <label className="admin-field">
            <span>Address</span>
            <textarea
              rows={4}
              value={form.address}
              onChange={(event) =>
                setForm({
                  ...form,
                  address: event.target.value,
                })
              }
            />
          </label>
        </section>

        <section className="admin-panel-card">
          <p className="admin-eyebrow">Social media</p>
          <h2>Social profiles</h2>

          <label className="admin-field">
            <span>Instagram</span>
            <input
              value={form.instagram}
              onChange={(event) =>
                setForm({
                  ...form,
                  instagram: event.target.value,
                })
              }
            />
          </label>

          <label className="admin-field">
            <span>Facebook</span>
            <input
              value={form.facebook}
              onChange={(event) =>
                setForm({
                  ...form,
                  facebook: event.target.value,
                })
              }
            />
          </label>

          <label className="admin-field">
            <span>Tripadvisor</span>
            <textarea
              rows={3}
              value={form.tripadvisor}
              onChange={(event) =>
                setForm({
                  ...form,
                  tripadvisor: event.target.value,
                })
              }
            />
          </label>
        </section>
      </div>

      {state && <p className="admin-save-message">{state}</p>}

      <div className="admin-form-actions">
        <button
          className="admin-button primary"
          onClick={saveSettings}
        >
          Save settings
        </button>
      </div>
    </AdminShell>
  );
}
