"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

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
    label: "Website",
    href: "/admin/content",
    icon: "✦",
  },
  {
    label: "Menus",
    href: "/admin/menus",
    icon: "≡",
  },
  {
    label: "Gallery",
    href: "/admin/media",
    icon: "▧",
  },
  {
    label: "Private Events",
    href: "/admin/events",
    icon: "◇",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: "↗",
  },
  {
    label: "Google Search",
    href: "/admin/search",
    icon: "◎",
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: "◉",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function AdminShell({
  title,
  eyebrow = "La Lara",
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin");
  }

  function isActive(href: string) {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
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

        <span>
          Loading Management Studio
        </span>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      {/* SIDEBAR */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "is-open" : ""
        }`}
      >
        <div className="admin-sidebar-top">
          <Link
            href="/admin/dashboard"
            className="admin-sidebar-brand"
          >
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={230}
              height={85}
              priority
            />
          </Link>

          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="admin-sidebar-label">
          Management Studio
        </div>

        <nav className="admin-navigation">
          {navigation.map((item) => {
            const active =
              isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-item ${
                  active ? "active" : ""
                }`}
              >
                <span className="admin-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">
              {user?.email
                ?.charAt(0)
                .toUpperCase() || "A"}
            </div>

            <div>
              <strong>
                Administrator
              </strong>

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

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      {/* MAIN */}

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open navigation"
            >
              <span />
              <span />
            </button>

            <div>
              <span>{eyebrow}</span>

              <strong>{title}</strong>
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

        <div className="admin-content admin-page-content">
          {children}
        </div>
      </section>
    </main>
  );
}