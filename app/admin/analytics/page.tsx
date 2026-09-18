"use client";

import AdminShell from "@/components/admin/AdminShell";

export default function AnalyticsPage() {
  return (
    <AdminShell eyebrow="Performance" title="Analytics">
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Digital performance</p><h1>Analytics.</h1></div>
        <select className="admin-select"><option>Last 30 days</option><option>Last 7 days</option><option>Today</option></select>
      </div>
      <div className="admin-kpis">
        {["Visitors", "Page views", "Reservation actions", "Menu views"].map((x) => (
          <article className="admin-kpi" key={x}><div className="admin-kpi-head"><span>{x}</span></div><strong>—</strong><p>Awaiting analytics data</p></article>
        ))}
      </div>
      <div className="analytics-grid">
        <article className="admin-panel-card analytics-large"><p className="admin-eyebrow">Traffic</p><h2>Website activity</h2><div className="analytics-placeholder">GA4 reporting connection pending</div></article>
        <article className="admin-panel-card"><p className="admin-eyebrow">Top pages</p><h2>Popular content</h2>{["Home", "Menus", "Contact", "TR Home"].map(x => <div className="admin-stat-row" key={x}><span>{x}</span><strong>—</strong></div>)}</article>
        <article className="admin-panel-card"><p className="admin-eyebrow">Conversions</p><h2>Guest actions</h2>{["Phone calls", "Emails", "Food PDF", "Drinks PDF", "Breakfast PDF"].map(x => <div className="admin-stat-row" key={x}><span>{x}</span><strong>—</strong></div>)}</article>
      </div>
    </AdminShell>
  );
}
