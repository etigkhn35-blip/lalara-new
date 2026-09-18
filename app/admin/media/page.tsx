"use client";

import AdminShell from "@/components/admin/AdminShell";

const images = [
  ["Hero", "/images/home/1.jpg"], ["Atmosphere", "/images/home/2.jpg"],
  ["Food", "/images/home/3.jpg"], ["Drinks", "/images/home/4.jpg"],
  ["Breakfast", "/images/home/5.jpg"], ["Sunset", "/images/home/6.jpg"],
  ["Story", "/images/home/7.jpg"], ["Gallery", "/images/home/8.jpg"],
];

export default function MediaPage() {
  return (
    <AdminShell eyebrow="Website" title="Media Library">
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Photography</p><h1>Media library.</h1></div>
        <button className="admin-button primary">Upload image</button>
      </div>
      <div className="media-grid">
        {images.map(([name, src]) => (
          <article className="media-card" key={name}>
            <img src={src} alt={name} />
            <div><strong>{name}</strong><span>Website image</span></div>
            <button>Replace</button>
          </article>
        ))}
      </div>
      <div className="admin-note">Firebase Storage upload controls will be connected here. Existing website images are shown as the initial library.</div>
    </AdminShell>
  );
}
