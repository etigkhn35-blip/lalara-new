import HikayemizContent from "@/components/HikayemizContent";

export const metadata = {
  title: "Hikâyemiz | La Lara Restaurant & Bar Yalıkavak",
  description:
    "La Lara Restaurant & Bar'ın Yalıkavak, Bodrum'daki aile hikâyesini; ismin ardındaki Lara'yı, pembe fil geleneğini ve La Lara'ya ilham veren anıları keşfedin.",
};

type StoryMedia = {
  hero: string;
  lara: string;
  restaurant: string;
  people: string;
};

async function getStoryMedia(): Promise<StoryMedia> {
  const emptyMedia: StoryMedia = {
    hero: "",
    lara: "",
    restaurant: "",
    people: "",
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/pageMedia/story",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return emptyMedia;
    }

    const data = await response.json();

    const fieldsMap =
      data?.fields?.fields?.mapValue?.fields ?? {};

    function getString(key: string) {
      const value =
        fieldsMap?.[key]?.stringValue;

      return typeof value === "string"
        ? value
        : "";
    }

    return {
      hero: getString("hero"),
      lara: getString("lara"),
      restaurant: getString("restaurant"),
      people: getString("people"),
    };
  } catch (error) {
    console.error(
      "TR story media server load error:",
      error
    );

    return emptyMedia;
  }
}

export default async function HikayemizPage() {
  const initialMedia =
    await getStoryMedia();

  return (
    <HikayemizContent
      initialMedia={initialMedia}
    />
  );
}