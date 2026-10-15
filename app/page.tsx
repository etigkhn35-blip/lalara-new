"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const defaultPhotos = {
  hero: "/images/home/1.jpg",
  atmosphere: "/images/home/2.jpg",
  food: "/images/home/3.jpg",
  drinks: "/images/home/4.jpg",
  breakfast: "/images/home/5.jpg",
  sunset: "/images/home/6.jpg",
  story: "/images/home/7.jpg",
  moments: "/images/home/8.jpg",
  event1: "/images/home/8.jpg",
  event2: "/images/home/7.jpg",
  event3: "/images/home/3.jpg",
  contactHero: "/images/home/6.jpg",
};

const defaultDocuments = {
  food: "/lalara-menu.pdf",
  drinks: "/lalara-drinks.pdf",
  breakfast: "/lalara-breakfast.pdf",
};

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  buttonLabel?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;
  buttonSize?: number;

  fontFamily?: "display" | "sans";
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

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
  instagram: "https://www.instagram.com/lalara.bodrum/",
  facebook: "https://www.facebook.com/lalararestaurant",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
};

function renderLines(value: string) {
  return value.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < value.split("\n").length - 1 && <br />}
    </span>
  ));
}

export default function Home() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [cms, setCms] = useState<Record<string, CmsRecord>>({});
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [photos, setPhotos] = useState(defaultPhotos);
  const [gallery, setGallery] = useState<string[]>([]);
  const [documents, setDocuments] = useState(defaultDocuments);

  useEffect(() => {
    async function loadCms() {
      try {
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
            nextCms[item.id.replace("en-", "")] = data;
          }
        });

        setCms(nextCms);

        const [
          contactSnapshot,
          socialSnapshot,
          mediaSnapshot,
          documentsSnapshot,
        ] = await Promise.all([
          getDoc(doc(db, "siteSettings", "contact")),
          getDoc(doc(db, "siteSettings", "social")),
          getDoc(doc(db, "siteSettings", "media")),
          getDoc(doc(db, "siteSettings", "documents")),
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

        const savedImages =
          mediaSnapshot.data()?.images || {};

        setPhotos({
          hero:
            savedImages.hero?.url ||
            defaultPhotos.hero,

          atmosphere:
            savedImages.atmosphere?.url ||
            defaultPhotos.atmosphere,

          food:
            savedImages.food?.url ||
            defaultPhotos.food,

          drinks:
            savedImages.drinks?.url ||
            defaultPhotos.drinks,

          breakfast:
            savedImages.breakfast?.url ||
            defaultPhotos.breakfast,

          sunset:
            savedImages.sunset?.url ||
            defaultPhotos.sunset,

          story:
            savedImages.story?.url ||
            defaultPhotos.story,

          moments:
            savedImages.moments?.url ||
            defaultPhotos.moments,

          event1:
            savedImages.event1?.url ||
            savedImages.moments?.url ||
            defaultPhotos.event1,

          event2:
            savedImages.event2?.url ||
            defaultPhotos.event2,

          event3:
            savedImages.event3?.url ||
            defaultPhotos.event3,

          contactHero:
            savedImages.contactHero?.url ||
            defaultPhotos.contactHero,
        });

        setGallery(
          Array.isArray(mediaSnapshot.data()?.gallery)
            ? mediaSnapshot
                .data()!
                .gallery.map(
                  (item: { url?: string }) => item.url
                )
                .filter(Boolean)
            : []
        );

        setDocuments({
          food:
            documentsSnapshot.data()?.food?.url ||
            defaultDocuments.food,

          drinks:
            documentsSnapshot.data()?.drinks?.url ||
            defaultDocuments.drinks,

          breakfast:
            documentsSnapshot.data()?.breakfast?.url ||
            defaultDocuments.breakfast,
        });
      } catch (error) {
        console.error(
          "La Lara CMS load error:",
          error
        );
      }
    }

    loadCms();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 700);
    }

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref = `mailto:${settings.email}`;

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Hello La Lara, I would like to request a reservation.\n\nDate:\nTime:\nNumber of guests:"
    );

  const galleryPhotos = [
    gallery[0] || photos.atmosphere,
    gallery[1] || photos.food,
    gallery[2] || photos.drinks,
    gallery[3] || photos.sunset,
  ];

  function cmsStyle(
    key: string,
    kind: "eyebrow" | "heading" | "text" | "button"
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

    return {
      ...(size
        ? { fontSize: `${size}px` }
        : {}),

      ...(item.fontFamily
        ? {
            fontFamily:
              item.fontFamily === "sans"
                ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
                : '"Iowan Old Style", Baskerville, "Times New Roman", serif',
          }
        : {}),

      ...(item.fontWeight
        ? { fontWeight: item.fontWeight }
        : {}),

      ...(item.lineHeight
        ? { lineHeight: item.lineHeight }
        : {}),

      ...(item.letterSpacing !== undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="home-page">
      {/* OPENING */}
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

      {/* BACKGROUND BRAND */}
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

      {/* HEADER */}
      <Header locale="en" />

      {/* 01 — HERO */}
      <section className="hero opaque-section">
        <Image
          src={photos.hero}
          alt="La Lara Restaurant & Bar overlooking Yalıkavak Bay in Bodrum"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div className="hero-content">
          

          <h1
            style={cmsStyle(
              "hero",
              "heading"
            )}
          >
            {cms.hero?.heading
              ? renderLines(
                  cms.hero.heading
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
  style={{
    ...cmsStyle("hero", "text"),
    fontSize: "18px",
  }}
>
            {cms.hero?.body
              ? renderLines(cms.hero.body)
              : (
                <>
                  Mediterranean food,
                  beautiful views and
                  warm hospitality in
                  Yalıkavak.
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
              href="#reserve"
              className="outline-button"
            >
              Reserve a Table
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

      {/* 02 — MENUS */}
      <section
        id="menus"
        className="menus transparent-section"
      >
        <div className="section-title">
          <div>
            <p className="eyebrow">
              The Menus
            </p>

            
          </div>

          <h2>
            Mediterranean
            <br />
            Food &amp; Drinks
          </h2>
        </div>

        <div className="menu-grid">
          <article>
            <div className="menu-image">
              <Image
                src={photos.food}
                alt="Mediterranean dishes served at La Lara Restaurant in Yalıkavak"
                fill
                sizes="(max-width:900px) 100vw,33vw"
                className="cover"
              />
            </div>

            <h3>Food</h3>

            <a
  className="line-link"
  href="/food-menu"
>
  VIEW MENU <span>→</span>
</a>
          </article>

          <article>
            <div className="menu-image">
              <Image
                src={photos.drinks}
                alt="Cocktails and drinks at La Lara Restaurant"
                fill
                sizes="(max-width:900px) 100vw,33vw"
                className="cover"
              />
            </div>

            <h3>Drinks</h3>

           <a
  className="line-link"
  href="/drinks-menu"
>
  VIEW MENU <span>→</span>
</a>
          </article>

          <article>
            <div className="menu-image">
              <Image
                src={photos.breakfast}
                alt="Breakfast overlooking Yalıkavak Bay at La Lara"
                fill
                sizes="(max-width:900px) 100vw,33vw"
                className="cover"
              />
            </div>

            <h3>Breakfast</h3>

         <a
  className="line-link"
  href="/breakfast-menu"
>
  VIEW MENU <span>→</span>
</a>
          </article>
        </div>
      </section>

      {/* 03 — FAMILY STORY */}
      <section
        id="story"
        className="story transparent-section"
      >
        <div className="section-title">
          <div>
            <p
              className="eyebrow"
              style={cmsStyle(
                "our-story",
                "eyebrow"
              )}
            >
              Our Story
            </p>

            <span>
              The story behind La Lara
            </span>
          </div>

          <h2
            style={cmsStyle(
              "our-story",
              "heading"
            )}
          >
            A Family Story,
            <br />
            A Shared Table.
          </h2>
        </div>

        <div className="story-grid">
          <div className="story-image">
            <Image
              src={photos.story}
              alt="The family story behind La Lara Restaurant"
              fill
              sizes="(max-width:900px) 100vw,56vw"
              className="cover"
            />
          </div>

          <div className="story-copy">
            <h3>
              The story behind
              <br />
              La Lara.
            </h3>

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

            <a
              href="/our-story"
              className="line-link"
            >
              READ OUR STORY{" "}
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 04 — EXPERIENCE + GALLERY */}
      <section
        id="moments"
        className="experience opaque-section"
      >
        <Image
          src={galleryPhotos[0]}
          alt="La Lara Restaurant and Yalıkavak atmosphere"
          fill
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div>
          <p className="eyebrow light">
            La Lara in Yalıkavak
          </p>

          <h2>
            From the table
            <br />
            to the view.
          </h2>

          <p>
            Mediterranean food,
            cocktails and evenings
            overlooking Yalıkavak Bay.
          </p>

          <a
            href="/gallery"
            className="line-link light-link"
          >
            VIEW GALLERY{" "}
            <span>→</span>
          </a>
        </div>
      </section>

      {/* COMPACT GALLERY */}
      <section className="menus transparent-section">
        <div className="menu-grid">
          {galleryPhotos
            .slice(1, 4)
            .map((photo, index) => (
              <article
                key={`${photo}-${index}`}
              >
                <div className="menu-image">
                  <Image
                    src={photo}
                    alt={
                      index === 0
                        ? "Food presentation at La Lara Restaurant"
                        : index === 1
                          ? "Cocktails at La Lara Restaurant"
                          : "Sunset atmosphere at La Lara Yalıkavak"
                    }
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* PRIVATE EVENTS */}
      <section
        id="events"
        className="split-section opaque-section"
      >
        <div className="split-image">
          <Image
            src={photos.event1}
            alt="Private dining, weddings and events at La Lara Yalıkavak"
            fill
            sizes="(max-width:900px) 100vw,58vw"
            className="cover"
          />
        </div>

        <div className="split-copy">
          <p className="eyebrow">
            Private Events
          </p>

          <h2>
            Private Dining
            <br />
            &amp; Events
          </h2>

          <p>
            Weddings, celebrations,
            private dinners and
            gatherings overlooking
            Yalıkavak Bay.
          </p>

          <p>
            Tell us what you are
            planning and our team will
            help shape the occasion
            around your guests.
          </p>

          <a
            href="/private-events"
            className="line-link"
          >
            PLAN YOUR EVENT{" "}
            <span>→</span>
          </a>
        </div>
      </section>

      {/* 05 — RESERVATION */}
      <section
        id="reserve"
        className="reservation opaque-section"
      >
        <p className="eyebrow light">
          {cms.reservation?.eyebrow ||
            "Yalıkavak · Bodrum"}
        </p>

        <h2
          style={
            cms.reservation?.headingSize
              ? {
                  fontSize: `${cms.reservation.headingSize}px`,
                }
              : undefined
          }
        >
          {cms.reservation?.heading
            ? renderLines(
                cms.reservation.heading
              )
            : (
              <>
                Reserve
                <br />
                Your Table
              </>
            )}
        </h2>

        <p>
          Request your table by
          WhatsApp, phone or email.
          <br />
          Our team will confirm
          availability with you.
        </p>

        <div className="reservation-actions reservation-actions-stacked">
          <a
            className="outline-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            REQUEST VIA WHATSAPP
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

      {/* FOOTER */}
      <Footer locale="en" />

      {/* FIXED BACK TO TOP */}
      <button
        type="button"
        className={`back-to-top ${
          showBackToTop
            ? "is-visible"
            : ""
        }`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </main>
  );
}