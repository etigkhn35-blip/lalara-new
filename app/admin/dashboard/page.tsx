"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  return (
    <AdminShell
      eyebrow="Overview"
      title="Dashboard"
    >
      <div className="admin-overview">
        {/* PAGE INTRO */}

        <section className="admin-overview-heading">
          <div>
            <span className="admin-eyebrow">
              Management Studio
            </span>

            <h1>
              La Lara at a glance.
            </h1>
          </div>

          <p>
            Manage the website, menus, photography,
            events and digital performance from one place.
          </p>
        </section>

        {/* ANALYTICS SUMMARY */}

        <section className="admin-overview-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">
                Website
              </span>

              <h2>Performance</h2>
            </div>

            <Link href="/admin/analytics">
              View analytics →
            </Link>
          </div>

          <div className="admin-metric-grid">
            <article className="admin-metric">
              <span>Visitors</span>

              <strong>—</strong>

              <small>
                Analytics connection pending
              </small>
            </article>

            <article className="admin-metric">
              <span>Page views</span>

              <strong>—</strong>

              <small>
                Analytics connection pending
              </small>
            </article>

            <article className="admin-metric">
              <span>Reservations</span>

              <strong>—</strong>

              <small>
                WhatsApp · Phone · Email
              </small>
            </article>

            <article className="admin-metric">
              <span>Menu views</span>

              <strong>—</strong>

              <small>
                Food · Drinks · Breakfast
              </small>
            </article>
          </div>
        </section>

        {/* GOOGLE SEARCH */}

        <section className="admin-overview-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">
                Google
              </span>

              <h2>Search performance</h2>
            </div>

            <Link href="/admin/search">
              Open Google Search →
            </Link>
          </div>

          <div className="admin-metric-grid">
            <article className="admin-metric">
              <span>Clicks</span>

              <strong>—</strong>

              <small>
                Search Console pending
              </small>
            </article>

            <article className="admin-metric">
              <span>Impressions</span>

              <strong>—</strong>

              <small>
                Search Console pending
              </small>
            </article>

            <article className="admin-metric">
              <span>Average CTR</span>

              <strong>—</strong>

              <small>
                Search Console pending
              </small>
            </article>

            <article className="admin-metric">
              <span>Average position</span>

              <strong>—</strong>

              <small>
                Search Console pending
              </small>
            </article>
          </div>
        </section>

        {/* MANAGEMENT */}

        <section className="admin-overview-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">
                Manage
              </span>

              <h2>Website</h2>
            </div>
          </div>

          <div className="admin-management-grid">
            <Link
              href="/admin/content"
              className="admin-management-card"
            >
              <div>
                <span>01</span>

                <h3>Website</h3>

                <p>
                  Navigation, homepage, story,
                  contact and footer content.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              href="/admin/menus"
              className="admin-management-card"
            >
              <div>
                <span>02</span>

                <h3>Menus</h3>

                <p>
                  Food, drinks and breakfast
                  categories, items and prices.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              href="/admin/media"
              className="admin-management-card"
            >
              <div>
                <span>03</span>

                <h3>Gallery</h3>

                <p>
                  Add, remove, reorder and manage
                  photography.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              href="/admin/events"
              className="admin-management-card"
            >
              <div>
                <span>04</span>

                <h3>Private Events</h3>

                <p>
                  Manage events, descriptions
                  and slider photography.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              href="/admin/seo"
              className="admin-management-card"
            >
              <div>
                <span>05</span>

                <h3>SEO</h3>

                <p>
                  Titles, descriptions and
                  search visibility settings.
                </p>
              </div>

              <strong>→</strong>
            </Link>

            <Link
              href="/admin/settings"
              className="admin-management-card"
            >
              <div>
                <span>06</span>

                <h3>Settings</h3>

                <p>
                  Contact information, social
                  links and restaurant settings.
                </p>
              </div>

              <strong>→</strong>
            </Link>
          </div>
        </section>

        {/* STATUS */}

        <section className="admin-overview-status">
          <div>
            <span className="admin-eyebrow">
              Website status
            </span>

            <h2>La Lara Restaurant &amp; Bar</h2>
          </div>

          <div className="admin-overview-status-right">
            <span className="admin-published">
              Published
            </span>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open website ↗
            </a>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}