import OzelEtkinliklerContent from "@/components/OzelEtkinliklerContent";

export const metadata = {
  title: "Özel Etkinlikler | La Lara Restaurant & Bar Yalıkavak",
  description:
    "La Lara Restaurant & Bar Yalıkavak'ta özel davetler, kutlamalar ve butik düğünler için benzersiz bir atmosfer keşfedin.",
};

export type PrivateEventsMedia = {
  hero: string;
  gatherings: string[];
  celebrations: string[];
  weddings: string[];
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

async function getPrivateEventsMedia(): Promise<PrivateEventsMedia> {
  const emptyMedia: PrivateEventsMedia = {
    hero: "",
    gatherings: [],
    celebrations: [],
    weddings: [],
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/pageMedia/private-events",
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
      gatherings: getStringArray(fields.gatherings),
      celebrations: getStringArray(fields.celebrations),
      weddings: getStringArray(fields.weddings),
    };
  } catch (error) {
    console.error(
      "TR Private Events media server load error:",
      error
    );

    return emptyMedia;
  }
}

export default async function OzelEtkinliklerPage() {
  const initialMedia =
    await getPrivateEventsMedia();

  return (
    <OzelEtkinliklerContent
      initialMedia={initialMedia}
    />
  );
}