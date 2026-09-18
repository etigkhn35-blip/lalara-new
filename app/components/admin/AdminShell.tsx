"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const nav = [
  ["Overview", "/admin/dashboard"],
  ["Site Editor", "/admin/content"],
  ["Media Library", "/admin/media"],
  ["Menus & PDFs", "/admin/menus"],
  ["Analytics", "/admin/analytics"],
  ["SEO", "/admin/seo"],
  ["Settings", "/admin/settings"],
];

export default function AdminShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin");
        return;
      }
      setReady(true);
    });
  }, [router]);

  if (!ready) {
    return <main className="admin-loading">Loading Management Studio</main>;
  }

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${menu ? "is-open" : ""}`}>
        <div className="admin-sidebar-top">
          <Link href="/admin/dashboard" className="admin-sidebar-brand">
            <Image src="/lalara-logo.png" alt="La Lara" width={210} height={78} />
          </Link>
          <button className="admin-sidebar-close" onClick={() => setMenu(false)}>×</button>
        </div>

        <div className="admin-sidebar-label">Management Studio</div>

        <nav className="admin-navigation">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              className={`admin-nav-item ${pathname === href ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-logout"
            onClick={async () => {
              await signOut(auth);
              router.replace("/admin");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {menu && <button className="admin-sidebar-overlay" onClick={() => setMenu(false)} />}

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-menu" onClick={() => setMenu(true)}>
              <span />
              <span />
            </button>
            <div>
              <span>{eyebrow}</span>
              <strong>{title}</strong>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
              View website ↗
            </a>
            <div className="admin-status"><i /> Live</div>
          </div>
        </header>

        <div className="admin-content admin-page-content">{children}</div>
      </section>
    </main>
  );
}
