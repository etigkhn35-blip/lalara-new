
"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/lib/cms/useSiteContent";
import { privateEventsOriginals } from "@/lib/cms/privateEvents";
export const dynamic = "force-dynamic";

export type PrivateEventsMedia = {
  hero: string;
  gatherings: string[];
  celebrations: string[];
  weddings: string[];
  corporate: string[];
};

type Props = {
  initialMedia: PrivateEventsMedia;
};

type EventSectionProps = {
  id: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  images: string[];
  imageAlt: string;
  tone: "sage" | "pink" | "cream";
  imageSide: "left" | "right";
  href: string;
  buttonLabel?: string;
  eyebrowStyle?: React.CSSProperties;
  headingStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
};

function EventSection({
  id,
  eyebrow,
  heading,
  paragraphs,
  images,
  imageAlt,
  tone,
  imageSide,
  href,
  buttonLabel = "SEND ENQUIRY",
  eyebrowStyle,
  headingStyle,
  textStyle,
  buttonStyle,
}: EventSectionProps) {
  const image = images.find(Boolean);

  return (
    <section
      id={id}
      className={`lalara-event-section lalara-event-${tone} ${
        imageSide === "left" ? "lalara-event-image-left" : ""
      }`}
    >
      <div className="lalara-event-copy">
        <div className="lalara-event-copy-inner">
          <p className="lalara-event-eyebrow" style={eyebrowStyle}>
            {eyebrow}
          </p>

          <h2 style={headingStyle}>{heading}</h2>

          <div className="lalara-event-description" style={textStyle}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <a
            href={href}
            className="lalara-event-enquiry"
            style={buttonStyle}
          >
            {buttonLabel} <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>

      <div className="lalara-event-image-frame">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 800px) 100vw, 60vw"
            className="lalara-event-image"
          />
        ) : (
          <div className="lalara-event-image-placeholder">
            <span>EVENT IMAGE</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default function PrivateEventsContent({
  initialMedia,
}: Props) {
  const media = initialMedia;

  const { ready, getContent, isVisible, styleFor } = useSiteContent({
    locale: "en",
    originals: privateEventsOriginals.en,
  });

  const cms = (key: string) => getContent(key);
  const eventText = (key: string, field: "eyebrow" | "heading" | "body" | "buttonLabel", fallback: string) =>
    (cms(key)?.[field] as string | undefined) || fallback;
  const eventParagraphs = (key: string, fallback: string[]) =>
    ((cms(key)?.body ?? "").trim() ? (cms(key)?.body ?? "").split(/\n\s*\n/).filter(Boolean) : fallback);

  const email = "reservation.bodrum@lalara.com.tr";

  const enquiryHref = (eventType: string) =>
    `mailto:${email}?subject=${encodeURIComponent(
      `La Lara - ${eventType} Enquiry`
    )}&body=${encodeURIComponent(
      `Hello La Lara,\n\nI would like to enquire about ${eventType.toLowerCase()}.\n\nPreferred date:\nNumber of guests:\nAdditional details:\n\nThank you.`
    )}`;

  return (
    <main className="events-page lalara-events-redesign">
      <Header locale="en" />

      <div
        className="lalara-events-content"
        style={{ visibility: ready ? "visible" : "hidden" }}
        aria-busy={!ready}
      >
        {/* 01 - HERO */}

        {isVisible("private-events-hero") && (
          <section className="lalara-events-hero">
            {media.hero ? (
              <Image
                src={media.hero}
                alt="Events and celebrations at La Lara"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="lalara-event-image"
              />
            ) : (
              <div className="lalara-event-image-placeholder">
                <span>EVENTS HERO IMAGE</span>
              </div>
            )}

            <div className="lalara-events-hero-shade" />

            <div className="lalara-events-hero-text">
              <h1 style={styleFor("private-events-hero", "heading")}>
                {eventText("private-events-hero", "heading", "Events & Celebrations")}
              </h1>

              <p style={styleFor("private-events-hero", "text")}>
                {eventText("private-events-hero", "body", "Every celebration has its own story.")}
              </p>
            </div>
          </section>
        )}

        {/* SPACE BETWEEN HERO AND WEDDINGS */}

        <div className="lalara-events-spacer" aria-hidden="true" />

        {/* 02 - WEDDINGS */}

        {isVisible("private-events-weddings") && (
          <EventSection
            id="weddings"
            eyebrow={eventText("private-events-weddings", "eyebrow", "WEDDINGS")}
            heading={eventText("private-events-weddings", "heading", "Bespoke Weddings")}
            paragraphs={eventParagraphs("private-events-weddings", [
              "Set above Yalıkavak Bay, La Lara offers a distinctive setting for intimate weddings, with panoramic sea views and outdoor terraces across different levels.",
              "Every celebration is personal. From bespoke menus and sharing plates to curated drinks, signature cocktails and tailored dining arrangements, we work with you to shape an experience that reflects your preferences and style.",
            ])}
            images={media.weddings}
            imageAlt="Wedding floral arrangements at La Lara"
            tone="sage"
            imageSide="right"
            buttonLabel={eventText("private-events-weddings", "buttonLabel", "SEND ENQUIRY")}
            href={enquiryHref("Bespoke Weddings")}
            eyebrowStyle={styleFor("private-events-weddings", "eyebrow")}
            headingStyle={styleFor("private-events-weddings", "heading")}
            textStyle={styleFor("private-events-weddings", "text")}
            buttonStyle={styleFor("private-events-weddings", "button")}
          />
        )}

        {/* 03 - INTIMATE CELEBRATIONS */}

        {isVisible("private-events-restaurant") && (
          <EventSection
            id="celebrations"
            eyebrow={eventText("private-events-restaurant", "eyebrow", "PRIVATE EVENTS")}
            heading={eventText("private-events-restaurant", "heading", "Intimate Celebrations")}
            paragraphs={eventParagraphs("private-events-restaurant", [
              "From birthdays and engagements to anniversaries and special get-togethers, La Lara offers the option to book the venue just for your occasion.",
            ])}
            images={media.celebrations}
            imageAlt="Private dinner celebration at La Lara"
            tone="pink"
            imageSide="left"
            buttonLabel={eventText("private-events-restaurant", "buttonLabel", "SEND ENQUIRY")}
            href={enquiryHref("Intimate Celebrations")}
            eyebrowStyle={styleFor("private-events-restaurant", "eyebrow")}
            headingStyle={styleFor("private-events-restaurant", "heading")}
            textStyle={styleFor("private-events-restaurant", "text")}
            buttonStyle={styleFor("private-events-restaurant", "button")}
          />
        )}

        {/* 04 - CORPORATE EVENTS */}

        {isVisible("corporate-events") && <EventSection
          id="corporate-events"
          eyebrow={eventText("corporate-events", "eyebrow", "BUSINESS")}
          heading={eventText("corporate-events", "heading", "Corporate Events")}
          paragraphs={eventParagraphs("corporate-events", [
            "Make business meetings a little more enjoyable at La Lara.",
            "Join us for business lunches and coffee breaks in a stylish, relaxed setting, or reserve La Lara exclusively for your next corporate event.",
          ])}
          images={media.corporate}
          imageAlt="Corporate gathering at La Lara"
          tone="cream"
          imageSide="right"
          buttonLabel={eventText("corporate-events", "buttonLabel", "SEND ENQUIRY")}
          eyebrowStyle={styleFor("corporate-events", "eyebrow")}
          headingStyle={styleFor("corporate-events", "heading")}
          textStyle={styleFor("corporate-events", "text")}
          buttonStyle={styleFor("corporate-events", "button")}
          href={enquiryHref("Corporate Events")}
        />}

        {/* 05 - PRIVATE LOUNGE */}

        {isVisible("private-events-lounge") && (
          <EventSection
            id="private-lounge"
            eyebrow={eventText("private-events-lounge", "eyebrow", "LEISURE")}
            heading={eventText("private-events-lounge", "heading", "Private Lounge Experiences")}
            paragraphs={eventParagraphs("private-events-lounge", [
              "Make it a night of your own. La Lara's lounge is available for private karaoke nights and billiards sessions, offering a relaxed, intimate setting for friends, family or colleagues to get together.",
            ])}
            images={media.gatherings}
            imageAlt="Private lounge experiences at La Lara"
            tone="sage"
            imageSide="left"
            buttonLabel={eventText("private-events-lounge", "buttonLabel", "SEND ENQUIRY")}
            href={enquiryHref("Private Lounge Experiences")}
            eyebrowStyle={styleFor("private-events-lounge", "eyebrow")}
            headingStyle={styleFor("private-events-lounge", "heading")}
            textStyle={styleFor("private-events-lounge", "text")}
            buttonStyle={styleFor("private-events-lounge", "button")}
          />
        )}

        {/* 06 - BOOK YOUR VENUE */}

        {isVisible("private-events-cta") && (
          <section className="lalara-events-booking">
            <h2 style={styleFor("private-events-cta", "heading")}>
              {eventText("private-events-cta", "heading", "Book Your Venue.")}
            </h2>

            <p style={styleFor("private-events-cta", "text")}>
              {eventText("private-events-cta", "body", "Tell us the type of event, preferred date and approximate number of guests and our team will help with the next steps.")}
            </p>

            <a
              href={enquiryHref("Private Venue Booking")}
              className="lalara-events-email-button"
              style={styleFor("private-events-cta", "button")}
            >
              {eventText("private-events-cta", "buttonLabel", "EMAIL US")}
            </a>
          </section>
        )}
      </div>

      <Footer locale="en" />
    </main>
  );
}
