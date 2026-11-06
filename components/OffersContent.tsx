
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type RecordData = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  schedule?: string;
  visible?: boolean;
  status?: string;
};

type Offer = {
  id: string;
  section: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  schedule?: string;
  imageAlt: string;
  theme: "pink" | "sage" | "cream";
  imageSide: "left" | "right";
};

type OffersMedia = {
  hero?: string;
  birthday?: string;
  lunch?: string;
  vino?: string;
  "happy-hour"?: string;
};

const initialOffers: Offer[] = [
  {
    id: "birthday",
    section: "Birthday Special",
    eyebrow: "BIRTHDAYS AT LA LARA",
    title: "Birthday Special",
    paragraphs: [
      "Make your birthday a little more special with 25% off your bill at La Lara.",
      "Available from one day before your birthday and valid for eight days.",
      "Plenty of time to celebrate with the people you love.",
    ],
    imageAlt: "Birthday celebration at La Lara",
    theme: "pink",
    imageSide: "right",
  },
  {
    id: "lunch",
    section: "Lunch With A View",
    eyebrow: "SET MENU",
    title: "Lunch With A View",
    paragraphs: [
      "A relaxed midday escape overlooking Yalıkavak Bay. Our two-course lunch features a selection of favourite dishes, served with a view.",
    ],
    schedule: "Daily · 12:00–15:00",
    imageAlt: "Lunch with a view at La Lara",
    theme: "sage",
    imageSide: "left",
  },
  {
    id: "vino",
    section: "Vino Wednesday",
    eyebrow: "WINE O’CLOCK",
    title: "Vino Wednesday",
    paragraphs: [
      "Wednesdays are made for good wine and something to share. Take 25% off selected wines and pair your favourites with a few bites from our menu.",
    ],
    schedule: "Every Wednesday · 17:00–21:00",
    imageAlt: "Wine being poured into a glass",
    theme: "cream",
    imageSide: "right",
  },
  {
    id: "happy-hour",
    section: "Happy Hour",
    eyebrow: "COCKTAIL TIME",
    title: "Happy Hour",
    paragraphs: [
      "Your afternoon deserves a little extra. Enjoy 20% off cocktails and spritzes during Happy Hour.",
    ],
    schedule: "Daily · 15:00–18:00",
    imageAlt: "Cocktail at La Lara Restaurant & Bar",
    theme: "pink",
    imageSide: "left",
  },
];

const sectionKeys: Record<string, string> = {
  "Offers Hero": "offers-hero",
  "Birthday Special": "birthday-special",
  "Lunch With A View": "lunch-with-a-view",
  "Vino Wednesday": "vino-wednesday",
  "Happy Hour": "happy-hour",
};

function OfferSection({
  offer,
  record,
  image,
}: {
  offer: Offer;
  record?: RecordData;
  image?: string;
}) {
  if (
    record?.status === "published" &&
    record.visible === false
  ) {
    return null;
  }

  const live =
    record?.status === "published" ? record : undefined;

  const paragraphs =
    live?.body !== undefined
      ? live.body.split(/\n\s*\n/).filter(Boolean)
      : offer.paragraphs;

  const schedule =
    live?.schedule !== undefined
      ? live.schedule
      : offer.schedule;

  return (
    <section
      id={offer.id}
      className={[
        "lalara-offer-section",
        `lalara-offer-${offer.theme}`,
        offer.imageSide === "left"
          ? "lalara-offer-image-left"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="lalara-offer-copy">
        <div className="lalara-offer-copy-inner">
          <p className="lalara-offer-eyebrow">
            {live?.eyebrow ?? offer.eyebrow}
          </p>

          <h2>{live?.heading ?? offer.title}</h2>

          <div className="lalara-offer-description">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {schedule && (
            <p className="lalara-offer-schedule">
              {schedule}
            </p>
          )}
        </div>
      </div>

      <div className="lalara-offer-image-frame">
        {image ? (
          <Image
            src={image}
            alt={offer.imageAlt}
            fill
            sizes="(max-width: 650px) 100vw, 60vw"
            className="lalara-offer-image"
          />
        ) : (
          <div className="lalara-offer-placeholder">
            <span>OFFER IMAGE</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default function OffersContent() {
  const [records, setRecords] = useState<
    Record<string, RecordData>
  >({});

  const [media, setMedia] = useState<OffersMedia>({});

  useEffect(() => {
    const unsubscribers = Object.entries(sectionKeys).map(
      ([section, key]) =>
        onSnapshot(
          doc(db, "siteContent", `en-${key}`),
          (snapshot) => {
            setRecords((current) => ({
              ...current,
              [section]: snapshot.exists()
                ? (snapshot.data() as RecordData)
                : {},
            }));
          },
          (error) => {
            console.error("Offers CMS:", error);
          }
        )
    );

    const unsubscribeMedia = onSnapshot(
      doc(db, "pageMedia", "offers"),
      (snapshot) => {
        const fields = snapshot.exists()
          ? snapshot.data()?.fields
          : undefined;

        setMedia({
          hero:
            typeof fields?.hero === "string"
              ? fields.hero
              : "",
          birthday:
            typeof fields?.birthday === "string"
              ? fields.birthday
              : "",
          lunch:
            typeof fields?.lunch === "string"
              ? fields.lunch
              : "",
          vino:
            typeof fields?.vino === "string"
              ? fields.vino
              : "",
          "happy-hour":
            typeof fields?.["happy-hour"] === "string"
              ? fields["happy-hour"]
              : "",
        });
      },
      (error) => {
        console.error("Offers Media:", error);
      }
    );

    return () => {
      unsubscribers.forEach((unsubscribe) =>
        unsubscribe()
      );
      unsubscribeMedia();
    };
  }, []);

  const hero =
    records["Offers Hero"]?.status === "published"
      ? records["Offers Hero"]
      : undefined;

  return (
    <>
      {hero?.visible !== false && (
        <section className="lalara-offers-hero">
          {media.hero ? (
            <Image
              src={media.hero}
              alt="Special offers at La Lara Restaurant & Bar"
              fill
              priority
              sizes="100vw"
              className="lalara-offers-hero-image"
            />
          ) : (
            <div className="lalara-offers-hero-placeholder">
              <span>HERO IMAGE</span>
            </div>
          )}

          <div className="lalara-offers-hero-overlay" />

          <div className="lalara-offers-hero-content">
            <h1>{hero?.heading ?? "Special Offers"}</h1>
            <p>
              {hero?.body ?? "A little something extra."}
            </p>
          </div>
        </section>
      )}

      <div className="lalara-offers-sections">
        {initialOffers.map((offer) => (
          <OfferSection
            key={offer.id}
            offer={offer}
            record={records[offer.section]}
            image={media[offer.id as keyof OffersMedia]}
          />
        ))}
      </div>
    </>
  );
}
