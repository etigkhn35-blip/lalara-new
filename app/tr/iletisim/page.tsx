import IletisimContent from "@/components/IletisimContent";

export const metadata = {
  title: "İletişim | La Lara Restaurant & Bar Yalıkavak",
  description:
    "La Lara Restaurant & Bar Yalıkavak ile rezervasyon, yol tarifi ve bilgi için iletişime geçin.",
};

export type ContactMedia = {
  hero: string;
  reservation: string;
};

function getStringValue(field: any): string {
  return typeof field?.stringValue === "string"
    ? field.stringValue
    : "";
}

async function getContactMedia(): Promise<ContactMedia> {
  const fallback: ContactMedia = {
    hero: "/images/home/6.jpg",
    reservation: "/images/home/1.jpg",
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/siteSettings/media",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();

    const images =
      data?.fields?.images?.mapValue?.fields ?? {};

    const contactHero =
      images?.contactHero?.mapValue?.fields ?? {};

    const contactReservation =
      images?.contactReservation?.mapValue?.fields ?? {};

    return {
      hero:
        getStringValue(contactHero.url) ||
        fallback.hero,

      reservation:
        getStringValue(contactReservation.url) ||
        fallback.reservation,
    };
  } catch (error) {
    console.error(
      "TR Contact media server load error:",
      error
    );

    return fallback;
  }
}

export default async function IletisimPage() {
  const initialMedia =
    await getContactMedia();

  return (
    <IletisimContent
      initialMedia={initialMedia}
    />
  );
}