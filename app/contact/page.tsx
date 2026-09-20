"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

export default function ContactPage() {
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

  const [cms, setCms] = useState<Record<string, CmsRecord>>({});
  const [contactHero, setContactHero] = useState("/images/home/6.jpg");

  useEffect(() => {
    async function loadCms() {
      try {
        const snapshot = await getDocs(collection(db, "siteContent"));
        const next: Record<string, CmsRecord> = {};

        snapshot.forEach((item) => {
          const data = item.data() as CmsRecord;
          if (item.id.startsWith("en-contact-") && data.status === "published") {
            next[item.id.replace("en-", "")] = data;
          }
        });

        setCms(next);
        const mediaSnapshot = await getDoc(doc(db, "siteSettings", "media"));
        setContactHero(mediaSnapshot.data()?.images?.contactHero?.url || "/images/home/6.jpg");
      } catch (error) {
        console.error("Contact CMS load error:", error);
      }
    }

    loadCms();
  }, []);

  function lines(value: string) {
    return value.split("\n").map((line, index, all) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < all.length - 1 && <br />}
      </span>
    ));
  }

  function styleFor(key: string, kind: "eyebrow" | "heading" | "text" | "button") {
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
      ...(size ? { fontSize: `${size}px` } : {}),
      ...(item.fontFamily
        ? {
            fontFamily:
              item.fontFamily === "sans"
                ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
                : '"Iowan Old Style", Baskerville, "Times New Roman", serif',
          }
        : {}),
      ...(item.fontWeight ? { fontWeight: item.fontWeight } : {}),
      ...(item.lineHeight ? { lineHeight: item.lineHeight } : {}),
      ...(item.letterSpacing !== undefined
        ? { letterSpacing: `${item.letterSpacing}px` }
        : {}),
    };
  }

  return (
    <main className="contact-page">
      {/* HEADER */}
      <header className="contact-header">
        <a href="/" className="brand" aria-label="La Lara home">
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={190}
            height={70}
            priority
          />
        </a>

        <nav className="contact-nav" aria-label="Main navigation">
          <a href="/#story">Our Story</a>
          <a href="/#menus">Menus</a>
          <a href="/#experience">Experience</a>
          <a href="/#moments">Gallery</a>
          <a href="/contact" className="active">
            Contact
          </a>
        </nav>

        <div className="contact-header-right">
          <div className="contact-language">
            <a href="/contact" className="active">
              EN
            </a>
            <span>/</span>
            <a href="/tr/iletisim">TR</a>
          </div>

          <a  className="contact-header-button"href="https://wa.me/905458941838" target="_blank" rel="noopener noreferrer">
            Book a Table
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="contact-hero">
        <Image
          src={contactHero}
          alt="La Lara Restaurant & Bar Yalıkavak Bodrum"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
         

          <h1 style={styleFor("contact-hero", "heading")}>
            {cms["contact-hero"]?.heading ? lines(cms["contact-hero"].heading!) : <>Come find<br />your table.</>}
          </h1>

          <p style={styleFor("contact-hero", "text")}>
            {cms["contact-hero"]?.body ? lines(cms["contact-hero"].body!) : <>Good food, long conversations<br />and Yalıkavak evenings.</>}
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-main">
        <div className="contact-heading">
          <div>
            <p className="eyebrow" style={styleFor("contact-heading", "eyebrow")}>{cms["contact-heading"]?.eyebrow || "Contact"}</p>
            <span style={styleFor("contact-heading", "text")}>{cms["contact-heading"]?.body || "Yalıkavak · Bodrum"}</span>
          </div>

          <h2 style={styleFor("contact-heading", "heading")}>
            {cms["contact-heading"]?.heading ? lines(cms["contact-heading"].heading!) : <>We&apos;d love<br />to see you.</>}
          </h2>
        </div>

        <div className="contact-columns">
          <div className="contact-column">
            <span className="contact-label" style={styleFor("contact-visit", "eyebrow")}>{cms["contact-visit"]?.eyebrow || "Visit"}</span>

            <h3 style={styleFor("contact-visit", "heading")}>{cms["contact-visit"]?.heading || "La Lara"}</h3>

            <p>
              Geriş Mah., 2026. Sokak No:5
              <br />
              Yalıkavak, 48990 Bodrum
              <br />
              Muğla · Türkiye
            </p>

            <a
              className="contact-text-link"
              href="https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions ↗
            </a>
          </div>

          <div className="contact-column">
            <span className="contact-label" style={styleFor("contact-reservations", "eyebrow")}>{cms["contact-reservations"]?.eyebrow || "Reservations"}</span>

            <h3 style={styleFor("contact-reservations", "heading")}>{cms["contact-reservations"]?.heading || "Book a table"}</h3>

            <p style={styleFor("contact-reservations", "text")}>
              {cms["contact-reservations"]?.body ? lines(cms["contact-reservations"].body!) : <>For reservations and enquiries,<br />call or email our team.</>}
            </p>

            <a
              className="contact-primary-link"
              href="tel:+905458941838"
            >
              +90 545 894 18 38
            </a>

            <a
              className="contact-text-link"
              href="mailto:reservation.bodrum@lalara.com.tr"
            >
              reservation.bodrum@lalara.com.tr
            </a>
          </div>

          <div className="contact-column">
            <span className="contact-label" style={styleFor("contact-follow", "eyebrow")}>{cms["contact-follow"]?.eyebrow || "Follow"}</span>

            <h3 style={styleFor("contact-follow", "heading")}>{cms["contact-follow"]?.heading || "Stay connected"}</h3>

            <p style={styleFor("contact-follow", "text")}>
              {cms["contact-follow"]?.body ? lines(cms["contact-follow"].body!) : <>Follow La Lara for food,<br />sunsets and moments from Yalıkavak.</>}
            </p>

                      <div className="footer-social contact-follow-social">
            <a
              href="https://www.instagram.com/lalara.bodrum/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-fill" cx="17.5" cy="6.5" r="1" />
              </svg>
              <span className="social-name">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/lalararestaurant"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Facebook"
            >
              <svg className="facebook-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4.5c-.6-.1-1.8-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4V12H5v4h3.6v8H13v-8h3.5l.6-4H13V10c0-1.2.3-2 1-2Z" />
              </svg>
              <span className="social-name">Facebook</span>
            </a>

            <a
              href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Tripadvisor"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="7" cy="13" r="4" />
                <circle cx="17" cy="13" r="4" />
                <circle className="social-fill" cx="7" cy="13" r="1.3" />
                <circle className="social-fill" cx="17" cy="13" r="1.3" />
                <path d="M10.5 13 12 15l1.5-2" />
                <path d="M3.5 8.5C6 7 8.8 6.5 12 6.5s6 .5 8.5 2" />
              </svg>
              <span className="social-name">Tripadvisor</span>
            </a>
          </div>
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section className="contact-reservation">
        <Image
          src="/images/home/1.jpg"
          alt="Dining at La Lara Restaurant Yalıkavak"
          fill
          sizes="100vw"
          className="cover"
        />

        <div className="contact-reservation-overlay" />

        <div className="contact-reservation-content">
          <p className="eyebrow light" style={styleFor("contact-reservation", "eyebrow")}>{cms["contact-reservation"]?.eyebrow || "Reservations"}</p>

          <h2 style={styleFor("contact-reservation", "heading")}>
            {cms["contact-reservation"]?.heading ? lines(cms["contact-reservation"].heading!) : <>Your table<br />awaits.</>}
          </h2>

          <p style={styleFor("contact-reservation", "text")}>
            {cms["contact-reservation"]?.body ? lines(cms["contact-reservation"].body!) : <>Come for the view. Stay for the food,<br />the people and the night.</>}
          </p>

          <div className="contact-actions">
            <a
              
              className="outline-button"
            href="https://wa.me/905458941838" target="_blank" rel="noopener noreferrer">
              Call to reserve
            </a>

            <a
              href="mailto:reservation.bodrum@lalara.com.tr"
              className="line-link light-link"
            >
              Email us
            </a>
          </div>
        </div>
      </section>
      {/* MAP */}
<section className="contact-map">
  <div className="contact-map-heading">
    <p className="eyebrow" style={styleFor("contact-map", "eyebrow")}>{cms["contact-map"]?.eyebrow || "Find Us"}</p>

    <h2 style={styleFor("contact-map", "heading")}>
      {cms["contact-map"]?.heading ? lines(cms["contact-map"].heading!) : <>In the heart of<br />Yalıkavak.</>}
    </h2>

    <a
      href="https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum"
      target="_blank"
      rel="noopener noreferrer"
      className="line-link"
    >
      Open in Google Maps ↗
    </a>
  </div>

  <div className="contact-map-frame">
    <iframe
      src="https://www.google.com/maps?q=La+Lara+Restaurant+Yalikavak+Bodrum&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="La Lara Restaurant & Bar location in Yalıkavak Bodrum"
    />
  </div>
</section>

      <footer id="contact" className="site-footer opaque-section">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={260}
              height={96}
            />
            <p>Restaurant &amp; Bar · Yalıkavak</p>
          </div>

          <div>
            <span>Visit</span>
            <p>
              Geriş Mah., 2026. Sokak No:5
              <br />
              Yalıkavak, 48990 Bodrum
              <br />
              Muğla · Türkiye
            </p>
            <a href="tel:+905458941838">+90 545 894 18 38</a>
            <a href="mailto:reservation.bodrum@lalara.com.tr">
              reservation.bodrum@lalara.com.tr
            </a>
          </div>

          <div>
            <span>Explore</span>
            <a href="#story">Our Story</a>
            <a href="#menus">Menus</a>
            <a href="#experience">Experience</a>
            <a href="#moments">Gallery</a>
          </div>

          <div className="footer-social">
            <span>Follow</span>
            <a
              href="https://www.instagram.com/lalara.bodrum/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-fill" cx="17.5" cy="6.5" r="1" />
              </svg>
              <span className="social-name">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/lalararestaurant"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Facebook"
            >
              <svg className="facebook-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4.5c-.6-.1-1.8-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4V12H5v4h3.6v8H13v-8h3.5l.6-4H13V10c0-1.2.3-2 1-2Z" />
              </svg>
              <span className="social-name">Facebook</span>
            </a>

            <a
              href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara on Tripadvisor"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="7" cy="13" r="4" />
                <circle cx="17" cy="13" r="4" />
                <circle className="social-fill" cx="7" cy="13" r="1.3" />
                <circle className="social-fill" cx="17" cy="13" r="1.3" />
                <path d="M10.5 13 12 15l1.5-2" />
                <path d="M3.5 8.5C6 7 8.8 6.5 12 6.5s6 .5 8.5 2" />
              </svg>
              <span className="social-name">Tripadvisor</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 La Lara Restaurant &amp; Bar</span>
          <span>Yalıkavak · Bodrum</span>
          <div>
            <a href="/">EN</a>
            <span> / </span>
            <a href="/tr">TR</a>
          </div>
        </div>
      </footer>
    </main>
  );
}