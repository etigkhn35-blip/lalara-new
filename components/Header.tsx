"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Locale = "en" | "tr";

type HeaderProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonLink?: string;

  visible?: boolean;
  status?: string;
};

type NavigationItem = {
  key: string;
  fallback: string;
  href: string;
};

export default function Header({
  locale,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const pathname = usePathname();

  const isTR = locale === "tr";

  /* =========================================================
     LOAD NAVIGATION CMS
     ========================================================= */

  useEffect(() => {
    const prefix =
      locale === "tr"
        ? "tr-"
        : "en-";

    return onSnapshot(
      collection(db, "siteContent"),
      (snapshot) => {
        const nextCms: Record<string, CmsRecord> = {};

        snapshot.forEach((item) => {
          const data = item.data() as CmsRecord;

          if (
            item.id.startsWith(prefix) &&
            (!data.status || data.status === "published")
          ) {
            nextCms[item.id.replace(prefix, "")] = data;
          }
        });

        setCms(nextCms);
      },
      (error) => {
        console.error(
          "La Lara navigation CMS live load error:",
          error
        );
        setCms({});
      }
    );
  }, [locale]);

  /* =========================================================
     SCROLL
     ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 40
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =========================================================
     CLOSE MENU ON ROUTE CHANGE
     ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* =========================================================
     LOCK BODY
     ========================================================= */

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);

  /* =========================================================
     ROUTES
     ========================================================= */

const homeHref = isTR ? "/tr" : "/";

const logoHref = isTR
  ? "/tr?intro=1"
  : "/?intro=1";

const menuHref = "/food-menu";

const storyHref = isTR
  ? "/tr/hikayemiz"
  : "/our-story";

const eventsHref = isTR
  ? "/tr/ozel-etkinlikler"
  : "/private-events";

const offersHref = isTR
  ? "/tr/teklifler"
  : "/offers";

const contactHref = isTR
  ? "/tr/iletisim"
  : "/contact";

const reserveHref = "/#reserve";

  /* =========================================================
     CMS HELPERS
     ========================================================= */

  function cmsLabel(
    key: string,
    fallback: string
  ) {
    return (
      cms[key]?.heading ||
      cms[key]?.buttonLabel ||
      fallback
    );
  }

  function cmsHref(
    key: string,
    fallback: string
  ) {
    return (
      cms[key]?.buttonLink ||
      fallback
    );
  }

  function cmsVisible(key: string) {
    return (
      cms[key]?.visible !== false
    );
  }

  /* =========================================================
     NAVIGATION ITEMS
     ========================================================= */

const navigation: NavigationItem[] = [
  {
    key: "nav-home",
    fallback: isTR ? "ANA SAYFA" : "HOME",
    href: homeHref,
  },
  {
    key: "nav-menu",
    fallback: isTR ? "MENÜ" : "MENU",
    href: menuHref,
  },
  {
    key: "nav-our-story",
    fallback: isTR ? "HİKÂYEMİZ" : "OUR STORY",
    href: storyHref,
  },
  {
    key: "nav-private-events",
    fallback: isTR ? "ETKİNLİKLER" : "EVENTS",
    href: eventsHref,
  },
  {
    key: "nav-offers",
    fallback: isTR ? "TEKLİFLER" : "OFFERS",
    href: offersHref,
  },
  {
    key: "nav-contact",
    fallback: isTR ? "İLETİŞİM" : "CONTACT",
    href: contactHref,
  },
];

  const reservationKey =
    "nav-book-a-table";

  const reservationLabel =
    cmsLabel(
      reservationKey,
      isTR
        ? "REZERVASYON YAP"
        : "BOOK A TABLE"
    );

  const reservationLink =
    cmsHref(
      reservationKey,
      reserveHref
    );

  /* =========================================================
     ACTIONS
     ========================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          HEADER
          ===================================================== */}

      <header
        className={`site-header ${
          scrolled
            ? "is-scrolled"
            : ""
        }`}
      >
        {/* LOGO */}

        <a
  href={logoHref}
  className="brand"
          aria-label={
            isTR
              ? "La Lara ana sayfa"
              : "La Lara home"
          }
        >
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={210}
            height={78}
            priority
          />
        </a>

        {/* ===================================================
            DESKTOP NAVIGATION
            =================================================== */}

        <nav
          className="desktop-nav"
          aria-label={
            isTR
              ? "Ana menü"
              : "Main navigation"
          }
        >
          {navigation.map((item) => {
            if (
              !cmsVisible(item.key)
            ) {
              return null;
            }

            return (
              <a
                key={item.key}
                href={item.key === "nav-home"
                  ? homeHref
                  : item.key === "nav-menu"
                    ? menuHref
                    : cmsHref(item.key, item.href)}
              >
                {cmsLabel(
                  item.key,
                  item.fallback
                )}
              </a>
            );
          })}
        </nav>

        {/* ===================================================
            HEADER RIGHT
            =================================================== */}

        <div className="header-right">

          {/* RESERVATION */}

          {cmsVisible(
            reservationKey
          ) && (
            <a
              className="header-reserve"
              href={
                reservationLink
              }
            >
              {reservationLabel}
            </a>
          )}

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className={`mobile-menu-toggle ${
              menuOpen
                ? "is-open"
                : ""
            }`}
            aria-label={
              menuOpen
                ? isTR
                  ? "Menüyü kapat"
                  : "Close menu"
                : isTR
                  ? "Menüyü aç"
                  : "Open menu"
            }
            aria-expanded={
              menuOpen
            }
            aria-controls="mobile-navigation"
            onClick={() =>
              setMenuOpen(
                (open) => !open
              )
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE MENU
          ===================================================== */}

      <div
        id="mobile-navigation"
        className={`mobile-menu-panel ${
          menuOpen
            ? "is-open"
            : ""
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="mobile-menu-nav"
          aria-label={
            isTR
              ? "Mobil navigasyon"
              : "Mobile navigation"
          }
        >
          {navigation.map((item) => {
            if (
              !cmsVisible(item.key)
            ) {
              return null;
            }

            return (
              <a
                key={item.key}
                href={item.key === "nav-home"
                  ? homeHref
                  : item.key === "nav-menu"
                    ? menuHref
                    : cmsHref(item.key, item.href)}
                onClick={closeMenu}
              >
                {cmsLabel(
                  item.key,
                  item.fallback
                )}
              </a>
            );
          })}
        </nav>

        {/* MOBILE BOTTOM */}

        <div className="mobile-menu-bottom">

          {/* MOBILE RESERVATION */}

          {cmsVisible(
            reservationKey
          ) && (
            <a
              href={
                reservationLink
              }
              className="mobile-menu-reserve"
              onClick={closeMenu}
            >
              {reservationLabel}
            </a>
          )}
        </div>
      </div>
    </>
  );
}