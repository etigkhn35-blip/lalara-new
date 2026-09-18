"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navigation: NavItem[] = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: "⌂",
  },
  {
    label: "Site Editor",
    href: "/admin/content",
    icon: "✦",
  },
  {
    label: "Media Library",
    href: "/admin/media",
    icon: "▧",
  },
  {
    label: "Menus & PDFs",
    href: "/admin/menus",
    icon: "≡",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: "↗",
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: "◎",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          router.replace("/admin");
          return;
        }

        setUser(firebaseUser);
        setCheckingAuth(false);
      }
    );

    return unsubscribe;
  }, [router]);

  async function handleLogout() {
    await signOut(auth);

    router.replace("/admin");
  }

  if (checkingAuth) {
    return (
      <main className="admin-loading">
        <Image
          src="/lalara-logo.png"
          alt="La Lara"
          width={220}
          height={82}
          priority
        />

        <span>Loading Management Studio</span>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="admin-sidebar-top">
          <a
            href="/admin/dashboard"
            className="admin-sidebar-brand"
          >
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={210}
              height={78}
              priority
            />
          </a>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="admin-sidebar-label">
          Management Studio
        </div>

        <nav className="admin-navigation">
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={
                index === 0
                  ? "admin-nav-item active"
                  : "admin-nav-item"
              }
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {user?.email
                ?.charAt(0)
                .toUpperCase() || "A"}
            </div>

            <div>
              <strong>Administrator</strong>

              <span>
                {user?.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <span />
              <span />
            </button>

            <div>
              <span>La Lara</span>

              <strong>
                Management Studio
              </strong>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-view-site"
            >
              View website ↗
            </a>

            <div className="admin-status">
              <i />
              Live
            </div>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome">
            <div>
              <p className="admin-eyebrow">
                Overview
              </p>

              <h1>
                Good evening.
                <br />
                Here&apos;s La Lara.
              </h1>
            </div>

            <p className="admin-welcome-copy">
              Manage the website, update content and
              follow La Lara&apos;s digital performance
              from one place.
            </p>
          </section>

          <section className="admin-kpis">
            <article className="admin-kpi">
              <div className="admin-kpi-head">
                <span>Visitors today</span>
                <small>Today</small>
              </div>

              <strong>—</strong>

              <p>
                Analytics connection pending
              </p>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-head">
                <span>Last 7 days</span>
                <small>7D</small>
              </div>

              <strong>—</strong>

              <p>
                Analytics connection pending
              </p>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-head">
                <span>Last 30 days</span>
                <small>30D</small>
              </div>

              <strong>—</strong>

              <p>
                Analytics connection pending
              </p>
            </article>

            <article className="admin-kpi">
              <div className="admin-kpi-head">
                <span>Reservation actions</span>
                <small>30D</small>
              </div>

              <strong>—</strong>

              <p>
                Calls · Email · Menu clicks
              </p>
            </article>
          </section>

          <section className="admin-dashboard-grid">
            <article className="admin-performance-card">
              <div className="admin-card-heading">
                <div>
                  <p className="admin-eyebrow">
                    Performance
                  </p>

                  <h2>
                    Website activity
                  </h2>
                </div>

                <button type="button">
                  Last 30 days⌄
                </button>
              </div>

              <div className="admin-chart-empty">
                <div className="admin-chart-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div>
                  <strong>
                    Analytics is ready to connect.
                  </strong>

                  <p>
                    Visitor activity will appear here
                    after we connect the reporting layer.
                  </p>
                </div>
              </div>
            </article>

            <article className="admin-quick-card">
              <div className="admin-card-heading">
                <div>
                  <p className="admin-eyebrow">
                    Quick access
                  </p>

                  <h2>
                    Website
                  </h2>
                </div>
              </div>

              <div className="admin-quick-links">
                <a href="/admin/content">
                  <div>
                    <span>01</span>

                    <strong>
                      Edit website content
                    </strong>
                  </div>

                  <i>→</i>
                </a>

                <a href="/admin/media">
                  <div>
                    <span>02</span>

                    <strong>
                      Change photography
                    </strong>
                  </div>

                  <i>→</i>
                </a>

                <a href="/admin/menus">
                  <div>
                    <span>03</span>

                    <strong>
                      Replace menu PDFs
                    </strong>
                  </div>

                  <i>→</i>
                </a>

                <a href="/admin/seo">
                  <div>
                    <span>04</span>

                    <strong>
                      SEO settings
                    </strong>
                  </div>

                  <i>→</i>
                </a>
              </div>
            </article>
          </section>

          <section className="admin-lower-grid">
            <article className="admin-site-card">
              <div className="admin-card-heading">
                <div>
                  <p className="admin-eyebrow">
                    Website content
                  </p>

                  <h2>
                    Home page
                  </h2>
                </div>

                <span className="admin-published">
                  Published
                </span>
              </div>

              <div className="admin-site-preview">
                <div className="admin-site-preview-image">
                  <Image
                    src="/images/home/1.jpg"
                    alt="La Lara homepage"
                    fill
                    sizes="600px"
                    className="cover"
                  />

                  <div />
                </div>

                <div className="admin-site-preview-info">
                  <div>
                    <span>Languages</span>

                    <strong>
                      English · Türkçe
                    </strong>
                  </div>

                  <div>
                    <span>Sections</span>

                    <strong>10 sections</strong>
                  </div>

                  <a href="/admin/content">
                    Open Site Editor →
                  </a>
                </div>
              </div>
            </article>

            <article className="admin-actions-card">
              <div className="admin-card-heading">
                <div>
                  <p className="admin-eyebrow">
                    Engagement
                  </p>

                  <h2>
                    Key actions
                  </h2>
                </div>
              </div>

              <div className="admin-action-row">
                <span>
                  Reservation calls
                </span>

                <strong>—</strong>
              </div>

              <div className="admin-action-row">
                <span>
                  Reservation emails
                </span>

                <strong>—</strong>
              </div>

              <div className="admin-action-row">
                <span>
                  Food menu views
                </span>

                <strong>—</strong>
              </div>

              <div className="admin-action-row">
                <span>
                  Drinks menu views
                </span>

                <strong>—</strong>
              </div>

              <div className="admin-action-row">
                <span>
                  Breakfast menu views
                </span>

                <strong>—</strong>
              </div>
            </article>
          </section>

          <footer className="admin-dashboard-footer">
            <span>
              La Lara Restaurant &amp; Bar
            </span>

            <span>
              Management Studio · 2026
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}