import ContactContent from "@/components/ContactContent";

export const metadata = {
  title: "Contact | La Lara Restaurant & Bar Yalıkavak",
  description:
    "Contact La Lara Restaurant & Bar in Yalıkavak, Bodrum for reservations, directions and enquiries.",
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

    /*
      Firestore structure:

      siteSettings/media
        images
          contactHero
            url
          contactReservation
            url
    */

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
      "Contact media server load error:",
      error
    );

    return fallback;
  }
}

export default async function ContactPage() {
  const initialMedia =
    await getContactMedia();

  return (
    <ContactContent
      initialMedia={initialMedia}
    />
  );
}