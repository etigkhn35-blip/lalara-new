"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
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

export default function Footer({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const [settings, setSettings] =
    useState<SiteSettings>(defaultSettings);

  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const [showBackToTop, setShowBackToTop] =
    useState(false);

  const isTR = locale === "tr";

  /* =========================================================
     FIREBASE
     ========================================================= */

  useEffect(() => {
    async function loadFooter() {
      try {
        const [
          contactSnapshot,
          socialSnapshot,
          contentSnapshot,
        ] = await Promise.all([
          getDoc(
            doc(db, "siteSettings", "contact")
          ),
          getDoc(
            doc(db, "siteSettings", "social")
          ),
          getDocs(
            collection(db, "siteContent")
          ),
        ]);

        /* SETTINGS */

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

        /* CMS */

        const prefix = isTR ? "tr-" : "en-";

        const next: Record<
          string,
          CmsRecord
        > = {};

        contentSnapshot.forEach((item) => {
          const data =
            item.data() as CmsRecord;

          if (
            item.id.startsWith(prefix) &&
            data.status === "published"
          ) {
            next[
              item.id.replace(prefix, "")
            ] = data;
          }
        });

        setCms(next);
      } catch (error) {
        console.error(
          "Footer CMS load error:",
          error
        );
      }
    }

    loadFooter();
  }, [isTR]);

  /* =========================================================
     BACK TO TOP
     ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(
        window.scrollY > 500
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
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

  function styleFor(
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

      ...(item.letterSpacing !==
      undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  /* =========================================================
     ADMIN FOOTER KEYS

     Footer Brand
     → footer-brand

     Footer Address
     → footer-address

     Footer Navigation
     → footer-navigation

     Footer Social
     → footer-social

     Footer Bottom
     → footer-bottom
     ========================================================= */

  const brand = content(
    "footer-brand"
  );

  const address = content(
    "footer-address"
  );

  const navigation = content(
    "footer-navigation"
  );

  const social = content(
    "footer-social"
  );

  const bottom = content(
    "footer-bottom"
  );

  /* =========================================================
     LINKS
     ========================================================= */

  const telHref = `tel:${settings.phone.replace(
    /[^+\d]/g,
    ""
  )}`;

  const emailHref =
    `mailto:${settings.email}`;

  const mapsHref =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      settings.address.replace(
        /\n/g,
        ", "
      )
    );

  const homeHref = isTR
    ? "/tr"
    : "/";

  const menuHref = isTR
    ? "/tr#menus"
    : "/#menus";

  const storyHref = isTR
    ? "/tr/hikayemiz"
    : "/our-story";

  const galleryHref = isTR
    ? "/tr/galeri"
    : "/gallery";

  const eventsHref = isTR
    ? "/tr/ozel-etkinlikler"
    : "/private-events";

  const reservationHref = isTR
    ? "/tr#reserve"
    : "/#reserve";

  const contactHref = isTR
    ? "/tr/iletisim"
    : "/contact";

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

        {/* ===================================================
            BRAND
            =================================================== */}

        {isVisible("footer-brand") && (
          <div className="footer-brand">
            <Link href={homeHref}>
              <Image
                src="/lalara-logo.png"
                alt="La Lara Restaurant & Bar"
                width={320}
                height={118}
              />
            </Link>

            <p
              style={styleFor(
                "footer-brand",
                "text"
              )}
            >
              {brand?.body ||
                (isTR
                  ? "Restaurant & Bar · Yalıkavak"
                  : "Restaurant & Bar · Yalıkavak")}
            </p>
          </div>
        )}

        {/* ===================================================
            ADDRESS
            =================================================== */}

        {isVisible(
          "footer-address"
        ) && (
          <div>
            <span
              style={styleFor(
                "footer-address",
                "eyebrow"
              )}
            >
              {address?.eyebrow ||
                (isTR
                  ? "Adres"
                  : "Visit")}
            </span>

            <p
              style={styleFor(
                "footer-address",
                "text"
              )}
            >
              {address?.body
                ? renderLines(
                    address.body
                  )
                : renderLines(
                    settings.address
                  )}
            </p>

            <a
              href={
                address?.buttonLink ||
                mapsHref
              }
              target="_blank"
              rel="noopener noreferrer"
              style={styleFor(
                "footer-address",
                "button"
              )}
            >
              {address?.buttonLabel ||
                (isTR
                  ? "YOL TARİFİ AL ↗"
                  : "GET DIRECTIONS ↗")}
            </a>

            <a href={telHref}>
              {settings.phone}
            </a>

            <a href={emailHref}>
              {settings.email}
            </a>
          </div>
        )}

        {/* ===================================================
            NAVIGATION
            =================================================== */}

        {isVisible(
          "footer-navigation"
        ) && (
          <div>
            <span
              style={styleFor(
                "footer-navigation",
                "eyebrow"
              )}
            >
              {navigation?.eyebrow ||
                (isTR
                  ? "Keşfet"
                  : "Explore")}
            </span>

            <Link href={menuHref}>
              {isTR
                ? "Menüler"
                : "Menus"}
            </Link>

            <Link href={storyHref}>
              {isTR
                ? "Hikâyemiz"
                : "Our Story"}
            </Link>

            <Link href={galleryHref}>
              {isTR
                ? "Galeri"
                : "Gallery"}
            </Link>

            <Link href={eventsHref}>
              {isTR
                ? "Özel Davetler"
                : "Private Events"}
            </Link>

            <Link
              href={reservationHref}
            >
              {isTR
                ? "Rezervasyon"
                : "Reservations"}
            </Link>

            <Link href={contactHref}>
              {isTR
                ? "İletişim"
                : "Contact"}
            </Link>
          </div>
        )}

        {/* ===================================================
            SOCIAL
            =================================================== */}

        {isVisible(
          "footer-social"
        ) && (
          <div className="footer-social">
            <span
              style={styleFor(
                "footer-social",
                "eyebrow"
              )}
            >
              {social?.eyebrow ||
                (isTR
                  ? "Takip Et"
                  : "Follow")}
            </span>

            {/* INSTAGRAM */}

            {settings.instagram && (
              <a
                href={
                  settings.instagram
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="La Lara Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <circle
                    className="social-fill"
                    cx="17.5"
                    cy="6.5"
                    r="1"
                  />
                </svg>

                <span className="social-name">
                  Instagram
                </span>
              </a>
            )}

            {/* FACEBOOK */}

            {settings.facebook && (
              <a
                href={
                  settings.facebook
                }
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

                <span className="social-name">
                  Facebook
                </span>
              </a>
            )}

            {/* TRIPADVISOR */}

            {settings.tripadvisor && (
              <a
                href={
                  settings.tripadvisor
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="La Lara Tripadvisor"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="7"
                    cy="13"
                    r="4"
                  />

                  <circle
                    cx="17"
                    cy="13"
                    r="4"
                  />

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

                <span className="social-name">
                  Tripadvisor
                </span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER BOTTOM
          ===================================================== */}

      {isVisible(
        "footer-bottom"
      ) && (
        <div className="footer-bottom">
          <span
            style={styleFor(
              "footer-bottom",
              "text"
            )}
          >
            {bottom?.body ||
              "© 2026 La Lara Restaurant & Bar"}
          </span>

          <span>
            {bottom?.heading ||
              "Yalıkavak · Bodrum"}
          </span>

          <div>
            <Link href="/">
              EN
            </Link>

            <span> / </span>

            <Link href="/tr">
              TR
            </Link>
          </div>
        </div>
      )}

      {/* =====================================================
          BACK TO TOP
          ===================================================== */}

      <button
        type="button"
        className={`back-to-top ${
          showBackToTop
            ? "is-visible"
            : ""
        }`}
        onClick={scrollToTop}
        aria-label={
          isTR
            ? "Yukarı dön"
            : "Back to top"
        }
      >
        ↑
      </button>
    </footer>
  );
}