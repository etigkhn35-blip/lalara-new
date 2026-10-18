import GaleriContent from "@/components/GaleriContent";

export const metadata = {
  title: "Galeri | La Lara Restaurant & Bar Yalıkavak",
  description:
    "La Lara Restaurant & Bar Yalıkavak'ın atmosferini, sofralarını ve Bodrum'daki anlarını galerimizde keşfedin.",
};

export type GalleryMedia = {
  hero: string;
  photos: string[];
};

function getStringValue(field: any): string {
  return typeof field?.stringValue === "string"
    ? field.stringValue
    : "";
}

function getStringArray(field: any): string[] {
  const values =
    field?.arrayValue?.values;

  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value: any) =>
      typeof value?.stringValue === "string"
        ? value.stringValue
        : ""
    )
    .filter(Boolean);
}

async function getGalleryMedia(): Promise<GalleryMedia> {
  const emptyMedia: GalleryMedia = {
    hero: "",
    photos: [],
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/pageMedia/gallery",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return emptyMedia;
    }

    const data = await response.json();

    const fields =
      data?.fields?.fields?.mapValue
        ?.fields ?? {};

    return {
      hero: getStringValue(
        fields.hero
      ),

      photos: getStringArray(
        fields.photos
      ),
    };
  } catch (error) {
    console.error(
      "TR gallery media server load error:",
      error
    );

    return emptyMedia;
  }
}

export default async function GaleriPage() {
  const initialMedia =
    await getGalleryMedia();

  return (
    <GaleriContent
      initialMedia={initialMedia}
    />
  );
}