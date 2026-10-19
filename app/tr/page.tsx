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

/* =========================================================
   MEDIA
   ========================================================= */

type HomepagePhotos = {
  hero: string;
  food: string;
  drinks: string;
  breakfast: string;
  atmosphere: string;
  moments: string;
  sunset: string;
};

const emptyPhotos: HomepagePhotos = {
  hero: "",
  food: "",
  drinks: "",
  breakfast: "",
  atmosphere: "",
  moments: "",
  sunset: "",
};

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

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const defaultSettings: SiteSettings = {
  phone: "+90 545 894 18 38",

  email:
    "reservation.bodrum@lalara.com.tr",

  address:
    "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",

  instagram:
    "https://www.instagram.com/lalara.bodrum/",

  facebook:
    "https://www.facebook.com/lalararestaurant",

  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
};

/* =========================================================
   HELPERS
   ========================================================= */

function renderLines(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}

      {index < lines.length - 1 && (
        <br />
      )}
    </span>
  ));
}

/* =========================================================
   PAGE
   ========================================================= */

export default function HomeTR() {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const [settings, setSettings] =
    useState<SiteSettings>(
      defaultSettings
    );

  const [photos, setPhotos] =
    useState<HomepagePhotos>(
      emptyPhotos
    );

  const [gallery, setGallery] =
    useState<string[]>([]);

  /* =======================================================
     LOAD CMS
     ======================================================= */

  useEffect(() => {
    async function loadCms() {
      try {
        /* ================================================
           CONTENT
           ================================================ */

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
              item.id.startsWith(
                "tr-"
              ) &&
              data.status ===
                "published"
            ) {
              nextCms[
                item.id.replace(
                  "tr-",
                  ""
                )
              ] = data;
            }
          }
        );

        setCms(nextCms);

        /* ================================================
           SETTINGS + MEDIA
           ================================================ */

        const [
          contactSnapshot,
          socialSnapshot,
          homepageMediaSnapshot,
          galleryMediaSnapshot,
        ] = await Promise.all([
          getDoc(
            doc(
              db,
              "siteSettings",
              "contact"
            )
          ),

          getDoc(
            doc(
              db,
              "siteSettings",
              "social"
            )
          ),

          getDoc(
            doc(
              db,
              "pageMedia",
              "homepage"
            )
          ),

          getDoc(
            doc(
              db,
              "pageMedia",
              "gallery"
            )
          ),
        ]);

        /* ================================================
           SETTINGS
           ================================================ */

        setSettings({
          phone:
            contactSnapshot.data()
              ?.phone ??
            defaultSettings.phone,

          email:
            contactSnapshot.data()
              ?.email ??
            defaultSettings.email,

          address:
            contactSnapshot.data()
              ?.address ??
            defaultSettings.address,

          instagram:
            socialSnapshot.data()
              ?.instagram ??
            defaultSettings.instagram,

          facebook:
            socialSnapshot.data()
              ?.facebook ??
            defaultSettings.facebook,

          tripadvisor:
            socialSnapshot.data()
              ?.tripadvisor ??
            defaultSettings.tripadvisor,
        });

        /* ================================================
           HOMEPAGE MEDIA
           ================================================ */

        const homepageFields =
          homepageMediaSnapshot.exists()
            ? homepageMediaSnapshot.data()
                ?.fields || {}
            : {};

        setPhotos({
          hero:
            typeof homepageFields.hero ===
            "string"
              ? homepageFields.hero
              : "",

          food:
            typeof homepageFields.food ===
            "string"
              ? homepageFields.food
              : "",

          drinks:
            typeof homepageFields.drinks ===
            "string"
              ? homepageFields.drinks
              : "",

          breakfast:
            typeof homepageFields
              .breakfast === "string"
              ? homepageFields.breakfast
              : "",

          atmosphere:
            typeof homepageFields
              .atmosphere === "string"
              ? homepageFields.atmosphere
              : "",

          moments:
            typeof homepageFields
              .moments === "string"
              ? homepageFields.moments
              : "",

          sunset:
            typeof homepageFields.sunset ===
            "string"
              ? homepageFields.sunset
              : "",
        });

        /* ================================================
           GALLERY MEDIA
           ================================================ */

        const galleryFields =
          galleryMediaSnapshot.exists()
            ? galleryMediaSnapshot.data()
                ?.fields || {}
            : {};

        const savedGallery =
          Array.isArray(
            galleryFields.photos
          )
            ? galleryFields.photos.filter(
                (
                  url: unknown
                ): url is string =>
                  typeof url ===
                    "string" &&
                  url.length > 0
              )
            : [];

        setGallery(savedGallery);
      } catch (error) {
        console.error(
          "La Lara CMS load error:",
          error
        );
      }
    }

    loadCms();
  }, []);

  /* =======================================================
     CMS HELPERS
     ======================================================= */

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return (
      cms[key]?.visible !== false
    );
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

  /* =======================================================
     SETTINGS
     ======================================================= */

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref =
    `mailto:${settings.email}`;

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:"
    );

  /* =======================================================
     CMS KEYS
     ======================================================= */

  const hero =
    content("hero");

  const menus =
    content("menus");

  const story =
    content(
      "homepage-our-story"
    );

  const experience =
    content(
      "experience-gallery"
    );

  const foodCard = content("homepage-food-card");
  const drinksCard = content("homepage-drinks-card");
  const breakfastCard = content("homepage-breakfast-card");
  const storyDetail = content("homepage-story-detail");
  const privateEvents = content("homepage-private-events");

  const reservation =
    content(
      "reservation-contact"
    );

  return (
    <main className="home-page">
      {/* ===================================================
          OPENING
          =================================================== */}

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

      {/* ===================================================
          BACKGROUND BRAND
          =================================================== */}

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

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header locale="tr" />

      {/* ===================================================
          01 — HERO
          =================================================== */}

      {isVisible("hero") && (
        <section className="hero opaque-section">
          {photos.hero && (
            <Image
              src={photos.hero}
              alt="Yalıkavak Bodrum'da La Lara Restaurant & Bar"
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
                    Yalıkavak
                    Körfezi&apos;ne
                    Karşı
                    <br />
                    Akdeniz Mutfağı.
                  </>
                )}
            </h1>

            <p
              className="hero-description"
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
                    Aile hikâyesinden
                    ilham alan La Lara;
                    Akdeniz
                    lezzetlerini,
                    güzel manzaraları
                    ve sıcak
                    misafirperverliği
                    bir araya
                    getiriyor.
                  </>
                )}
            </p>

         <div className="hero-actions">
  <a
    href="#menus"
    className="outline-button tr-uppercase"
  >
    MENÜYÜ GÖR
  </a>

  <a
    href={hero?.buttonLink || "#reserve"}
    className="outline-button tr-uppercase"
  >
    {hero?.buttonLabel || "REZERVASYON YAP"}
  </a>
</div>
          </div>

          <a
            className="scroll-cue"
            href="#menus"
          >
            Menülerimizi Keşfet{" "}
            <i />
          </a>
        </section>
      )}

      {/* ===================================================
          02 — MENUS
          =================================================== */}

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
                  "Menüler"}
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
                    Menülerimizi
                    <br />
                    Keşfedin
                  </>
                )}
            </h2>
          </div>

          <div className="menu-grid">
            <article>
              <div className="menu-image">
                {photos.food && (
                  <Image
                    src={photos.food}
                    alt="La Lara Yalıkavak Akdeniz yemekleri"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <p className="kicker" style={cmsStyle("homepage-food-card", "eyebrow")}>{foodCard?.eyebrow || "Akdeniz"}</p>

              <h3 style={cmsStyle("homepage-food-card", "heading")}>{foodCard?.heading || "Yemek"}</h3>

              <a
                className="line-link"
                href={foodCard?.buttonLink || "/food-menu?lang=tr"}
              >
                {foodCard?.buttonLabel || "MENÜYÜ GÖR"}{" "}
                <span>→</span>
              </a>
            </article>

            <article>
              <div className="menu-image">
                {photos.drinks && (
                  <Image
                    src={photos.drinks}
                    alt="La Lara Restaurant & Bar kokteyl ve içecekleri"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <p className="kicker" style={cmsStyle("homepage-drinks-card", "eyebrow")}>{drinksCard?.eyebrow || "Bar"}</p>

              <h3 style={cmsStyle("homepage-drinks-card", "heading")}>{drinksCard?.heading || "İçecek"}</h3>

              <a
                className="line-link"
                href={drinksCard?.buttonLink || "/drinks-menu?lang=tr"}
              >
                {drinksCard?.buttonLabel || "MENÜYÜ GÖR"}{" "}
                <span>→</span>
              </a>
            </article>

            <article>
              <div className="menu-image">
                {photos.breakfast && (
                  <Image
                    src={
                      photos.breakfast
                    }
                    alt="La Lara Yalıkavak deniz manzaralı kahvaltı"
                    fill
                    sizes="(max-width:900px) 100vw,33vw"
                    className="cover"
                  />
                )}
              </div>

              <p className="kicker" style={cmsStyle("homepage-breakfast-card", "eyebrow")}>{breakfastCard?.eyebrow || "Sabah"}</p>

              <h3 style={cmsStyle("homepage-breakfast-card", "heading")}>{breakfastCard?.heading || "Kahvaltı"}</h3>

              <a
                className="line-link"
                href={breakfastCard?.buttonLink || "/breakfast-menu?lang=tr"}
              >
                {breakfastCard?.buttonLabel || "MENÜYÜ GÖR"}{" "}
                <span>→</span>
              </a>
            </article>
          </div>
        </section>
      )}

      {/* ===================================================
          03 — STORY
          =================================================== */}

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
                  "Hikâyemiz"}
              </p>

              <span style={cmsStyle("homepage-story-detail", "eyebrow")}>
                {storyDetail?.eyebrow || "La Lara'nın Hikâyesi"}
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
                    Bir Aile Hikâyesi,
                    <br />
                    Paylaşılan Bir
                    Sofra.
                  </>
                )}
            </h2>
          </div>

          <div className="story-grid">
            <div className="story-image">
              {photos.atmosphere && (
                <Image
                  src={
                    photos.atmosphere
                  }
                  alt="La Lara Restaurant'ın aile hikâyesi"
                  fill
                  sizes="(max-width:900px) 100vw,56vw"
                  className="cover"
                />
              )}
            </div>

            <div className="story-copy">
              <h3 style={cmsStyle("homepage-story-detail", "heading")}>
                {storyDetail?.heading ? renderLines(storyDetail.heading) : <>İsmin Ardındaki<br />Kadın.</>}
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
                    La Lara bir
                    restoran olmadan
                    çok önce,
                    herkesin kendini
                    evinde hissettiği
                    bir sofra vardı.
                  </p>

                  <p>
                    Bu sofra
                    büyükannemiz
                    Lara&apos;ya
                    aitti. Sıcak,
                    karakterli ve
                    biraz da diva
                    ruhuna sahip bir
                    kadındı. Yemeğe,
                    ailesine ve
                    insanları bir
                    araya getirmeye
                    duyduğu sevgi, La
                    Lara&apos;da
                    yaratmak
                    istediğimiz her
                    şeyin ilhamı oldu.
                  </p>

                  <p>
                    Bazı hikâyeler
                    anlatılmadan
                    bırakılamayacak
                    kadar özeldir.
                  </p>
                </>
              )}

              <a
                href={
                  story?.buttonLink ||
                  "/tr/hikayemiz"
                }
                className="line-link"
                style={cmsStyle(
                  "homepage-our-story",
                  "button"
                )}
              >
                {story?.buttonLabel ||
                  "HİKÂYEMİZİ KEŞFEDİN"}{" "}
                <span>→</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          04 — EXPERIENCE / GALLERY
          BU BÖLÜM GÖRSELDE GÖSTERDİĞİN BÜYÜK ALAN
          =================================================== */}

      {isVisible(
        "experience-gallery"
      ) && (
        <>
          <section
            id="moments"
            className="experience opaque-section"
          >
            {photos.moments && (
              <Image
                src={photos.moments}
                alt="Yalıkavak Körfezi manzaralı La Lara Restaurant"
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
                  "Yalıkavak'ta La Lara"}
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
                      Sofradan
                      <br />
                      Manzaraya.
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
                      Akdeniz mutfağı,
                      kokteyller ve
                      Yalıkavak
                      Körfezi&apos;ne
                      karşı akşamlar.
                    </>
                  )}
              </p>

              <a
                href={
                  experience?.buttonLink ||
                  "/tr/galeri"
                }
                className="line-link light-link"
                style={cmsStyle(
                  "experience-gallery",
                  "button"
                )}
              >
                {experience?.buttonLabel ||
                  "GALERİYİ GÖR"}{" "}
                <span>→</span>
              </a>
            </div>
          </section>

          {/* ===============================================
              SMALL GALLERY
              =============================================== */}

          {gallery.length > 0 && (
            <section className="menus transparent-section">
              <div className="menu-grid">
                {gallery
                  .slice(0, 3)
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
                                ? "La Lara Restaurant Akdeniz mutfağı"
                                : index === 1
                                  ? "La Lara Restaurant & Bar kokteylleri"
                                  : "La Lara Yalıkavak gün batımı atmosferi"
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
          )}
        </>
      )}

            {/* ===================================================
          SECTION SPACER
          =================================================== */}

      <div
        aria-hidden="true"
        style={{
          height: "130px",
          background: "#faf8f4",
        }}
      />

      {/* ===================================================
          PRIVATE EVENTS
          =================================================== */}

      <section
        id="events"
        className="split-section opaque-section"
      >
        <div className="split-image">
          {photos.sunset && (
            <Image
              src={photos.sunset}
              alt="La Lara Yalıkavak özel davet ve organizasyonlar"
              fill
              sizes="(max-width:900px) 100vw,58vw"
              className="cover"
            />
          )}
        </div>

        <div className="split-copy">
          <p className="eyebrow" style={cmsStyle("homepage-private-events", "eyebrow")}>
            {privateEvents?.eyebrow || "Özel Davetler"}
          </p>

          <h2 style={cmsStyle("homepage-private-events", "heading")}>
            {privateEvents?.heading ? renderLines(privateEvents.heading) : <>Özel Yemekler<br />&amp; Etkinlikler</>}
          </h2>

          <p style={{...cmsStyle("homepage-private-events", "text"), whiteSpace: "pre-line"}}>
            {privateEvents?.body || "Yalıkavak Körfezi'ne karşı düğünler, doğum günleri, özel yemekler ve davetler.\n\nNasıl bir etkinlik planladığınızı bize anlatın; ekibimiz davetinizi size ve misafirlerinize göre şekillendirsin."}
          </p>

          <a href={privateEvents?.buttonLink || "/tr/ozel-etkinlikler"} className="line-link" style={cmsStyle("homepage-private-events", "button")}>
            {privateEvents?.buttonLabel || "ETKİNLİĞİNİZİ PLANLAYIN"}{" "}<span>→</span>
          </a>
        </div>
      </section>

    

      {/* ===================================================
          05 — RESERVATION
          =================================================== */}

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
                  Masanızı
                  <br />
                  Ayırtın
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
                  WhatsApp, telefon
                  veya e-posta
                  üzerinden
                  rezervasyon
                  talebinizi iletin.
                  <br />
                  Ekibimiz uygunluğu
                  sizinle teyit
                  edecektir.
                </>
              )}
          </p>

          <div className="reservation-actions reservation-actions-stacked">
            <a
              className="outline-button tr-uppercase"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={cmsStyle(
                "reservation-contact",
                "button"
              )}
            >
              {reservation?.buttonLabel ||
                "WHATSAPP İLE TALEP GÖNDER"}
            </a>

            <a
              className="line-link light-link"
              href={telHref}
            >
              ARA {settings.phone}
            </a>

            <a
              className="line-link light-link"
              href={emailHref}
            >
              E-POSTA GÖNDER
            </a>
          </div>
        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <Footer locale="tr" />
    </main>
  );
}