import BreakfastMenuContent, {
  menu,
} from "@/components/BreakfastMenuContent";

export { menu };

const FALLBACK_HERO = "/images/home/6.jpg";

type Locale = "en" | "tr";

type InitialMenuData = {
  heroImage: string;
  initialMenuTitle: Record<Locale, string>;
  initialMenuSubtitle: Record<Locale, string>;
};

function stringValue(field: any): string {
  return typeof field?.stringValue === "string"
    ? field.stringValue
    : "";
}

async function getInitialMenuData(): Promise<InitialMenuData> {
  const fallback: InitialMenuData = {
    heroImage: FALLBACK_HERO,
    initialMenuTitle: {
      en: "Breakfast Menu",
      tr: "Kahvaltı Menüsü",
    },
    initialMenuSubtitle: {
      en: "Restaurant & Bar",
      tr: "Restaurant & Bar",
    },
  };

  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    return fallback;
  }

  const baseUrl =
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  try {
    const [mediaResponse, settingsResponse] =
      await Promise.all([
        fetch(`${baseUrl}/pageMedia/menus`, {
          next: { revalidate: 60 },
        }),
        fetch(`${baseUrl}/menuSettings/breakfast`, {
          next: { revalidate: 60 },
        }),
      ]);

    let heroImage = fallback.heroImage;
    let initialMenuTitle = fallback.initialMenuTitle;
    let initialMenuSubtitle = fallback.initialMenuSubtitle;

    if (mediaResponse.ok) {
      const mediaDocument = await mediaResponse.json();
      const rootFields = mediaDocument?.fields ?? {};
      const nestedFields =
        rootFields?.fields?.mapValue?.fields ?? {};

      const breakfastImage =
        stringValue(nestedFields?.breakfast) ||
        stringValue(rootFields?.breakfast);

      if (breakfastImage) {
        heroImage = breakfastImage;
      }
    }

    if (settingsResponse.ok) {
      const settingsDocument =
        await settingsResponse.json();
      const fields = settingsDocument?.fields ?? {};

      initialMenuTitle = {
        en:
          stringValue(fields.titleEN) ||
          fallback.initialMenuTitle.en,
        tr:
          stringValue(fields.titleTR) ||
          fallback.initialMenuTitle.tr,
      };

      initialMenuSubtitle = {
        en:
          stringValue(fields.subtitleEN) ||
          fallback.initialMenuSubtitle.en,
        tr:
          stringValue(fields.subtitleTR) ||
          fallback.initialMenuSubtitle.tr,
      };
    }

    return {
      heroImage,
      initialMenuTitle,
      initialMenuSubtitle,
    };
  } catch (error) {
    console.error(
      "Breakfast initial data could not be loaded on the server:",
      error
    );

    return fallback;
  }
}

export default async function BreakfastMenuPage() {
  const {
    heroImage,
    initialMenuTitle,
    initialMenuSubtitle,
  } = await getInitialMenuData();

  return (
    <BreakfastMenuContent
      heroImage={heroImage}
      initialMenuTitle={initialMenuTitle}
      initialMenuSubtitle={initialMenuSubtitle}
    />
  );
}
