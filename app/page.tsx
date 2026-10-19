"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

type HomepageMedia = {
  hero?: string;
  food?: string;
  drinks?: string;
  breakfast?: string;
  atmosphere?: string;
  moments?: string;
  sunset?: string;
};

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;

  buttonLabel?: string;
  buttonLink?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;
  buttonSize?: number;

  fontFamily?: "display" | "sans";
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

  visible?: boolean;
  status?: string;
};

type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tripadvisor: string;
};

const defaultSettings: SiteSettings = {
  phone: "+90 545 894 18 38",
  email: "reservation.bodrum@lalara.com.tr",

  address:
    "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",

  instagram:
    "https://www.instagram.com/lalara.bodrum/",

  facebook:
    "https://www.facebook.com/lalararestaurant",

  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
};

function renderLines(value: string) {
  return value.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}

      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function Home() {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [photos, setPhotos] =
    useState<HomepageMedia | null>(null);

  useEffect(() => {
    async function loadCms() {
      try {
        /* =====================================================
           CONTENT
           ===================================================== */

        const contentSnapshot = await getDocs(
          collection(db, "siteContent")
        );

        const nextCms: Record<string, CmsRecord> = {};

        contentSnapshot.forEach((item) => {
          const data = item.data() as CmsRecord;

          if (
            item.id.startsWith("en-") &&
            data.status === "published"
          ) {
            nextCms[
              item.id.replace("en-", "")
            ] = data;
          }
        });

        setCms(nextCms);

        /* =====================================================
           SETTINGS / MEDIA
           ===================================================== */

        const [
          contactSnapshot,
          socialSnapshot,
          homepageMediaSnapshot,
        ] = await Promise.all([
          getDoc(doc(db, "siteSettings", "contact")),
          getDoc(doc(db, "siteSettings", "social")),
          getDoc(doc(db, "pageMedia", "homepage")),
        ]);

        setSettings({
          phone:
            contactSnapshot.data()?.phone ??
            defaultSettings.phone,

          email:
            contactSnapshot.data()?.email ??
            defaultSettings.email,

          address:
            contactSnapshot.data()?.address ??
            defaultSettings.address,

          instagram:
            socialSnapshot.data()?.instagram ??
            defaultSettings.instagram,

          facebook:
            socialSnapshot.data()?.facebook ??
            defaultSettings.facebook,

          tripadvisor:
            socialSnapshot.data()?.tripadvisor ??
            defaultSettings.tripadvisor,
        });

        const fields = homepageMediaSnapshot.exists()
          ? (homepageMediaSnapshot.data()?.fields as HomepageMedia | undefined)
          : undefined;

        setPhotos(fields || {});
      } catch (error) {
        console.error(
          "La Lara CMS load error:",
          error
        );
      }
    }

    loadCms();
  }, []);

  /* =========================================================
     CMS HELPERS
     ========================================================= */

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
    | "button"
) {
  const item = cms[key];

  if (!item) return undefined;

  const size =
    kind === "eyebrow"
      ? item.eyebrowSize
      : kind === "heading"
        ? item.headingSize
        : kind === "button"
          ? item.buttonSize
          : item.textSize;

  const fontFamily =
    item.fontFamily === "sans"
      ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
      : '"Iowan Old Style", Baskerville, "Times New Roman", serif';

  return {
    ...(size !== undefined
      ? {
          fontSize: `${size}px`,
        }
      : {}),

    ...(item.fontFamily
      ? {
          fontFamily,
        }
      : {}),

    ...(item.fontWeight !== undefined
      ? {
          fontWeight: item.fontWeight,
          fontSynthesis: "none",
        }
      : {}),

    ...(item.lineHeight !== undefined
      ? {
          lineHeight: item.lineHeight,
        }
      : {}),

    ...(item.letterSpacing !== undefined
      ? {
          letterSpacing: `${item.letterSpacing}px`,
        }
      : {}),
  };
}

  /* =========================================================
     SETTINGS
     ========================================================= */

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref =
    `mailto:${settings.email}`;

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Hello La Lara, I would like to request a reservation.\n\nDate:\nTime:\nNumber of guests:"
    );

  const galleryPhotos = photos?.moments ? [photos.moments] : [];

  /* =========================================================
     CMS KEYS
     ========================================================= */

  const hero =
    content("hero");

  const menus =
    content("menus");

  const story =
    content("homepage-our-story");

  const experience =
    content("experience-gallery");

  const reservation =
    content("reservation-contact");

  const storyDetail =
    content("homepage-story-detail");

  const foodCard =
    content("homepage-food-card");

  const drinksCard =
    content("homepage-drinks-card");

  const breakfastCard =
    content("homepage-breakfast-card");

  const privateEvents =
    content("homepage-private-events");

  return (
    <main className="home-page">
      {/* =====================================================
          OPENING
          ===================================================== */}

      <div
        className="opening"
        aria-hidden="true"
      >
        <div className="opening-bg" />

        <Image
          src="/lalara-logo.png"
          alt=""
          width={900}
          height={320}
          priority
          className="opening-logo"
        />
      </div>

      {/* =====================================================
          BACKGROUND BRAND
          ===================================================== */}

      <div
        className="background-brand"
        aria-hidden="true"
      >
        <Image
          src="/lalara-logo.png"
          alt=""
          width={1200}
          height={440}
          className="background-brand-image"
        />
      </div>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <Header locale="en" />

      {/* =====================================================
          01 — HERO
          ===================================================== */}

      {isVisible("hero") && (
        <section className="hero opaque-section">
          {photos?.hero && (
            <Image
              src={photos.hero}
              alt="La Lara Restaurant & Bar overlooking Yalıkavak Bay in Bodrum"
              fill
              priority
              sizes="100vw"
              className="cover"
            />
          )}

          <div className="image-overlay" />

          <div className="hero-content">
            {hero?.eyebrow && (
              <p
                className="eyebrow light"
                style={cmsStyle(
                  "hero",
                  "eyebrow"
                )}
              >
                {hero.eyebrow}
              </p>
            )}

            <h1
              style={cmsStyle(
                "hero",
                "heading"
              )}
            >
              {hero?.heading
                ? renderLines(
                    hero.heading
                  )
                : (
                  <>
                    Mediterranean Dining
                    <br />
                    Above Yalıkavak Bay.
                  </>
                )}
            </h1>

            <p
              style={cmsStyle(
                "hero",
                "text"
              )}
            >
              {hero?.body
                ? renderLines(
                    hero.body
                  )
                : (
                  <>
                    Mediterranean food,
                    beautiful views and warm
                    hospitality in Yalıkavak.
                  </>
                )}
            </p>

            <div className="hero-actions">
              <a
                href="#menus"
                className="outline-button"
              >
                View Menu
              </a>

             <a
  href={hero?.buttonLink || "#reserve"}
  className="outline-button"
>
  {hero?.buttonLabel || "Reserve a Table"}
</a>
            </div>
          </div>

          <a
            className="scroll-cue"
            href="#menus"
          >
            Discover La Lara <i />
          </a>
        </section>
      )}

      {/* =====================================================
          02 — MENUS
          ===================================================== */}

      {isVisible("menus") && (
        <section
          id="menus"
          className="menus transparent-section"
        >
          <div className="section-title">
            <div>
              <p
                className="eyebrow"
                style={cmsStyle(
                  "menus",
                  "eyebrow"
                )}
              >
                {menus?.eyebrow ||
                  "The Menus"}
              </p>

              {menus?.body && (
                <span
                  style={cmsStyle(
                    "menus",
                    "text"
                  )}
                >
                  {renderLines(
                    menus.body
                  )}
                </span>
              )}
            </div>

            <h2
              style={cmsStyle(
                "menus",
                "heading"
              )}
            >
              {menus?.heading
                ? renderLines(
                    menus.heading
                  )
                : (
                  <>
                    Mediterranean
                    <br />
                    Food &amp; Drinks
                  </>
                )}
            </h2>
          </div>

          <div className="menu-grid">
            <article>
              <div className="menu-image">
                {photos?.food && (
                  <Image
                    src={photos.food}
                    alt="Mediterranean dishes served at La Lara Restaurant in Yalıkavak"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <h3 style={cmsStyle("homepage-food-card", "heading")}>{foodCard?.heading || "Food"}</h3>

              <a
                className="line-link"
                href={foodCard?.buttonLink || "/food-menu?lang=en"}
                              style={cmsStyle("homepage-food-card", "button")}
              >
                {foodCard?.buttonLabel || "VIEW MENU"}{" "}
                <span>→</span>
              </a>
            </article>

            <article>
              <div className="menu-image">
                {photos?.drinks && (
                  <Image
                    src={photos.drinks}
                    alt="Cocktails and drinks at La Lara Restaurant"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <h3 style={cmsStyle("homepage-drinks-card", "heading")}>{drinksCard?.heading || "Drinks"}</h3>

              <a
                className="line-link"
                href={drinksCard?.buttonLink || "/drinks-menu?lang=en"}
                              style={cmsStyle("homepage-drinks-card", "button")}
              >
                {drinksCard?.buttonLabel || "VIEW MENU"}{" "}
                <span>→</span>
              </a>
            </article>

            <article>
              <div className="menu-image">
                {photos?.breakfast && (
                  <Image
                    src={photos.breakfast}
                    alt="Breakfast overlooking Yalıkavak Bay at La Lara"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <h3 style={cmsStyle("homepage-breakfast-card", "heading")}>{breakfastCard?.heading || "Breakfast"}</h3>

              <a
                className="line-link"
                href={breakfastCard?.buttonLink || "/breakfast-menu?lang=en"}
                              style={cmsStyle("homepage-breakfast-card", "button")}
              >
                {breakfastCard?.buttonLabel || "VIEW MENU"}{" "}
                <span>→</span>
              </a>
            </article>
          </div>
        </section>
      )}

      {/* =====================================================
          03 — FAMILY STORY
          ===================================================== */}

      {isVisible(
        "homepage-our-story"
      ) && (
        <section
          id="story"
          className="story transparent-section"
        >
          <div className="section-title">
            <div>
              <p
                className="eyebrow"
                style={cmsStyle(
                  "homepage-our-story",
                  "eyebrow"
                )}
              >
                {story?.eyebrow ||
                  "Our Story"}
              </p>

              <span style={cmsStyle("homepage-story-detail", "eyebrow")}>
                {storyDetail?.eyebrow || "The story behind La Lara"}
              </span>
            </div>

            <h2
              style={cmsStyle(
                "homepage-our-story",
                "heading"
              )}
            >
              {story?.heading
                ? renderLines(
                    story.heading
                  )
                : (
                  <>
                    A Family Story,
                    <br />
                    A Shared Table.
                  </>
                )}
            </h2>
          </div>

          <div className="story-grid">
            <div className="story-image">
              {photos?.atmosphere && (
                <Image
                  src={photos.atmosphere}
                  alt="The family story behind La Lara Restaurant"
                  fill
                  sizes="(max-width:900px) 100vw,56vw"
                  className="cover"
                />
              )}
            </div>

            <div className="story-copy">
              <h3 style={cmsStyle("homepage-story-detail", "heading")}>
                {storyDetail?.heading
                  ? renderLines(storyDetail.heading)
                  : (<>The story behind<br />La Lara.</>)}
              </h3>

              {story?.body ? (
                <p
                  style={{
                    ...cmsStyle(
                      "homepage-our-story",
                      "text"
                    ),
                    whiteSpace:
                      "pre-line",
                  }}
                >
                  {story.body}
                </p>
              ) : (
                <>
                  <p>
                    Long before La Lara
                    became a restaurant,
                    there was a table where
                    everyone felt at home.
                  </p>

                  <p>
                    It belonged to our
                    grandmother, Lara — a
                    career woman with a big
                    personality, a love of
                    bringing people together
                    and, admittedly, a little
                    bit of diva spirit.
                  </p>

                  <p>
                    Her kitchen was a place
                    for long conversations,
                    laughter, stories and
                    food meant to be shared.
                    That feeling became the
                    inspiration behind La
                    Lara.
                  </p>
                </>
              )}

              <a
                href={
                  story?.buttonLink ||
                  "/our-story"
                }
                className="line-link"
                style={cmsStyle("homepage-our-story", "button")}
              >
                {story?.buttonLabel ||
                  "READ OUR STORY"}{" "}
                <span>→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          04 — EXPERIENCE
          ===================================================== */}

      {isVisible(
        "experience-gallery"
      ) && (
        <>
          <section
            id="moments"
            className="experience opaque-section"
          >
            {photos?.moments && (
              <Image
                src={photos.moments}
                alt="La Lara Restaurant and Yalıkavak atmosphere"
                fill
                sizes="100vw"
                className="cover"
              />
            )}

            <div className="image-overlay" />

            <div>
              <p
                className="eyebrow light"
                style={cmsStyle(
                  "experience-gallery",
                  "eyebrow"
                )}
              >
                {experience?.eyebrow ||
                  "La Lara in Yalıkavak"}
              </p>

              <h2
                style={cmsStyle(
                  "experience-gallery",
                  "heading"
                )}
              >
                {experience?.heading
                  ? renderLines(
                      experience.heading
                    )
                  : (
                    <>
                      From the table
                      <br />
                      to the view.
                    </>
                  )}
              </h2>

              <p
                style={cmsStyle(
                  "experience-gallery",
                  "text"
                )}
              >
                {experience?.body
                  ? renderLines(
                      experience.body
                    )
                  : (
                    <>
                      Mediterranean food,
                      cocktails and evenings
                      overlooking Yalıkavak
                      Bay.
                    </>
                  )}
              </p>

              <a
                href={
                  experience?.buttonLink ||
                  "/gallery"
                }
                className="line-link light-link"
                style={cmsStyle("experience-gallery", "button")}
              >
                {experience?.buttonLabel ||
                  "VIEW GALLERY"}{" "}
                <span>→</span>
              </a>
            </div>
          </section>

          {/* COMPACT GALLERY */}

          <section className="menus transparent-section">
            <div className="menu-grid">
              {galleryPhotos
                .slice(1, 4)
                .map(
                  (
                    photo,
                    index
                  ) => (
                    <article
                      key={`${photo}-${index}`}
                    >
                      <div className="menu-image">
                        <Image
                          src={photo}
                          alt={
                            index === 0
                              ? "Food presentation at La Lara Restaurant"
                              : index ===
                                  1
                                ? "Cocktails at La Lara Restaurant"
                                : "Sunset atmosphere at La Lara Yalıkavak"
                          }
                          fill
                          sizes="(max-width:900px) 100vw,33vw"
                          className="cover"
                        />
                      </div>
                    </article>
                  )
                )}
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          PRIVATE EVENTS
          ===================================================== */}

      <section
        id="events"
        className="split-section opaque-section"
      >
        <div className="split-image">
          {photos?.sunset && (
            <Image
              src={photos.sunset}
              alt="Private dining, weddings and events at La Lara Yalıkavak"
              fill
              sizes="(max-width:900px) 100vw,58vw"
              className="cover"
            />
          )}
        </div>

        <div className="split-copy">
          <p className="eyebrow" style={cmsStyle("homepage-private-events", "eyebrow")}>
            {privateEvents?.eyebrow || "Private Events"}
          </p>

          <h2 style={cmsStyle("homepage-private-events", "heading")}>
            {privateEvents?.heading
              ? renderLines(privateEvents.heading)
              : (<>Private Dining<br />&amp; Events</>)}
          </h2>

          <p style={{ ...cmsStyle("homepage-private-events", "text"), whiteSpace: "pre-line" }}>
            {privateEvents?.body ||
              "Weddings, celebrations, private dinners and gatherings overlooking Yalıkavak Bay.\n\nTell us what you are planning and our team will help shape the occasion around your guests."}
          </p>

          <a
            href={privateEvents?.buttonLink || "/private-events"}
            className="line-link"
            style={cmsStyle("homepage-private-events", "button")}
          >
            {privateEvents?.buttonLabel || "PLAN YOUR EVENT"}{" "}
            <span>→</span>
          </a>
        </div>
      </section>

      {/* =====================================================
          05 — RESERVATION
          ===================================================== */}

      {isVisible(
        "reservation-contact"
      ) && (
        <section
          id="reserve"
          className="reservation opaque-section"
        >
          <p
            className="eyebrow light"
            style={cmsStyle(
              "reservation-contact",
              "eyebrow"
            )}
          >
            {reservation?.eyebrow ||
              "Yalıkavak · Bodrum"}
          </p>

          <h2
            style={cmsStyle(
              "reservation-contact",
              "heading"
            )}
          >
            {reservation?.heading
              ? renderLines(
                  reservation.heading
                )
              : (
                <>
                  Reserve
                  <br />
                  Your Table
                </>
              )}
          </h2>

          <p
            style={cmsStyle(
              "reservation-contact",
              "text"
            )}
          >
            {reservation?.body
              ? renderLines(
                  reservation.body
                )
              : (
                <>
                  Request your table by
                  WhatsApp, phone or email.
                  <br />
                  Our team will confirm
                  availability with you.
                </>
              )}
          </p>

          <div className="reservation-actions reservation-actions-stacked">
            <a
              className="outline-button"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={cmsStyle("reservation-contact", "button")}
            >
              {reservation?.buttonLabel ||
                "REQUEST VIA WHATSAPP"}
            </a>

            <a
              className="line-link light-link"
              href={telHref}
            >
              CALL {settings.phone}
            </a>

            <a
              className="line-link light-link"
              href={emailHref}
            >
              EMAIL US
            </a>
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <Footer locale="en" />
    </main>
  );
}