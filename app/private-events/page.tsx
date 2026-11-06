
import PrivateEventsContent from "@/components/PrivateEventsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events & Celebrations | La Lara Restaurant & Bar Yalıkavak",
  description:
    "Discover bespoke weddings, intimate celebrations, corporate events and private lounge experiences at La Lara Restaurant & Bar in Yalıkavak, Bodrum.",
};

export type PrivateEventsMedia = {
  hero: string;
  gatherings: string[];
  celebrations: string[];
  weddings: string[];
  corporate: string[];
};

type FirestoreValue = {
  stringValue?: string;
  arrayValue?: {
    values?: FirestoreValue[];
  };
  mapValue?: {
    fields?: Record<string, FirestoreValue>;
  };
};

function getStringValue(field?: FirestoreValue): string {
  return typeof field?.stringValue === "string"
    ? field.stringValue
    : "";
}

function getStringArray(field?: FirestoreValue): string[] {
  const values = field?.arrayValue?.values;

  if (!Array.isArray(values)) return [];

  return values.map(getStringValue).filter(Boolean);
}

async function getPrivateEventsMedia(): Promise<PrivateEventsMedia> {
  const emptyMedia: PrivateEventsMedia = {
    hero: "",
    gatherings: [],
    celebrations: [],
    weddings: [],
    corporate: [],
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/pageMedia/private-events",
      { cache: "no-store" }
    );

    if (!response.ok) return emptyMedia;

    const data = await response.json();

    const fields: Record<string, FirestoreValue> =
      data?.fields?.fields?.mapValue?.fields ?? {};

    return {
      hero: getStringValue(fields.hero),
      gatherings: getStringArray(fields.gatherings),
      celebrations: getStringArray(fields.celebrations),
      weddings: getStringArray(fields.weddings),
      corporate: getStringArray(fields.corporate),
    };
  } catch (error) {
    console.error("Private Events media load error:", error);
    return emptyMedia;
  }
}

export default async function PrivateEventsPage() {
  const initialMedia = await getPrivateEventsMedia();

  return <PrivateEventsContent initialMedia={initialMedia} />;
}
