
import ContactContent from "@/components/ContactContent";

export const dynamic = "force-dynamic";

export type ContactMedia = {
  hero: string;
  reservation: string;
  event: string;
  social: string;
};

type FirestoreField = {
  stringValue?: string;
  mapValue?: {
    fields?: Record<string, FirestoreField>;
  };
};

function imageUrl(
  images: Record<string, FirestoreField>,
  key: string
): string {
  return (
    images[key]?.mapValue?.fields?.url?.stringValue || ""
  );
}

async function getContactMedia(): Promise<ContactMedia> {
  const fallback: ContactMedia = {
    hero: "/images/home/6.jpg",
    reservation: "/images/home/1.jpg",
    event: "",
    social: "",
  };

  try {
    const response = await fetch(
      "https://firestore.googleapis.com/v1/projects/lalara-restaurant/databases/(default)/documents/siteSettings/media",
      { cache: "no-store" }
    );

    if (!response.ok) return fallback;

    const data = await response.json();

    const images: Record<string, FirestoreField> =
      data?.fields?.images?.mapValue?.fields ?? {};

    return {
      hero: imageUrl(images, "contactHero") || fallback.hero,
      reservation:
        imageUrl(images, "contactReservation") ||
        fallback.reservation,
      event: imageUrl(images, "contactEvent"),
      social: imageUrl(images, "contactSocial"),
    };
  } catch (error) {
    console.error("Contact media load error:", error);
    return fallback;
  }
}

export default async function ContactPage() {
  const initialMedia = await getContactMedia();

  return <ContactContent initialMedia={initialMedia} />;
}
