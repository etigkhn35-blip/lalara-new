import FoodMenuContent, {
  menu,
  type FoodInitialSettings,
} from "@/components/FoodMenuContent";

export { menu };

const fallbackSettings: FoodInitialSettings = {
  titleEN: "Food Menu",
  titleTR: "Yemek Menüsü",
  subtitleEN: "Restaurant & Bar",
  subtitleTR: "Restaurant & Bar",
};

function getStringValue(field: any, fallback: string) {
  return typeof field?.stringValue === "string"
    ? field.stringValue
    : fallback;
}

async function getInitialFoodData() {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    return {
      heroImage: "/images/home/3.jpg",
      initialSettings: fallbackSettings,
    };
  }

  try {
    const base =
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

    const [mediaResponse, settingsResponse] =
      await Promise.all([
        fetch(`${base}/pageMedia/menus`, {
          cache: "no-store",
        }),

        fetch(`${base}/menuSettings/food`, {
          cache: "no-store",
        }),
      ]);

    const mediaDocument =
      mediaResponse.ok
        ? await mediaResponse.json()
        : null;

    const settingsDocument =
      settingsResponse.ok
        ? await settingsResponse.json()
        : null;

    /*
     * Admin Media:
     *
     * pageMedia / menus
     *   fields
     *     food
     */
    const heroImage =
      mediaDocument?.fields?.fields?.mapValue?.fields
        ?.food?.stringValue ||
      mediaDocument?.fields?.food?.stringValue ||
      "/images/home/3.jpg";

    const fields =
      settingsDocument?.fields;

    const initialSettings: FoodInitialSettings = {
      titleEN: getStringValue(
        fields?.titleEN,
        fallbackSettings.titleEN
      ),

      titleTR: getStringValue(
        fields?.titleTR,
        fallbackSettings.titleTR
      ),

      subtitleEN: getStringValue(
        fields?.subtitleEN,
        fallbackSettings.subtitleEN
      ),

      subtitleTR: getStringValue(
        fields?.subtitleTR,
        fallbackSettings.subtitleTR
      ),
    };

    return {
      heroImage,
      initialSettings,
    };
  } catch (error) {
    console.error(
      "Food initial data could not be loaded:",
      error
    );

    return {
      heroImage: "/images/home/3.jpg",
      initialSettings: fallbackSettings,
    };
  }
}

export default async function FoodMenuPage() {
  const {
    heroImage,
    initialSettings,
  } = await getInitialFoodData();

  return (
    <FoodMenuContent
      heroImage={heroImage}
      initialSettings={initialSettings}
    />
  );
}