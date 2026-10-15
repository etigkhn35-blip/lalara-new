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
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function HomeTR() {
  const [cms, setCms] = useState<Record<string, CmsRecord>>({});

  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [photos, setPhotos] = useState(defaultPhotos);
  const [gallery, setGallery] = useState<string[]>([]);
  const [documents, setDocuments] = useState(defaultDocuments);
  const [showBackToTop, setShowBackToTop] = useState(false);

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
            item.id.startsWith("tr-") &&
            data.status === "published"
          ) {
            nextCms[item.id.replace("tr-", "")] = data;
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

        const savedGallery = mediaSnapshot.data()?.gallery;

        if (Array.isArray(savedGallery)) {
          setGallery(
            savedGallery
              .map((item: { url?: string }) => item?.url)
              .filter(
                (url: string | undefined): url is string =>
                  Boolean(url)
              )
          );
        }

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
        console.error("La Lara CMS load error:", error);
      }
    }

    loadCms();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 650);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref = `mailto:${settings.email}`;

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:"
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
        ? {
            fontSize: `${size}px`,
          }
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
        ? {
            fontWeight: item.fontWeight,
          }
        : {}),

      ...(item.lineHeight
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

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="home-page">
      {/* OPENING */}
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

      {/* BACKGROUND BRAND */}
      <div className="background-brand" aria-hidden="true">
        <Image
          src="/lalara-logo.png"
          alt=""
          width={1200}
          height={440}
          className="background-brand-image"
        />
      </div>

      {/* HEADER */}
      <Header locale="tr" />

      {/* 01 — HERO */}
      <section className="hero opaque-section">
        <Image
          src={photos.hero}
          alt="Yalıkavak Bodrum'da La Lara Restaurant & Bar"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div className="hero-content">
          

          <h1 style={cmsStyle("hero", "heading")}>
            {cms.hero?.heading ? (
              renderLines(cms.hero.heading)
            ) : (
              <>
                Yalıkavak Körfezi&apos;ne Karşı
                <br />
                Akdeniz Mutfağı.
              </>
            )}
          </h1>

          <p
            className="hero-description"
            style={cmsStyle("hero", "text")}
          >
            {cms.hero?.body ? (
              renderLines(cms.hero.body)
            ) : (
              <>
                Aile hikâyesinden ilham alan La Lara; Akdeniz
                lezzetlerini,
                <br />
                güzel manzaraları ve sıcak misafirperverliği bir araya
                getiriyor.
              </>
            )}
          </p>

          <div className="hero-actions">
            <a href="#menus" className="outline-button">
              MENÜYÜ GÖR
            </a>

            <a
              href="#reserve"
              className="outline-button tr-uppercase"
            >
              REZERVASYON YAP
            </a>
          </div>
        </div>

        <a className="scroll-cue" href="#menus">
          Menülerimizi Keşfet <i />
        </a>
      </section>

      {/* 02 — MENUS */}
      <section
        id="menus"
        className="menus transparent-section"
      >
        <div className="section-title">
          <div>
            <p className="eyebrow">Menüler</p>
            
          </div>

          <h2>
            Menülerimizi
            <br />
            Keşfedin
          </h2>
        </div>

        <div className="menu-grid">
          <article>
            <div className="menu-image">
              <Image
                src={photos.food}
                alt="La Lara Yalıkavak Akdeniz yemekleri"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                className="cover"
              />
            </div>

            <p className="kicker">Akdeniz</p>

            <h3>Yemek</h3>

           <a
  className="line-link"
  href="/food-menu"
>
  MENÜYÜ GÖR <span>→</span>
</a>
          </article>

          <article>
            <div className="menu-image">
              <Image
                src={photos.drinks}
                alt="La Lara Restaurant & Bar kokteyl ve içecekleri"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                className="cover"
              />
            </div>

            <p className="kicker">Bar</p>

            <h3>İçecek</h3>

            <a
  className="line-link"
  href="/drinks-menu"
>
  MENÜYÜ GÖR <span>→</span>
</a>
          </article>

          <article>
            <div className="menu-image">
              <Image
                src={photos.breakfast}
                alt="La Lara Yalıkavak deniz manzaralı kahvaltı"
                fill
                sizes="(max-width: 900px) 100vw, 33vw"
                className="cover"
              />
            </div>

            <p className="kicker">Sabah</p>

            <h3>Kahvaltı</h3>

          <a
  className="line-link"
  href="/breakfast-menu"
>
  MENÜYÜ GÖR <span>→</span>
</a>
          </article>
        </div>
      </section>

      {/* 03 — STORY */}
      <section
        id="story"
        className="story transparent-section"
      >
        <div className="section-title">
          <div>
            <p className="eyebrow">Hikâyemiz</p>
            <span>La Lara&apos;nın Hikâyesi</span>
          </div>

          <h2>
            Bir Aile Hikâyesi,
            <br />
            Paylaşılan Bir Sofra.
          </h2>
        </div>

        <div className="story-grid">
          <div className="story-image">
            <Image
              src={photos.story}
              alt="La Lara Restaurant'ın aile hikâyesi"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
              className="cover"
            />
          </div>

          <div className="story-copy">
            <h3>
              İsmin Ardındaki
              <br />
              Kadın.
            </h3>

            <p>
              La Lara bir restoran olmadan çok önce, herkesin kendini
              evinde hissettiği bir sofra vardı.
            </p>

            <p>
              Bu sofra büyükannemiz Lara&apos;ya aitti. Sıcak,
              karakterli ve biraz da diva ruhuna sahip bir kadındı.
              Yemeğe, ailesine ve insanları bir araya getirmeye duyduğu
              sevgi, La Lara&apos;da yaratmak istediğimiz her şeyin
              ilhamı oldu.
            </p>

            <p>
              Bazı hikâyeler anlatılmadan bırakılamayacak kadar
              özeldir.
            </p>

            <a href="/tr/hikayemiz" className="line-link">
              HİKÂYEMİZİ KEŞFEDİN <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 04 — EXPERIENCE / GALLERY */}
      <section
        id="moments"
        className="experience opaque-section"
      >
        <Image
          src={galleryPhotos[0]}
          alt="Yalıkavak Körfezi manzaralı La Lara Restaurant"
          fill
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div>
          <p className="eyebrow light">
            La Lara Deneyimi
          </p>

          <h2>
            Lezzet, manzara
            <br />
            ve birlikte geçirilen akşamlar.
          </h2>

          <p>
            Akdeniz mutfağı, kokteyller ve Yalıkavak Körfezi&apos;nin
            atmosferi.
          </p>

          <a
            href="/tr/galeri"
            className="line-link light-link"
          >
            GALERİYİ GÖR <span>→</span>
          </a>
        </div>
      </section>

      {/* SMALL GALLERY */}
    <section className="menus transparent-section">
  <div className="menu-grid">
    {galleryPhotos
      .slice(1, 4)
      .map((photo, index) => (
        <article key={`${photo}-${index}`}>
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
            alt="La Lara Yalıkavak özel davet ve organizasyonlar"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className="cover"
          />
        </div>

        <div className="split-copy">
          <p className="eyebrow">Özel Davetler</p>

          <h2>
            Özel Yemekler
            <br />
            &amp; Etkinlikler
          </h2>

          <p>
            Yalıkavak Körfezi&apos;ne karşı düğünler, doğum günleri,
            özel yemekler ve davetler.
          </p>

          <p>
            Nasıl bir etkinlik planladığınızı bize anlatın; ekibimiz
            davetinizi size ve misafirlerinize göre şekillendirsin.
          </p>

          <a
            href="/tr/ozel-etkinlikler"
            className="line-link"
          >
            ETKİNLİĞİNİZİ PLANLAYIN <span>→</span>
          </a>
        </div>
      </section>

      {/* 05 — RESERVATION */}
      <section
        id="reserve"
        className="reservation opaque-section"
      >
        <p
          className="eyebrow light"
          style={cmsStyle("reservation", "eyebrow")}
        >
          {cms.reservation?.eyebrow || "Yalıkavak · Bodrum"}
        </p>

        <h2 style={cmsStyle("reservation", "heading")}>
          {cms.reservation?.heading ? (
            renderLines(cms.reservation.heading)
          ) : (
            <>
              Masanızı
              <br />
              Ayırtın
            </>
          )}
        </h2>

        <p style={cmsStyle("reservation", "text")}>
          WhatsApp, telefon veya e-posta üzerinden rezervasyon
          talebinizi iletin.
          <br />
          Ekibimiz uygunluğu sizinle teyit edecektir.
        </p>

        <div className="reservation-actions reservation-actions-stacked">
          <a
            className="outline-button tr-uppercase"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WHATSAPP İLE TALEP GÖNDER
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

      {/* FOOTER */}
      <Footer locale="tr" />

      {/* BACK TO TOP */}
      <button
        type="button"
        className={`back-to-top ${
          showBackToTop ? "is-visible" : ""
        }`}
        onClick={scrollToTop}
        aria-label="Yukarı dön"
      >
        ↑
      </button>
    </main>
  );
}