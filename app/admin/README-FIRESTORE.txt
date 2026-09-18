LA LARA CMS - FIRESTORE CONNECTED

Replace these files:
- app/admin/content/page.tsx
- app/admin/seo/page.tsx
- app/admin/settings/page.tsx

Keep/copy if not already present:
- components/admin/AdminShell.tsx
- other admin pages from this package

Append admin-inner-pages.css to app/globals.css if its styles are not already there.

WORKING NOW:
- Site Editor: loads and saves EN/TR section records.
- Save Draft -> status=draft
- Publish Changes -> status=published
- SEO EN/TR loads/saves.
- Settings contact/social loads/saves.
- updatedAt / updatedBy / updatedByEmail audit fields.

IMPORTANT:
Publishing to Firestore does NOT YET make the public homepage consume Firestore content.
The next integration step is to wire the public EN/TR pages to published Firestore records.

Current temporary Firestore rules allow any authenticated Firebase user to write CMS data.
Next security step: admins/{uid} authorization and stricter rules.
