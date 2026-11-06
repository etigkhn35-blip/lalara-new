"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
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
  address: "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",
  instagram: "https://www.instagram.com/lalara.bodrum/",
  facebook: "https://www.facebook.com/lalararestaurant",
  tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
};

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const isTR = locale === "tr";
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [cms, setCms] = useState<Record<string, CmsRecord>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [backToTopDark, setBackToTopDark] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const [contact, social] = await Promise.all([
          getDoc(doc(db, "siteSettings", "contact")),
          getDoc(doc(db, "siteSettings", "social")),
        ]);
        if (!active) return;
        setSettings({
          phone: contact.data()?.phone ?? defaultSettings.phone,
          email: contact.data()?.email ?? defaultSettings.email,
          address: contact.data()?.address ?? defaultSettings.address,
          instagram: social.data()?.instagram ?? defaultSettings.instagram,
          facebook: social.data()?.facebook ?? defaultSettings.facebook,
          tripadvisor: social.data()?.tripadvisor ?? defaultSettings.tripadvisor,
        });
      } catch (error) {
        console.error("Footer settings load error:", error);
      }
    }
    void loadSettings();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const prefix = isTR ? "tr-" : "en-";
    return onSnapshot(collection(db, "siteContent"), (snapshot) => {
      const next: Record<string, CmsRecord> = {};
      snapshot.forEach((item) => {
        const data = item.data() as CmsRecord;
        if (item.id.startsWith(prefix) && (!data.status || data.status === "published")) {
          next[item.id.slice(prefix.length)] = data;
        }
      });
      setCms(next);
    }, (error) => {
      console.error("Footer CMS live load error:", error);
    });
  }, [isTR]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      const button = document.querySelector(".back-to-top") as HTMLElement | null;
      if (!button) return;
      const previous = button.style.pointerEvents;
      button.style.pointerEvents = "none";
      const behind = document.elementFromPoint(window.innerWidth - 50, window.innerHeight - 50);
      button.style.pointerEvents = previous;
      setBackToTopDark(!behind?.closest(".site-footer, .opaque-section, .dark-section"));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const visible = (key: string) => cms[key]?.visible !== false;
  const telHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;
  const mapsHref = "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(settings.address.replace(/\n/g, ", "));

  const links = {
    menu: isTR ? "/tr/menu" : "/menu",
    story: isTR ? "/tr/hikayemiz" : "/our-story",
    events: isTR ? "/tr/ozel-etkinlikler" : "/private-events",
    offers: isTR ? "/tr/offers" : "/offers",
    contact: isTR ? "/tr/iletisim" : "/contact",
  };

  return (
    <footer id="contact" className="site-footer opaque-section lalara-footer-2026">
      <div className="lalara-footer-inner">
        <div className="lalara-footer-columns">
          {visible("footer-brand") && (
            <div className="lalara-footer-brand">
              <Link href={isTR ? "/tr" : "/"} aria-label="La Lara home">
                <Image src="/lalara-logo.png" alt="La Lara Restaurant & Bar" width={320} height={118} />
              </Link>
            </div>
          )}

          <div className="lalara-footer-info">
            <div>
              <h2>{isTR ? "AÇILIŞ SAATLERİ" : "OPENING TIMES"}</h2>
              <p>{isTR ? "Pzt–Paz" : "Mon–Sun"}<br />8:00 – 22:00</p>
            </div>
            <div className="lalara-footer-partners">
              <h2>{isTR ? "İŞ ORTAKLARIMIZ" : "PARTNERS"}</h2>
              <a href="https://spektr-hotel.com/" target="_blank" rel="noopener noreferrer">Spektr Boutique Hotel</a>
            </div>
          </div>

          {visible("footer-navigation") && (
            <nav className="lalara-footer-nav" aria-label={isTR ? "Alt menü" : "Footer navigation"}>
              <h2>{cms["footer-navigation"]?.eyebrow || (isTR ? "KEŞFET" : "EXPLORE")}</h2>
              <Link href={links.menu}>{isTR ? "Menü" : "Menu"}</Link>
              <Link href={links.story}>{isTR ? "Hikâyemiz" : "Our Story"}</Link>
              <Link href={links.events}>{isTR ? "Etkinlikler" : "Events"}</Link>
              <Link href={links.offers}>{isTR ? "Teklifler" : "Offers"}</Link>
              <Link href={links.contact}>{isTR ? "İletişim" : "Contact"}</Link>
            </nav>
          )}

          {visible("footer-address") && (
            <div className="lalara-footer-contact">
              <h2>{isTR ? "İLETİŞİM" : "CONTACT"}</h2>
              <a href={telHref}>{settings.phone}</a>
              <a href={emailHref}>{settings.email}</a>
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="lalara-footer-address">
                {settings.address}
              </a>
            </div>
          )}

          {visible("footer-social") && (
            <div className="lalara-footer-follow">
              <h2>{cms["footer-social"]?.eyebrow || (isTR ? "TAKİP ET" : "FOLLOW")}</h2>
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer">∞ Instagram</a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer">∞ Facebook</a>}
              {settings.tripadvisor && <a href={settings.tripadvisor} target="_blank" rel="noopener noreferrer">∞ Tripadvisor</a>}
            </div>
          )}
        </div>

        {visible("footer-bottom") && (
          <div className="lalara-footer-bottom">
            <span>{cms["footer-bottom"]?.body || "© 2026 LA LARA RESTAURANT & BAR"}</span>
            <span className="lalara-footer-policy">{isTR ? "Politikalar, Şartlar, Veri, Çerezler" : "Policy, Terms, Data, Cookies"}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "is-visible" : ""} ${backToTopDark ? "back-to-top-dark" : "back-to-top-light"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={isTR ? "Yukarı dön" : "Back to top"}
      >
        ↑
      </button>
    </footer>
  );
}
