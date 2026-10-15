"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Locale = "en" | "tr";

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
  return value.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default function Footer({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [contactSnapshot, socialSnapshot] =
          await Promise.all([
            getDoc(doc(db, "siteSettings", "contact")),
            getDoc(doc(db, "siteSettings", "social")),
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
      } catch (error) {
        console.error("Footer settings load error:", error);
      }
    }

    loadSettings();
  }, []);

  const isTR = locale === "tr";

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref = `mailto:${settings.email}`;

  const mapsHref =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(settings.address.replace(/\n/g, ", "));

  const homeHref = isTR ? "/tr" : "/";
  const menuHref = isTR ? "/tr#menus" : "/#menus";
  const storyHref = isTR ? "/tr/hikayemiz" : "/our-story";
  const galleryHref = isTR ? "/tr/galeri" : "/gallery";
  const eventsHref = isTR
    ? "/tr/ozel-etkinlikler"
    : "/private-events";
  const reservationHref = isTR ? "/tr#reserve" : "/#reserve";
  const contactHref = isTR ? "/tr/iletisim" : "/contact";

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer
      id="contact"
      className="site-footer opaque-section"
    >
      <div className="footer-grid">
        {/* BRAND */}

        <div className="footer-brand">
          <Link href={homeHref}>
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={260}
              height={96}
            />
          </Link>

          <p>Restaurant &amp; Bar · Yalıkavak</p>
        </div>

        {/* VISIT */}

        <div>
          <span>{isTR ? "Adres" : "Visit"}</span>

          <p>{renderLines(settings.address)}</p>

          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {isTR ? "YOL TARİFİ AL ↗" : "GET DIRECTIONS ↗"}
          </a>

          <a href={telHref}>{settings.phone}</a>

          <a href={emailHref}>{settings.email}</a>
        </div>

        {/* EXPLORE */}

        <div>
          <span>{isTR ? "Keşfet" : "Explore"}</span>

          <Link href={menuHref}>
            {isTR ? "Menüler" : "Menus"}
          </Link>

          <Link href={storyHref}>
            {isTR ? "Hikâyemiz" : "Our Story"}
          </Link>

          <Link href={galleryHref}>
            {isTR ? "Galeri" : "Gallery"}
          </Link>

          <Link href={eventsHref}>
            {isTR ? "Özel Davetler" : "Private Events"}
          </Link>

          <Link href={reservationHref}>
            {isTR ? "Rezervasyon" : "Reservations"}
          </Link>

          <Link href={contactHref}>
            {isTR ? "İletişim" : "Contact"}
          </Link>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
          >
            {isTR ? "YUKARI DÖN ↑" : "BACK TO TOP ↑"}
          </button>
        </div>

        {/* SOCIAL */}

        <div className="footer-social">
          <span>{isTR ? "Takip Et" : "Follow"}</span>

          {/* INSTAGRAM */}

          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="La Lara Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
              />

              <circle cx="12" cy="12" r="4" />

              <circle
                className="social-fill"
                cx="17.5"
                cy="6.5"
                r="1"
              />
            </svg>

            <span className="social-name">Instagram</span>
          </a>

          {/* FACEBOOK */}

          <a
            href={settings.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="La Lara Facebook"
          >
            <svg
              className="facebook-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M14 8h3V4.5c-.6-.1-1.8-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4V12H5v4h3.6v8H13v-8h3.5l.6-4H13V10c0-1.2.3-2 1-2Z" />
            </svg>

            <span className="social-name">Facebook</span>
          </a>

          {/* TRIPADVISOR */}

          <a
            href={settings.tripadvisor}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="La Lara Tripadvisor"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="7" cy="13" r="4" />
              <circle cx="17" cy="13" r="4" />

              <circle
                className="social-fill"
                cx="7"
                cy="13"
                r="1.3"
              />

              <circle
                className="social-fill"
                cx="17"
                cy="13"
                r="1.3"
              />

              <path d="M10.5 13 12 15l1.5-2" />

              <path d="M3.5 8.5C6 7 8.8 6.5 12 6.5s6 .5 8.5 2" />
            </svg>

            <span className="social-name">Tripadvisor</span>
          </a>
        </div>
      </div>

      {/* FOOTER BOTTOM */}

      <div className="footer-bottom">
        <span>© 2026 La Lara Restaurant &amp; Bar</span>

        <span>Yalıkavak · Bodrum</span>

        <div>
          <Link href="/">EN</Link>
          <span> / </span>
          <Link href="/tr">TR</Link>
        </div>
      </div>
    </footer>
  );
}