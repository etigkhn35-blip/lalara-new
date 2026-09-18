"use client";

import AdminShell from "@/components/admin/AdminShell";

const menus = [
  ["Food Menu", "/lalara-menu.pdf", "Main food menu"],
  ["Drinks Menu", "/lalara-drinks.pdf", "Cocktails, wine & drinks"],
  ["Breakfast Menu", "/lalara-breakfast.pdf", "Breakfast menu"],
];

export default function MenusPage() {
  return (
    <AdminShell eyebrow="Website" title="Menus & PDFs">
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Documents</p><h1>Menus & PDFs.</h1></div>
      </div>
      <div className="document-list">
        {menus.map(([name, href, desc]) => (
          <article className="document-row" key={name}>
            <div className="document-icon">PDF</div>
            <div><strong>{name}</strong><span>{desc}</span></div>
            <a href={href} target="_blank" rel="noreferrer">View ↗</a>
            <label className="admin-button secondary">
              Replace
              <input type="file" accept="application/pdf" hidden />
            </label>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
