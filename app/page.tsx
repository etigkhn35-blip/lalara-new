"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  address: "Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye",
  instagram: "https://www.instagram.com/lalara.bodrum/",
  facebook: "https://www.facebook.com/lalararestaurant",
  tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [cms, setCms] = useState<Record<string, CmsRecord>>({});
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [photos, setPhotos] = useState(defaultPhotos);
  const [gallery, setGallery] = useState<string[]>([]);
  const [documents, setDocuments] = useState(defaultDocuments);

  useEffect(() => {
    async function loadCms() {
      try {
        const contentSnapshot = await getDocs(collection(db, "siteContent"));
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

        const [contactSnapshot, socialSnapshot, mediaSnapshot, documentsSnapshot] = await Promise.all([
          getDoc(doc(db, "siteSettings", "contact")),
          getDoc(doc(db, "siteSettings", "social")),
          getDoc(doc(db, "siteSettings", "media")),
          getDoc(doc(db, "siteSettings", "documents")),
        ]);

        setSettings({
          phone: contactSnapshot.data()?.phone ?? defaultSettings.phone,
          email: contactSnapshot.data()?.email ?? defaultSettings.email,
          address: contactSnapshot.data()?.address ?? defaultSettings.address,
          instagram: socialSnapshot.data()?.instagram ?? defaultSettings.instagram,
          facebook: socialSnapshot.data()?.facebook ?? defaultSettings.facebook,
          tripadvisor: socialSnapshot.data()?.tripadvisor ?? defaultSettings.tripadvisor,
        });

        const savedImages = mediaSnapshot.data()?.images || {};
        setPhotos({
          hero: savedImages.hero?.url || defaultPhotos.hero,
          atmosphere: savedImages.atmosphere?.url || defaultPhotos.atmosphere,
          food: savedImages.food?.url || defaultPhotos.food,
          drinks: savedImages.drinks?.url || defaultPhotos.drinks,
          breakfast: savedImages.breakfast?.url || defaultPhotos.breakfast,
          sunset: savedImages.sunset?.url || defaultPhotos.sunset,
          story: savedImages.story?.url || defaultPhotos.story,
          moments: savedImages.moments?.url || defaultPhotos.moments,
          event1: savedImages.event1?.url || savedImages.moments?.url || defaultPhotos.event1,
          event2: savedImages.event2?.url || defaultPhotos.event2,
          event3: savedImages.event3?.url || defaultPhotos.event3,
          contactHero: savedImages.contactHero?.url || defaultPhotos.contactHero,
        });
        setGallery(
          Array.isArray(mediaSnapshot.data()?.gallery)
            ? mediaSnapshot.data()!.gallery.map((item: { url?: string }) => item.url).filter(Boolean)
            : []
        );

        setDocuments({
          food: documentsSnapshot.data()?.food?.url || defaultDocuments.food,
          drinks: documentsSnapshot.data()?.drinks?.url || defaultDocuments.drinks,
          breakfast: documentsSnapshot.data()?.breakfast?.url || defaultDocuments.breakfast,
        });
      } catch (error) {
        console.error("La Lara CMS load error:", error);
      }
    }

    loadCms();
  }, []);

  const telHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

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
    <main className="home-page">
      <div className="opening" aria-hidden="true">
        <div className="opening-bg" />
        <Image src="/lalara-logo.png" alt="" width={900} height={320} priority className="opening-logo" />
      </div>

      <div className="background-brand" aria-hidden="true">
        <Image src="/lalara-logo.png" alt="" width={1200} height={440} className="background-brand-image" />
      </div>

      <header className="site-header">
        <a href="/" className="brand" aria-label="La Lara home">
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={190}
            height={70}
            priority
          />
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#story">Our Story</a>
          <a href="#menus">Menus</a>
          <a href="#experience">Experience</a>
          <a href="#events">Private Events</a>
          <a href="#moments">Gallery</a>
          <a href="/contact">Contact</a>
        </nav>

        <div className="header-right">
          <div className="language">
            <a className="active" href="/">EN</a>
            <span>/</span>
            <a href="/tr">TR</a>
          </div>

          <a  className="contact-header-button"href="https://wa.me/905458941838" target="_blank" rel="noopener noreferrer">
            Book a Table
          </a>

          <button
            type="button"
            className={`mobile-menu-toggle ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`mobile-menu-panel ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <a href="#story" onClick={() => setMenuOpen(false)}>Our Story</a>
          <a href="#menus" onClick={() => setMenuOpen(false)}>Menus</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>Private Events</a>
          <a href="#moments" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="/contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>

        <div className="mobile-menu-bottom">
          <div className="mobile-menu-language">
            <a className="active" href="/">EN</a>
            <span>/</span>
            <a href="/tr">TR</a>
          </div>

          <a
            href="#reserve"
            className="mobile-menu-reserve"
            onClick={() => setMenuOpen(false)}
          >
            Book a Table
          </a>
        </div>
      </div>

      <section className="hero opaque-section">
        <Image src={photos.hero} alt="La Lara Restaurant & Bar in Yalıkavak Bodrum" fill priority sizes="100vw" className="cover" />
        <div className="image-overlay" />
        <div className="hero-content">
          <p className="eyebrow light" style={cmsStyle("hero", "eyebrow")}>{cms.hero?.eyebrow || "Yalıkavak · Bodrum"}</p>
          <h1 style={cmsStyle("hero", "heading")}>{cms.hero?.heading ? renderLines(cms.hero.heading) : <>Good food tastes better<br />when it is shared.</>}</h1>
          <p style={cmsStyle("hero", "text")}>{cms.hero?.body ? renderLines(cms.hero.body) : <>Mediterranean flavours, long conversations<br />and evenings made to remember.</>}</p>
          <div className="hero-actions"><a href="#reserve" className="outline-button">Reserve a table</a><a href="#menus" className="outline-button">Explore our menus</a></div>
        </div>
        <a className="scroll-cue" href="#intro">Discover La Lara <i /></a>
      </section>

      <section id="intro" className="intro transparent-section">
        <p className="eyebrow" style={cmsStyle("intro", "eyebrow")}>{cms.intro?.eyebrow || "La Lara · Restaurant & Bar"}</p>
        <h2 style={cmsStyle("intro", "heading")}>{cms.intro?.heading ? renderLines(cms.intro.heading) : <>Created around<br />a simple idea.</>}</h2>
        <p className="display-copy">{cms.intro?.body || <>Good food tastes better when it is shared<br />with the people you love.</>}</p>
        <p className="body-copy">With panoramic views over Yalıkavak Bay, La Lara is a place to gather, eat well, talk for hours and enjoy the people around you.</p>
      </section>

      <section className="split-section opaque-section">
        <div className="split-image"><Image src={photos.atmosphere} alt="Dining atmosphere at La Lara Restaurant" fill sizes="(max-width:900px) 100vw,58vw" className="cover" /></div>
        <div className="split-copy">
          <p className="eyebrow" style={cmsStyle("at-the-table", "eyebrow")}>{cms["at-the-table"]?.eyebrow || "At the table"}</p><h2 style={cmsStyle("at-the-table", "heading")}>{cms["at-the-table"]?.heading ? renderLines(cms["at-the-table"].heading) : <>Made for<br />sharing.</>}</h2>
          <p>{cms["at-the-table"]?.body || "Inspired by Mediterranean hospitality, our table brings together food, conversation and the effortless rhythm of Yalıkavak."}</p>
          <p>Come for the food. Stay for the sunset, the stories and the moments that last a little longer.</p>
          <a href="#menus" className="line-link">Discover our menus <span>→</span></a>
        </div>
      </section>

      {/* THE PINK ELEPHANT */}
<section className="elephant opaque-section">
  <div className="elephant-icon">
    <Image
      src="/pink-elephant.ico"
      alt="La Lara pink elephant symbol"
      width={62}
      height={62}
    />
  </div>

  <p className="eyebrow" style={cmsStyle("pink-elephant", "eyebrow")}>{cms["pink-elephant"]?.eyebrow || "The Pink Elephant"}</p>

  <h2>
    “May you dream
    <br />
    of pink elephants”
  </h2>

  <p>
    When we were children, our grandmother always said
    &nbsp;“May you dream of pink elephants” before we went to bed.
  </p>

  <p>
    We never really thought about what it meant. It was simply one of
    those slightly strange, affectionate things that belonged to her.
    Personal, playful and a little mysterious.
  </p>

  <p>
    Today, we like to give her words a new meaning. May you dream of
    pink elephants — a reminder to stay curious, think beyond the
    obvious and dream a little bigger.
  </p>

  <p>
    The pink elephant became a symbol of our restaurant. To anyone
    else, it might seem wonderfully random. To us, it carries a little
    piece of home.
  </p>
</section>

 {/* THE PEOPLE BEHIND IT */}
<section className="people-behind transparent-section">
  <p className="eyebrow" style={cmsStyle("people-behind-it", "eyebrow")}>{cms["people-behind-it"]?.eyebrow || "The People Behind It"}</p>

  <h2>
    From a family,
    <br />
    to a table.
  </h2>

  <div className="people-behind-copy">
    <p>
      Although Lara gave the restaurant its name, the story belongs to
      more than one person.
    </p>

    <p>
      It is also for all our grandparents who shaped our childhood,
      whose kitchens we grew up in.
    </p>

    <p>
      So this place is, in its own way, a thank you.
    </p>

    <strong>
      To Lara, Vova, Vitali &amp; Raya.
    </strong>
  </div>
</section>

      <section id="menus" className="menus transparent-section">
        <div className="section-title"><div><p className="eyebrow">The Menus</p><span>Yalıkavak · Bodrum</span></div><h2>Food made<br />to be shared.</h2></div>
        <div className="menu-grid">
          <article><div className="menu-image"><Image src={photos.food} alt="Mediterranean food at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Mediterranean · Seasonal · Sharing</p><h3>Food</h3><p>Mediterranean flavours, fresh ingredients and plates created to bring everyone around the table.</p><a className="line-link" href={documents.food} target="_blank" rel="noopener noreferrer">View food menu ↗</a></article>
          <article><div className="menu-image"><Image src={photos.drinks} alt="Cocktails and drinks at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Cocktails · Wine · Sunset</p><h3>Drinks</h3><p>Cocktails, wine and carefully chosen drinks made for golden hour and long Yalıkavak nights.</p><a className="line-link" href={documents.drinks} target="_blank" rel="noopener noreferrer">View drinks menu ↗</a></article>
          <article><div className="menu-image"><Image src={photos.breakfast} alt="Breakfast at La Lara overlooking Yalıkavak" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Morning · Coffee · Sea View</p><h3>Breakfast</h3><p>Slow mornings, breakfast by the sea and the first light over Yalıkavak Bay.</p><a className="line-link" href={documents.breakfast} target="_blank" rel="noopener noreferrer">View breakfast menu ↗</a></article>
        </div>
      </section>

      <section id="experience" className="experience opaque-section">
        <Image src={photos.sunset} alt="Golden hour at La Lara Yalıkavak" fill sizes="100vw" className="cover" /><div className="image-overlay" />
        <div><p className="eyebrow light">The La Lara Experience</p><h2>From golden hour<br />to late-night dining.</h2><p>Breakfast. Lunch. Sunset drinks. Dinner.<br />And no reason to rush.</p></div>
      </section>

      <section id="story" className="story transparent-section">
        <div className="section-title"><div><p className="eyebrow" style={cmsStyle("our-story", "eyebrow")}>{cms["our-story"]?.eyebrow || "Our Story"}</p><span>A family story</span></div><h2 style={cmsStyle("our-story", "heading")}>{cms["our-story"]?.heading ? renderLines(cms["our-story"].heading) : <>A table<br />inspired by Lara.</>}</h2></div>
        <div className="story-grid">
          <div className="story-image"><Image src={photos.story} alt="La Lara Restaurant atmosphere" fill sizes="(max-width:900px) 100vw,56vw" className="cover" /></div>
          <div className="story-copy"><h3>Warm. Elegant.<br />Full of personality.</h3><p>The feeling we wanted to capture at La Lara has its roots in our own family. The restaurant is named after our grandmother, Lara.</p><p>She was a career woman with a big personality and, admittedly, a touch of diva in her.</p><p>She loved to cook, but even more than that, she loved to host. Her kitchen table was a place for long conversations, stories, laughter and lots of food to share.</p></div>
        </div>
      </section>

     

      <section id="events" className="events transparent-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">Private Events</p>
            <span>Yalıkavak · Bodrum</span>
          </div>
          <h2>Special moments,<br />at La Lara.</h2>
        </div>
        <div className="events-grid">
          <article className="event-card">
            <div className="event-image"><Image src={photos.event1} alt="Weddings and celebrations at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Celebrate · Gather · Sunset</p>
            <h3>Weddings</h3>
            <p>Sea views, thoughtful tables and a setting shaped around an unforgettable celebration.</p>
          </article>
          <article className="event-card">
            <div className="event-image"><Image src={photos.event2} alt="Private events at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Private · Elegant · Personal</p>
            <h3>Private Celebrations</h3>
            <p>From birthdays to private dinners, gatherings shaped around you and the people at your table.</p>
          </article>
          <article className="event-card">
            <div className="event-image"><Image src={photos.event3} alt="Intimate gatherings at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Intimate · Warm · Shared</p>
            <h3>Intimate Gatherings</h3>
            <p>Long tables, good food and unhurried time together for smaller, more personal occasions.</p>
          </article>
        </div>
      </section>

      <section id="reserve" className="reservation opaque-section">
        <p className="eyebrow light">{cms.reservation?.eyebrow || "Yalıkavak · Bodrum"}</p><h2 style={cms.reservation?.headingSize ? { fontSize: `${cms.reservation.headingSize}px` } : undefined}>{cms.reservation?.heading ? renderLines(cms.reservation.heading) : <>Your table<br />awaits.</>}</h2><p>{cms.reservation?.body ? renderLines(cms.reservation.body) : <>Come for the view. Stay for the food,<br />the people and the night.</>}</p>
        <div className="reservation-actions reservation-actions-stacked"><a className="line-link light-link" href={emailHref}>Email us</a><a className="outline-button" href={telHref}>Call to reserve</a></div>
      </section>

     <footer id="contact" className="site-footer opaque-section">
  <div className="footer-grid">

    {/* BRAND */}
    <div className="footer-brand">
      <Image
        src="/lalara-logo.png"
        alt="La Lara Restaurant & Bar"
        width={260}
        height={96}
      />
      <p>Restaurant &amp; Bar · Yalıkavak</p>
    </div>

    {/* VISIT */}
    <div>
      <span>Visit</span>

      <p>
        {renderLines(settings.address)}
      </p>

      <a href={telHref}>
        {settings.phone}
      </a>

      <a href={emailHref}>
        {settings.email}
      </a>
    </div>

    {/* EXPLORE */}
    <div>
      <span>Explore</span>

      <a href="#story">Our Story</a>
      <a href="#menus">Menus</a>
      <a href="#experience">Experience</a>
      <a href="#events">Private Events</a>
      <a href="#moments">Gallery</a>
    </div>

    {/* SOCIAL */}
    <div className="footer-social">
      <span>Follow</span>

      {/* INSTAGRAM */}
      <a
        href={settings.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="La Lara on Instagram"
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

        <span className="social-name">
          Instagram
        </span>
      </a>

      {/* FACEBOOK */}
      <a
        href={settings.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="La Lara on Facebook"
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

      {/* TRIPADVISOR */}
      <a
        href={settings.tripadvisor}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="La Lara on Tripadvisor"
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

        <span className="social-name">
          Tripadvisor
        </span>
      </a>
    </div>
  </div>

  {/* FOOTER BOTTOM */}
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
