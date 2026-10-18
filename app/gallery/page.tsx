import GalleryContent from "@/components/GalleryContent";

export const metadata = {
  title: "Gallery | La Lara Restaurant & Bar Yalıkavak",
  description:
    "Discover the atmosphere, tables and moments of La Lara Restaurant & Bar in Yalıkavak, Bodrum.",
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
  const values = field?.arrayValue?.values;

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
      data?.fields?.fields?.mapValue?.fields ?? {};

    return {
      hero: getStringValue(fields.hero),
      photos: getStringArray(fields.photos),
    };
  } catch (error) {
    console.error(
      "EN gallery media server load error:",
      error
    );

    return emptyMedia;
  }
}

export default async function GalleryPage() {
  const initialMedia =
    await getGalleryMedia();

  return (
    <GalleryContent
      initialMedia={initialMedia}
    />
  );
}