"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Locale = "en" | "tr";

type HeaderProps = {
  locale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

export default function Header({
  locale,
  onLocaleChange,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isTR = locale === "tr";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const homeHref = isTR ? "/tr" : "/";

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

  const contactHref = isTR
    ? "/tr/iletisim"
    : "/contact";

  const reserveHref = isTR
    ? "/tr#reserve"
    : "/#reserve";

  /*
   * Bulunduğumuz sayfanın diğer dildeki karşılığı.
   */
  const languageRoutes: Record<
    string,
    { en: string; tr: string }
  > = {
    "/": {
      en: "/",
      tr: "/tr",
    },

    "/tr": {
      en: "/",
      tr: "/tr",
    },

    "/our-story": {
      en: "/our-story",
      tr: "/tr/hikayemiz",
    },

    "/tr/hikayemiz": {
      en: "/our-story",
      tr: "/tr/hikayemiz",
    },

    "/gallery": {
      en: "/gallery",
      tr: "/tr/galeri",
    },

    "/tr/galeri": {
      en: "/gallery",
      tr: "/tr/galeri",
    },

    "/private-events": {
      en: "/private-events",
      tr: "/tr/ozel-etkinlikler",
    },

    "/tr/ozel-etkinlikler": {
      en: "/private-events",
      tr: "/tr/ozel-etkinlikler",
    },

    "/contact": {
      en: "/contact",
      tr: "/tr/iletisim",
    },

    "/tr/iletisim": {
      en: "/contact",
      tr: "/tr/iletisim",
    },
  };

  const currentLanguageRoutes =
    languageRoutes[pathname] || {
      en: "/",
      tr: "/tr",
    };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLocaleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextLocale: Locale
  ) => {
    /*
     * Menü sayfası gibi kendi dil state'ini yöneten
     * sayfalarda route değiştirmeden içeriği çevir.
     */
    if (onLocaleChange) {
      event.preventDefault();

      onLocaleChange(nextLocale);

      setMenuOpen(false);

      return;
    }

    /*
     * Normal sayfalarda link kendi karşı dil
     * sayfasına gider.
     */
    setMenuOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`site-header ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        {/* LOGO */}
        <a
          href={homeHref}
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

        {/* DESKTOP NAVIGATION */}
        <nav
          className="desktop-nav"
          aria-label={
            isTR
              ? "Ana menü"
              : "Main navigation"
          }
        >
          <a href={menuHref}>
            {isTR ? "MENÜ" : "MENU"}
          </a>

          <a href={storyHref}>
            {isTR ? "HİKÂYEMİZ" : "OUR STORY"}
          </a>

          <a href={galleryHref}>
            {isTR ? "GALERİ" : "GALLERY"}
          </a>

          <a href={eventsHref}>
            {isTR
              ? "ÖZEL DAVETLER"
              : "PRIVATE EVENTS"}
          </a>

          <a href={contactHref}>
            {isTR ? "İLETİŞİM" : "CONTACT"}
          </a>
        </nav>

        {/* HEADER RIGHT */}
        <div className="header-right">
          {/* LANGUAGE */}
          <div
            className="language"
            aria-label={
              isTR
                ? "Dil seçimi"
                : "Language selection"
            }
          >
            <a
              className={
                !isTR ? "active" : undefined
              }
              href={currentLanguageRoutes.en}
              aria-current={
                !isTR ? "page" : undefined
              }
              onClick={(event) =>
                handleLocaleClick(event, "en")
              }
            >
              EN
            </a>

            <span>/</span>

            <a
              className={
                isTR ? "active" : undefined
              }
              href={currentLanguageRoutes.tr}
              aria-current={
                isTR ? "page" : undefined
              }
              onClick={(event) =>
                handleLocaleClick(event, "tr")
              }
            >
              TR
            </a>
          </div>

          {/* RESERVATION */}
          <a
            className="contact-header-button"
            href={reserveHref}
          >
            {isTR
              ? "REZERVASYON YAP"
              : "BOOK A TABLE"}
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className={`mobile-menu-toggle ${
              menuOpen ? "is-open" : ""
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
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        id="mobile-navigation"
        className={`mobile-menu-panel ${
          menuOpen ? "is-open" : ""
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
          <a
            href={menuHref}
            onClick={closeMenu}
          >
            {isTR ? "MENÜ" : "MENU"}
          </a>

          <a
            href={storyHref}
            onClick={closeMenu}
          >
            {isTR
              ? "HİKÂYEMİZ"
              : "OUR STORY"}
          </a>

          <a
            href={galleryHref}
            onClick={closeMenu}
          >
            {isTR ? "GALERİ" : "GALLERY"}
          </a>

          <a
            href={eventsHref}
            onClick={closeMenu}
          >
            {isTR
              ? "ÖZEL DAVETLER"
              : "PRIVATE EVENTS"}
          </a>

          <a
            href={contactHref}
            onClick={closeMenu}
          >
            {isTR ? "İLETİŞİM" : "CONTACT"}
          </a>
        </nav>

        {/* MOBILE BOTTOM */}
        <div className="mobile-menu-bottom">
          {/* LANGUAGE */}
          <div className="mobile-menu-language">
            <a
              className={
                !isTR ? "active" : undefined
              }
              href={currentLanguageRoutes.en}
              onClick={(event) =>
                handleLocaleClick(event, "en")
              }
            >
              EN
            </a>

            <span>/</span>

            <a
              className={
                isTR ? "active" : undefined
              }
              href={currentLanguageRoutes.tr}
              onClick={(event) =>
                handleLocaleClick(event, "tr")
              }
            >
              TR
            </a>
          </div>

          {/* MOBILE RESERVATION */}
          <a
            href={reserveHref}
            className="mobile-menu-reserve"
            onClick={closeMenu}
          >
            {isTR
              ? "REZERVASYON YAP"
              : "BOOK A TABLE"}
          </a>
        </div>
      </div>
    </>
  );
}