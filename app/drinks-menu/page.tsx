import DrinksMenuContent, {
  menu,
  type DrinksInitialSettings,
} from "@/components/DrinksMenuContent";

export { menu };

const FALLBACK_HERO = "/images/home/2.jpg";

const FALLBACK_SETTINGS: DrinksInitialSettings = {
  titleEN: "Drinks Menu",
  titleTR: "İçecek Menüsü",
  subtitleEN: "Restaurant & Bar",
  subtitleTR: "Restaurant & Bar",
};

function stringValue(field: any): string {
  return typeof field?.stringValue === "string" ? field.stringValue : "";
}

async function getInitialDrinksData() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    return { heroImage: FALLBACK_HERO, settings: FALLBACK_SETTINGS };
  }

  try {
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  const [mediaResponse, settingsResponse] = await Promise.all([
    fetch(`${base}/pageMedia/menus`, {
      cache: "no-store",
    }),
    fetch(`${base}/menuSettings/drinks`, {
      next: { revalidate: 60 },
    }),
  ]);

    let heroImage = FALLBACK_HERO;
    let settings = { ...FALLBACK_SETTINGS };

    if (mediaResponse.ok) {
      const document = await mediaResponse.json();
      const fields = document?.fields ?? {};
      const nested = stringValue(fields?.fields?.mapValue?.fields?.drinks);
      const topLevel = stringValue(fields?.drinks);
      heroImage = nested.trim() || topLevel.trim() || FALLBACK_HERO;
    }

    if (settingsResponse.ok) {
      const document = await settingsResponse.json();
      const fields = document?.fields ?? {};
      settings = {
        titleEN: stringValue(fields.titleEN).trim() || FALLBACK_SETTINGS.titleEN,
        titleTR: stringValue(fields.titleTR).trim() || FALLBACK_SETTINGS.titleTR,
        subtitleEN: stringValue(fields.subtitleEN).trim() || FALLBACK_SETTINGS.subtitleEN,
        subtitleTR: stringValue(fields.subtitleTR).trim() || FALLBACK_SETTINGS.subtitleTR,
      };
    }

    return { heroImage, settings };
  } catch (error) {
    console.error("Drinks initial data could not be loaded:", error);
    return { heroImage: FALLBACK_HERO, settings: FALLBACK_SETTINGS };
  }
}

export default async function DrinksMenuPage() {
  const { heroImage, settings } = await getInitialDrinksData();

  return (
    <DrinksMenuContent
      heroImage={heroImage}
      initialSettings={settings}
    />
  );
}
