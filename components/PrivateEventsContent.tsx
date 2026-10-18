"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventSlider from "@/components/EventSlider";

/* =========================================================
   TYPES
   ========================================================= */

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;

  buttonLabel?: string;
  buttonLink?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;

  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

  visible?: boolean;
  status?: string;
};

type SliderImage = {
  src: string;
  alt: string;
};

export type PrivateEventsMedia = {
  hero: string;
  gatherings: string[];
  celebrations: string[];
  weddings: string[];
};

type PrivateEventsContentProps = {
  initialMedia: PrivateEventsMedia;
};

/* =========================================================
   HELPERS
   ========================================================= */

function renderLines(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function renderParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, index) => (
      <p key={`${paragraph}-${index}`}>
        {renderLines(paragraph)}
      </p>
    ));
}

function createSliderImages(
  urls: string[],
  alt: string
): SliderImage[] {
  return urls.map((src, index) => ({
    src,
    alt: `${alt} ${index + 1}`,
  }));
}

/* =========================================================
   PAGE
   ========================================================= */

export default function PrivateEventsContent({
  initialMedia,
}: PrivateEventsContentProps) {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const media = initialMedia;

  /* =======================================================
     WHATSAPP
     ======================================================= */

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Hello La Lara, I would like to enquire about hosting a private event.\n\nEvent type:\nPreferred date:\nNumber of guests:"
    );

  /* =======================================================
     LOAD CMS ONLY
     ======================================================= */

  useEffect(() => {
    async function loadContent() {
      try {
        const contentSnapshot =
          await getDocs(
            collection(
              db,
              "siteContent"
            )
          );

        const nextCms: Record<
          string,
          CmsRecord
        > = {};

        contentSnapshot.forEach(
          (item) => {
            const data =
              item.data() as CmsRecord;

            if (
              item.id.startsWith("en-") &&
              data.status === "published"
            ) {
              nextCms[
                item.id.replace(
                  "en-",
                  ""
                )
              ] = data;
            }
          }
        );

        setCms(nextCms);
      } catch (error) {
        console.error(
          "Private Events CMS load error:",
          error
        );
      }
    }

    loadContent();
  }, []);

  /* =======================================================
     CMS HELPERS
     ======================================================= */

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return cms[key]?.visible !== false;
  }

  function cmsStyle(
    key: string,
    kind:
      | "eyebrow"
      | "heading"
      | "text"
  ) {
    const item = cms[key];

    if (!item) {
      return undefined;
    }

    const size =
      kind === "eyebrow"
        ? item.eyebrowSize
        : kind === "heading"
          ? item.headingSize
          : item.textSize;

    return {
      ...(size
        ? {
            fontSize: `${size}px`,
          }
        : {}),

      ...(item.fontWeight
        ? {
            fontWeight:
              item.fontWeight,
          }
        : {}),

      ...(item.lineHeight
        ? {
            lineHeight:
              item.lineHeight,
          }
        : {}),

      ...(item.letterSpacing !== undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  /* =======================================================
     CMS RECORDS
     ======================================================= */

  const hero =
    content("private-events-hero");

  const intro =
    content("private-events-intro");

  const lounge =
    content("private-events-lounge");

  const privateEvents =
    content("private-events-restaurant");

  const weddings =
    content("private-events-weddings");

  const finalCta =
    content("private-events-cta");

  /* =======================================================
     SLIDER IMAGES
     ======================================================= */

  const loungeImages =
    createSliderImages(
      media.gatherings,
      "La Lara Lounge event"
    );

  const privateEventImages =
    createSliderImages(
      media.celebrations,
      "Private occasion at La Lara"
    );

  const weddingImages =
    createSliderImages(
      media.weddings,
      "Boutique wedding at La Lara"
    );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="events-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header locale="en" />

      {/* ===================================================
          HERO
          =================================================== */}

      {isVisible(
        "private-events-hero"
      ) && (
        <section
          className="events-page-hero"
          style={{
            background: "transparent",
          }}
        >
          {media.hero && (
            <Image
              src={media.hero}
              alt="Private events at La Lara Yalıkavak"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="cover"
            />
          )}

          {media.hero && (
            <div className="image-overlay" />
          )}

          <div className="events-page-hero-content">

            <p
              className="eyebrow light"
              style={cmsStyle(
                "private-events-hero",
                "eyebrow"
              )}
            >
              {hero?.eyebrow ||
                "LA LARA · YALIKAVAK"}
            </p>

            <h1
              style={cmsStyle(
                "private-events-hero",
                "heading"
              )}
            >
              {hero?.heading
                ? renderLines(
                    hero.heading
                  )
                : (
                  <>
                    Special Moments,
                    <br />
                    at La Lara.
                  </>
                )}
            </h1>

            <p
              style={cmsStyle(
                "private-events-hero",
                "text"
              )}
            >
              {hero?.body
                ? renderLines(
                    hero.body
                  )
                : (
                  <>
                    From intimate gatherings
                    to private celebrations,
                    a beautiful setting in
                    Yalıkavak for the moments
                    worth remembering.
                  </>
                )}
            </p>

            <a
              href={
                hero?.buttonLink ||
                "#events"
              }
              className="outline-button"
            >
              {hero?.buttonLabel ||
                "DISCOVER EVENTS"}
            </a>

          </div>
        </section>
      )}

      {/* ===================================================
          INTRO
          =================================================== */}

      {isVisible(
        "private-events-intro"
      ) && (
        <section
          className="events-editorial-intro"
          style={{
            marginBottom:
              "clamp(50px, 6vw, 90px)",
          }}
        >

          <p
            className="eyebrow"
            style={cmsStyle(
              "private-events-intro",
              "eyebrow"
            )}
          >
            {intro?.eyebrow ||
              "PRIVATE EVENTS"}
          </p>

          <h2
            style={cmsStyle(
              "private-events-intro",
              "heading"
            )}
          >
            {intro?.heading
              ? renderLines(
                  intro.heading
                )
              : (
                <>
                  Every celebration
                  <br />
                  has its own story.
                </>
              )}
          </h2>

          <p
            style={cmsStyle(
              "private-events-intro",
              "text"
            )}
          >
            {intro?.body
              ? renderLines(
                  intro.body
                )
              : (
                <>
                  Whether it is an intimate
                  evening, a special
                  celebration or one of
                  life&apos;s most important
                  occasions, we approach every
                  event at La Lara with its
                  own character.
                </>
              )}
          </p>

        </section>
      )}

      {/* ===================================================
          EVENTS
          =================================================== */}

      <div
        id="events"
        className="events-editorial-list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(60px, 7vw, 110px)",
        }}
      >

        {/* =================================================
            01 — LOUNGE
            ================================================= */}

        {isVisible(
          "private-events-lounge"
        ) && (
          <section className="event-editorial-row">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                01
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-lounge",
                  "eyebrow"
                )}
              >
                {lounge?.eyebrow ||
                  "LA LARA LOUNGE"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-lounge",
                  "heading"
                )}
              >
                {lounge?.heading
                  ? renderLines(
                      lounge.heading
                    )
                  : (
                    <>
                      Intimate
                      <br />
                      Events
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-lounge",
                  "text"
                )}
              >
                {lounge?.body
                  ? renderParagraphs(
                      lounge.body
                    )
                  : (
                    <>
                      <p>
                        With its warm and
                        welcoming atmosphere,
                        La Lara Lounge offers a
                        versatile setting for
                        social gatherings and
                        private celebrations.
                      </p>

                      <p>
                        From relaxed evenings
                        with friends to private
                        parties, the space can
                        be adapted to suit the
                        character of your
                        occasion.
                      </p>

                      <p>
                        Its comfortable and
                        informal atmosphere
                        works beautifully for
                        everything from
                        afternoon gatherings to
                        long evenings together.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  lounge?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    lounge?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {lounge?.buttonLabel ||
                  "ENQUIRE ABOUT THIS EVENT"}{" "}
                <span>→</span>
              </a>

            </div>

            {loungeImages.length > 0 && (
              <div className="event-editorial-media">
                <EventSlider
                  images={loungeImages}
                />
              </div>
            )}

          </section>
        )}

        {/* =================================================
            02 — PRIVATE EVENTS
            ================================================= */}

        {isVisible(
          "private-events-restaurant"
        ) && (
          <section className="event-editorial-row is-reversed">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                02
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-restaurant",
                  "eyebrow"
                )}
              >
                {privateEvents?.eyebrow ||
                  "LA LARA RESTAURANT & BAR"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-restaurant",
                  "heading"
                )}
              >
                {privateEvents?.heading
                  ? renderLines(
                      privateEvents.heading
                    )
                  : (
                    <>
                      Private
                      <br />
                      Occasions
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-restaurant",
                  "text"
                )}
              >
                {privateEvents?.body
                  ? renderParagraphs(
                      privateEvents.body
                    )
                  : (
                    <>
                      <p>
                        Selected areas of La
                        Lara can be arranged
                        for private occasions,
                        creating a more
                        personal setting for
                        you and your guests.
                      </p>

                      <p>
                        Romantic dinners,
                        anniversaries,
                        proposals, birthdays
                        and gatherings with
                        family, friends or
                        colleagues can all be
                        celebrated in a warm
                        and elegant atmosphere.
                      </p>

                      <p>
                        Our team will work with
                        you to understand the
                        occasion and help shape
                        an experience around
                        your plans.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  privateEvents?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    privateEvents?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {privateEvents?.buttonLabel ||
                  "PLAN YOUR OCCASION"}{" "}
                <span>→</span>
              </a>

            </div>

            {privateEventImages.length > 0 && (
              <div className="event-editorial-media">
                <EventSlider
                  images={privateEventImages}
                />
              </div>
            )}

          </section>
        )}

        {/* =================================================
            03 — WEDDINGS
            ================================================= */}

        {isVisible(
          "private-events-weddings"
        ) && (
          <section className="event-editorial-row">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                03
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-weddings",
                  "eyebrow"
                )}
              >
                {weddings?.eyebrow ||
                  "YALIKAVAK · BODRUM"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-weddings",
                  "heading"
                )}
              >
                {weddings?.heading
                  ? renderLines(
                      weddings.heading
                    )
                  : (
                    <>
                      Boutique
                      <br />
                      Weddings
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-weddings",
                  "text"
                )}
              >
                {weddings?.body
                  ? renderParagraphs(
                      weddings.body
                    )
                  : (
                    <>
                      <p>
                        Celebrate one of
                        life&apos;s most
                        special moments in the
                        atmosphere of
                        Yalıkavak, surrounded
                        by the people who
                        matter most.
                      </p>

                      <p>
                        La Lara brings together
                        warm hospitality,
                        thoughtful food and its
                        distinctive setting
                        for boutique weddings
                        and personal
                        celebrations.
                      </p>

                      <p>
                        Tell us about the day
                        you imagine and
                        we&apos;ll explore the
                        event details, dining
                        options and flow of the
                        celebration with you.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  weddings?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    weddings?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {weddings?.buttonLabel ||
                  "WEDDING ENQUIRIES"}{" "}
                <span>→</span>
              </a>

            </div>

            {weddingImages.length > 0 && (
              <div className="event-editorial-media">
                <EventSlider
                  images={weddingImages}
                />
              </div>
            )}

          </section>
        )}

      </div>

      {/* ===================================================
          FINAL CTA
          =================================================== */}

      {isVisible(
        "private-events-cta"
      ) && (
        <section
          className="events-page-enquiry"
          style={{
            marginTop:
              "clamp(70px, 8vw, 120px)",
          }}
        >

          <p
            className="eyebrow"
            style={cmsStyle(
              "private-events-cta",
              "eyebrow"
            )}
          >
            {finalCta?.eyebrow ||
              "PRIVATE EVENTS · YALIKAVAK"}
          </p>

          <h2
            style={cmsStyle(
              "private-events-cta",
              "heading"
            )}
          >
            {finalCta?.heading
              ? renderLines(
                  finalCta.heading
                )
              : (
                <>
                  Let&apos;s plan
                  <br />
                  it together.
                </>
              )}
          </h2>

          <p
            style={cmsStyle(
              "private-events-cta",
              "text"
            )}
          >
            {finalCta?.body
              ? renderLines(
                  finalCta.body
                )
              : (
                <>
                  Tell us the type of event,
                  preferred date and
                  approximate number of guests
                  and our team will help with
                  the next steps.
                </>
              )}
          </p>

          <div className="events-page-enquiry-actions">

            <a
              href={
                finalCta?.buttonLink ||
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
              className="events-page-primary-button"
            >
              {finalCta?.buttonLabel ||
                "MESSAGE ON WHATSAPP"}
            </a>

            <a
              href="mailto:reservation.bodrum@lalara.com.tr"
              className="line-link"
            >
              EMAIL US <span>→</span>
            </a>

          </div>

        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <Footer locale="en" />

    </main>
  );
}