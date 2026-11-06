"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { homepageOriginals } from "@/lib/cms/homepage";
import { useSiteContent } from "@/lib/cms/useSiteContent";

type HomepageMedia = {
  hero?: string;
  food?: string;
  drinks?: string;
  breakfast?: string;
  atmosphere?: string;
  moments?: string;
  sunset?: string;
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
  const [showOpening, setShowOpening] = useState(false);
  const introChecked = useRef(false);

  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [photos, setPhotos] =
    useState<HomepageMedia | null>(null);

  const [gallery, setGallery] =
    useState<string[]>([]);


const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    async function loadSettingsAndMedia() {
      try {
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

        const homepageFields =
          homepageMediaSnapshot.exists()
            ? (homepageMediaSnapshot.data()
                ?.fields as HomepageMedia | undefined)
            : undefined;

        setPhotos(homepageFields || {});

      } catch (error) {
        console.error(
          "La Lara EN settings/media load error:",
          error
        );
      }
    }

    loadSettingsAndMedia();

    // Keep the homepage slider synchronized with every Gallery photo.
    const unsubscribeGallery = onSnapshot(
      doc(db, "pageMedia", "gallery"),
      (snapshot) => {
        const fields = snapshot.exists() ? snapshot.data()?.fields : undefined;
        const urls = Array.isArray(fields?.photos)
          ? fields.photos.filter(
              (url: unknown): url is string =>
                typeof url === "string" && url.trim().length > 0
            )
          : [];
        setGallery(urls);
        setGalleryIndex((index) => (urls.length ? index % urls.length : 0));
      },
      (error) => console.error("La Lara gallery realtime error:", error)
    );

    return () => unsubscribeGallery();
  }, []);

  const {
    ready: cmsReady,
    getContent: content,
    isVisible,
    styleFor: cmsStyle,
  } = useSiteContent({
    locale: "en",
    originals: homepageOriginals.en,
  });

  // Intro is shown once per browser tab, or whenever the header logo is clicked.
  // Wait for CMS readiness so the animation does not finish while the page is hidden.
  useEffect(() => {
    if (!cmsReady || introChecked.current) return;
    introChecked.current = true;

    const params = new URLSearchParams(window.location.search);
    const requestedByLogo = params.get("intro") === "1";
    let alreadySeen = false;

    try {
      alreadySeen = window.sessionStorage.getItem("lalara-intro-seen") === "1";
      window.sessionStorage.setItem("lalara-intro-seen", "1");
    } catch {
      // The logo link must still work if browser storage is unavailable.
    }

    setShowOpening(requestedByLogo || !alreadySeen);

    if (requestedByLogo) {
      params.delete("intro");
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash
      );
    }
  }, [cmsReady]);

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

  // Prevent original -> Firebase content/style flash on refresh.
  if (!cmsReady) {
    return <main className="home-page" aria-busy="true" />;
  }

  return (
    <main className="home-page">
      {/* =====================================================
          OPENING
          ===================================================== */}

      {showOpening && (
        <div className="opening" aria-hidden="true">
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
      )}

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
  {hero?.heading ? (
    <>
      Feel-good classics
      <br />
      with a view.
    </>
  ) : (
    <>
      Feel-good classics
      <br />
      with a view.
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
          </div>

         
        </section>
      )}

          {/* =====================================================
          02 — MENUS
          ===================================================== */}

      {isVisible("menus") && (
        <section
          id="menus"
          className="home-menus-section"
        >
          <div className="home-menus-inner">
            <p className="home-menus-eyebrow">
              THE MENUS
            </p>

            <div className="home-menus-grid">

              {/* BREAKFAST */}
              <article className="home-menu-card">
                <h2>
                  {breakfastCard?.heading || "Breakfast"}
                </h2>

                <a
                  className="home-menu-link"
                  href={
                    breakfastCard?.buttonLink ||
                    "/breakfast-menu?lang=en"
                  }
                >
                  {breakfastCard?.buttonLabel || "VIEW MENU"}
                  <span>›</span>
                </a>

                <div className="home-menu-image">
                  {photos?.breakfast && (
                    <Image
                      src={photos.breakfast}
                      alt="Breakfast at La Lara Restaurant in Yalıkavak"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="cover"
                    />
                  )}
                </div>
              </article>

              {/* LUNCH & DINNER */}
              <article className="home-menu-card">
                <h2>
                  Lunch &amp; Dinner
                </h2>

                <a
                  className="home-menu-link"
                  href={
                    foodCard?.buttonLink ||
                    "/food-menu?lang=en"
                  }
                >
                  {foodCard?.buttonLabel || "VIEW MENU"}
                  <span>›</span>
                </a>

                <div className="home-menu-image">
                  {photos?.food && (
                    <Image
                      src={photos.food}
                      alt="Lunch and dinner at La Lara Restaurant in Yalıkavak"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="cover"
                    />
                  )}
                </div>
              </article>

              {/* DRINKS */}
              <article className="home-menu-card">
                <h2>
                  {drinksCard?.heading || "Drinks"}
                </h2>

                <a
                  className="home-menu-link"
                  href={
                    drinksCard?.buttonLink ||
                    "/drinks-menu?lang=en"
                  }
                >
                  {drinksCard?.buttonLabel || "VIEW MENU"}
                  <span>›</span>
                </a>

                <div className="home-menu-image">
                  {photos?.drinks && (
                    <Image
                      src={photos.drinks}
                      alt="Cocktails and drinks at La Lara Restaurant in Yalıkavak"
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="cover"
                    />
                  )}
                </div>
              </article>

            </div>
          </div>
        </section>
      )}
            {/* =====================================================
          03 — OUR STORY
          ===================================================== */}

      {isVisible("homepage-our-story") && (
        <section
          id="story"
          className="home-story-section"
        >
          <div className="home-story-inner">

            <div className="home-story-image">
              {photos?.atmosphere && (
                <Image
                  src={photos.atmosphere}
                  alt="The woman behind the La Lara story"
                  fill
                  sizes="(max-width: 900px) 100vw, 56vw"
                  className="cover"
                />
              )}
            </div>
<div className="home-story-copy">
  <p className="home-story-eyebrow">
    OUR STORY
  </p>

  <h2>
    The woman
    <br />
    behind the name.
  </h2>

  <p className="home-story-text">
    Every family has someone who brings everyone together.
    <br />
    In ours, that person was Lara.
  </p>

  <a
    href="/our-story"
    className="home-story-link"
  >
    READ OUR STORY
    <span>›</span>
  </a>
</div>

          </div>
        </section>
      )}

      {/* =====================================================
          04 — EVENTS
          ===================================================== */}

      {isVisible("homepage-private-events") && (
        <section
          id="events"
          className="home-events-section"
        >
          <div className="home-events-inner">

            <div className="home-events-copy">
              <p className="home-events-eyebrow">
                EVENTS
              </p>

              <h2>
                Your exclusive
                <br />
                venue experience
              </h2>

              <p className="home-events-text">
                Weddings, celebrations and private dinners
                <br />
                overlooking Yalıkavak Bay.
              </p>

              <a
                href={privateEvents?.buttonLink || "/private-events"}
                className="home-events-link"
              >
                PLAN YOUR EVENT
                <span>›</span>
              </a>
            </div>

            <div className="home-events-image">
              {photos?.sunset && (
                <Image
                  src={photos.sunset}
                  alt="Weddings, celebrations and private events overlooking Yalıkavak Bay at La Lara"
                  fill
                  sizes="(max-width: 900px) 100vw, 60vw"
                  className="cover"
                />
              )}
            </div>

          </div>
        </section>
      )}

            {/* =====================================================
          05 — GALLERY SLIDER
          ===================================================== */}

      {isVisible("experience-gallery") && (
        <section
          id="moments"
          className="home-gallery-slider"
          aria-label="La Lara photo gallery"
        >
          {(() => {
            const slides =
              gallery.length > 0
                ? gallery
                : [
                    photos?.food,
                    photos?.drinks,
                    photos?.atmosphere,
                    photos?.moments,
                    photos?.breakfast,
                    photos?.sunset,
                  ].filter((url): url is string => Boolean(url));

            if (!slides.length) return null;

            const current =
              ((galleryIndex % slides.length) + slides.length) %
              slides.length;

            return (
              <div className="home-gallery-track">
                <button
                  type="button"
                  className="home-gallery-side"
                  aria-label="Previous photo"
                  onClick={() =>
                    setGalleryIndex(
                      (index) =>
                        (index - 1 + slides.length) % slides.length
                    )
                  }
                >
                  <Image
                    src={slides[(current - 1 + slides.length) % slides.length]}
                    alt="Previous La Lara gallery photo"
                    fill
                    sizes="25vw"
                    className="cover"
                  />
                </button>

                <div className="home-gallery-main">
                  <Image
                    key={slides[current]}
                    src={slides[current]}
                    alt={`La Lara Restaurant gallery photo ${current + 1}`}
                    fill
                    sizes="(max-width: 900px) 82vw, 62vw"
                    className="cover"
                  />
                </div>

                <button
                  type="button"
                  className="home-gallery-side"
                  aria-label="Next photo"
                  onClick={() =>
                    setGalleryIndex(
                      (index) => (index + 1) % slides.length
                    )
                  }
                >
                  <Image
                    src={slides[(current + 1) % slides.length]}
                    alt="Next La Lara gallery photo"
                    fill
                    sizes="25vw"
                    className="cover"
                  />
                </button>
              </div>
            );
          })()}
        </section>
      )}

      {/* =====================================================
          06 — RESERVE YOUR TABLE
          ===================================================== */}

      {isVisible("reservation-contact") && (
        <section
          id="reserve"
          className="home-reservation-banner"
        >
          {photos?.hero && (
            <Image
              src={photos.hero}
              alt="La Lara Restaurant dining area"
              fill
              sizes="100vw"
              className="home-reservation-photo"
            />
          )}

          <div className="home-reservation-shade" />

          <div className="home-reservation-content">
            <h2>Reserve your table.</h2>

            <div className="home-reservation-buttons">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                WHATSAPP
              </a>

              <a href={telHref}>
                CALL
              </a>
            </div>
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