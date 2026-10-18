"use client";

import AdminShell from "@/components/admin/AdminShell";

const performanceCards = [
  {
    label: "Total Clicks",
    value: "—",
    note: "Search Console pending",
  },
  {
    label: "Total Impressions",
    value: "—",
    note: "Search Console pending",
  },
  {
    label: "Average CTR",
    value: "—",
    note: "Search Console pending",
  },
  {
    label: "Average Position",
    value: "—",
    note: "Search Console pending",
  },
];

export default function AdminSearchPage() {
  return (
  <AdminShell title="Google Search">
      <main className="search-console-page">
        <section className="search-hero">
          <div>
            <span className="search-eyebrow">
              GOOGLE SEARCH
            </span>

            <h1>Search performance.</h1>

            <p>
              Monitor how La Lara appears in Google
              Search and track organic visibility.
            </p>
          </div>

          <div className="connection-status">
            <span className="status-dot" />

            <div>
              <span className="status-label">
                SEARCH CONSOLE
              </span>

              <strong>Not connected</strong>
            </div>
          </div>
        </section>

        <section className="performance-grid">
          {performanceCards.map((card) => (
            <article
              className="performance-card"
              key={card.label}
            >
              <span>{card.label}</span>

              <strong>{card.value}</strong>

              <small>{card.note}</small>
            </article>
          ))}
        </section>

        <section className="search-layout">
          <article className="search-panel overview-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">
                  PERFORMANCE
                </span>

                <h2>Organic visibility</h2>
              </div>

              <span className="period">
                LAST 28 DAYS
              </span>
            </div>

            <div className="empty-chart">
              <div className="chart-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="empty-chart-copy">
                <span className="empty-icon">↗</span>

                <strong>
                  Search Console connection pending
                </strong>

                <p>
                  Clicks, impressions and average
                  position will appear here once the
                  Google Search Console integration is
                  connected.
                </p>
              </div>
            </div>
          </article>

          <article className="search-panel health-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">
                  SEARCH HEALTH
                </span>

                <h2>Website status</h2>
              </div>
            </div>

            <div className="health-list">
              <div className="health-row">
                <div>
                  <span>Sitemap</span>
                  <p>
                    XML sitemap available for Google.
                  </p>
                </div>

                <strong className="ready">
                  READY
                </strong>
              </div>

              <div className="health-row">
                <div>
                  <span>Robots.txt</span>
                  <p>
                    Search engine crawling rules.
                  </p>
                </div>

                <strong className="ready">
                  READY
                </strong>
              </div>

              <div className="health-row">
                <div>
                  <span>Search Console</span>
                  <p>
                    Google performance data.
                  </p>
                </div>

                <strong className="pending">
                  PENDING
                </strong>
              </div>
            </div>
          </article>
        </section>

        <section className="search-layout bottom-layout">
          <article className="search-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">
                  TOP QUERIES
                </span>

                <h2>What people search.</h2>
              </div>
            </div>

            <div className="empty-table">
              <span>QUERY</span>
              <span>CLICKS</span>
              <span>IMPRESSIONS</span>
              <span>POSITION</span>
            </div>

            <div className="table-placeholder">
              Search Console data will appear here.
            </div>
          </article>

          <article className="search-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-eyebrow">
                  TOP PAGES
                </span>

                <h2>Search landing pages.</h2>
              </div>
            </div>

            <div className="empty-table pages-table">
              <span>PAGE</span>
              <span>CLICKS</span>
              <span>IMPRESSIONS</span>
            </div>

            <div className="table-placeholder">
              Search Console data will appear here.
            </div>
          </article>
        </section>
      </main>

      <style jsx>{`
        .search-console-page {
          padding: 42px 44px 80px;
          background: #f4f1eb;
          min-height: 100vh;
          color: #30312f;
        }

        .search-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 42px;
        }

        .search-eyebrow,
        .panel-eyebrow,
        .status-label {
          display: block;
          margin-bottom: 12px;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8a8983;
        }

        .search-hero h1 {
          margin: 0;
          font-family: "Iowan Old Style",
            Baskerville, "Times New Roman", serif;
          font-size: clamp(48px, 5vw, 76px);
          font-weight: 400;
          line-height: 0.98;
          letter-spacing: -0.04em;
        }

        .search-hero p {
          max-width: 580px;
          margin: 18px 0 0;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 15px;
          line-height: 1.7;
          color: #74736e;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 220px;
          padding: 18px 20px;
          border: 1px solid rgba(48, 49, 47, 0.14);
          background: rgba(255, 255, 255, 0.55);
        }

        .connection-status .status-label {
          margin: 0 0 3px;
          font-size: 9px;
        }

        .connection-status strong {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 13px;
          font-weight: 500;
        }

        .status-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 9px;
          border-radius: 50%;
          background: #d5a3a0;
          box-shadow: 0 0 0 5px
            rgba(213, 163, 160, 0.16);
        }

        .performance-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 14px;
        }

        .performance-card,
        .search-panel {
          border: 1px solid rgba(48, 49, 47, 0.12);
          background: rgba(255, 255, 255, 0.62);
        }

        .performance-card {
          min-height: 158px;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .performance-card > span {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #74736e;
        }

        .performance-card strong {
          margin-top: 22px;
          font-family: "Iowan Old Style",
            Baskerville, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          line-height: 1;
        }

        .performance-card small {
          margin-top: auto;
          padding-top: 18px;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 10px;
          color: #9a9993;
        }

        .search-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr)
            minmax(300px, 0.7fr);
          gap: 14px;
          margin-bottom: 14px;
        }

        .bottom-layout {
          grid-template-columns: 1fr 1fr;
        }

        .search-panel {
          padding: 26px;
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 26px;
        }

        .panel-heading h2 {
          margin: 0;
          font-family: "Iowan Old Style",
            Baskerville, "Times New Roman", serif;
          font-size: 29px;
          font-weight: 400;
          letter-spacing: -0.025em;
        }

        .panel-eyebrow {
          margin-bottom: 8px;
          font-size: 9px;
        }

        .period {
          padding-top: 4px;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 9px;
          letter-spacing: 0.12em;
          color: #999791;
        }

        .empty-chart {
          position: relative;
          height: 310px;
          overflow: hidden;
          border-top: 1px solid
            rgba(48, 49, 47, 0.09);
        }

        .chart-lines {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
        }

        .chart-lines span {
          display: block;
          width: 100%;
          border-top: 1px solid
            rgba(48, 49, 47, 0.06);
        }

        .empty-chart-copy {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .empty-icon {
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border: 1px solid
            rgba(48, 49, 47, 0.2);
          border-radius: 50%;
          font-size: 17px;
        }

        .empty-chart-copy strong {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 13px;
          font-weight: 500;
        }

        .empty-chart-copy p {
          max-width: 410px;
          margin: 10px 0 0;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 12px;
          line-height: 1.65;
          color: #85847f;
        }

        .health-list {
          border-top: 1px solid
            rgba(48, 49, 47, 0.1);
        }

        .health-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 21px 0;
          border-bottom: 1px solid
            rgba(48, 49, 47, 0.1);
        }

        .health-row span {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 13px;
          font-weight: 500;
        }

        .health-row p {
          margin: 5px 0 0;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 11px;
          color: #85847f;
        }

        .health-row strong {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.12em;
        }

        .ready {
          color: #747b66;
        }

        .pending {
          color: #c8545d;
        }

        .empty-table {
          display: grid;
          grid-template-columns: minmax(0, 1fr)
            70px 100px 80px;
          gap: 12px;
          padding: 13px 0;
          border-top: 1px solid
            rgba(48, 49, 47, 0.1);
          border-bottom: 1px solid
            rgba(48, 49, 47, 0.1);
        }

        .pages-table {
          grid-template-columns: minmax(0, 1fr)
            70px 100px;
        }

        .empty-table span {
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #999791;
        }

        .empty-table span:not(:first-child) {
          text-align: right;
        }

        .table-placeholder {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: "Helvetica Neue", Helvetica,
            Arial, sans-serif;
          font-size: 11px;
          color: #999791;
        }

        @media (max-width: 1100px) {
          .performance-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-layout,
          .bottom-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .search-console-page {
            padding: 28px 18px 60px;
          }

          .search-hero {
            display: block;
          }

          .connection-status {
            margin-top: 28px;
          }

          .performance-grid {
            grid-template-columns: 1fr;
          }

          .search-panel {
            padding: 20px;
          }
        }
      `}</style>
    </AdminShell>
  );
}