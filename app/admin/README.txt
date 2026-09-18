LA LARA ADMIN - INNER PAGES

Copy:
components/admin/AdminShell.tsx -> components/admin/AdminShell.tsx

Pages:
app/admin/content/page.tsx
app/admin/media/page.tsx
app/admin/menus/page.tsx
app/admin/analytics/page.tsx
app/admin/seo/page.tsx
app/admin/settings/page.tsx

Append admin-inner-pages.css to the END of app/globals.css.

IMPORTANT:
- These pages already use Firebase Auth through the existing lib/firebase.ts.
- Content/media/settings controls are UI-ready, but Save/Upload actions are intentionally not yet writing to Firestore/Storage.
- Analytics values intentionally show "—" until GA4 reporting is connected.
- Next step: create Firestore schema + admin authorization + Storage rules, then wire each Save/Upload button.
