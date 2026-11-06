import OurStoryContent from "@/components/OurStoryContent";

export const metadata = {
  title: "Our Story | La Lara Restaurant & Bar Yalıkavak",
  description:
    "Discover the family story behind La Lara Restaurant & Bar in Yalıkavak, Bodrum — the woman behind the name, the pink elephant and the memories that inspired La Lara.",
};

type StoryMedia = {
  hero: string;
  lara: string;
  restaurant: string;
  people: string;
  elephant: string;
  people1: string;
  people2: string;
  people3: string;
};

async function getStoryMedia(): Promise<StoryMedia> {
  const emptyMedia: StoryMedia = {
    hero: "",
    lara: "",
    restaurant: "",
    people: "",
    elephant: "",
    people1: "",
    people2: "",
    people3: "",
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
      elephant: getString("elephant"),
      people1: getString("people1"),
      people2: getString("people2"),
      people3: getString("people3"),
    };
  } catch (error) {
    console.error(
      "Story media server load error:",
      error
    );

    return emptyMedia;
  }
}

export default async function OurStoryPage() {
  const initialMedia =
    await getStoryMedia();

  return (
    <OurStoryContent
      initialMedia={initialMedia}
    />
  );
}