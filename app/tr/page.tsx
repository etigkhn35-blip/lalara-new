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

export default function HomeTR() {
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
            item.id.startsWith("tr-") &&
            data.status === "published"
          ) {
            nextCms[item.id.replace("tr-", "")] = data;
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
        <a href="/tr" className="brand" aria-label="La Lara ana sayfa">
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={190}
            height={70}
            priority
          />
        </a>

        <nav className="desktop-nav" aria-label="Ana menü">
          <a href="#story">HİKAYEMİZ</a>
          <a href="#menus">MENÜLER</a>
          <a href="#experience">DENEYİM</a>
          <a href="#events">ETKİNLİKLER</a>
          <a href="#moments">GALERİ</a>
          <a href="/tr/iletisim">İLETİŞİM</a>
        </nav>

        <div className="header-right">
          <div className="language">
            <a href="/">EN</a>
            <span>/</span>
            <a className="active" href="/tr">TR</a>
          </div>

          <a  className="contact-header-button"href="https://wa.me/905458941838" target="_blank" rel="noopener noreferrer">
            Rezervasyon Yap
          </a>

          <button
            type="button"
            className={`mobile-menu-toggle ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
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
        <nav className="mobile-menu-nav" aria-label="Mobil menü">
          <a href="#story" onClick={() => setMenuOpen(false)}>HİKAYEMİZ</a>
          <a href="#menus" onClick={() => setMenuOpen(false)}>MENÜLER</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>DENEYİM</a>
          <a href="#events" onClick={() => setMenuOpen(false)}>ETKİNLİKLER</a>
          <a href="#moments" onClick={() => setMenuOpen(false)}>GALERİ</a>
          <a href="/tr/iletisim" onClick={() => setMenuOpen(false)}>İLETİŞİM</a>
        </nav>

        <div className="mobile-menu-bottom">
          <div className="mobile-menu-language">
            <a href="/">EN</a>
            <span>/</span>
            <a className="active" href="/tr">TR</a>
          </div>

          <a
            href="#reserve"
            className="mobile-menu-reserve"
            onClick={() => setMenuOpen(false)}
          >
            Rezervasyon Yap
          </a>
        </div>
      </div>

      <section className="hero opaque-section">
        <Image src={photos.hero} alt="La Lara Restaurant & Bar in Yalıkavak Bodrum" fill priority sizes="100vw" className="cover" />
        <div className="image-overlay" />
        <div className="hero-content">
          <p className="eyebrow light" style={cmsStyle("hero", "eyebrow")}>{cms.hero?.eyebrow || "Yalıkavak · Bodrum"}</p>
          <h1 style={cmsStyle("hero", "heading")}>{cms.hero?.heading ? renderLines(cms.hero.heading) : <>İyi yemek,<br />sevdiklerinle daha güzel.</>}</h1>
          <p className="hero-description" style={cmsStyle("hero", "text")}>{cms.hero?.body ? renderLines(cms.hero.body) : <>Akdeniz lezzetleri, uzun sohbetler<br />ve hatırlanmaya değer akşamlar.</>}</p>
          <div className="hero-actions"><a href="#reserve" className="outline-button">Rezervasyon Yap</a><a href="#menus" className="outline-button">MENÜLERİMİZİ KEŞFET</a></div>
        </div>
        <a className="scroll-cue" href="#intro">La Lara’yı keşfet <i /></a>
      </section>

      <section id="intro" className="intro transparent-section">
        <p className="eyebrow" style={cmsStyle("intro", "eyebrow")}>{cms.intro?.eyebrow || "La Lara · Restaurant & Bar"}</p>
        <h2 style={cmsStyle("intro", "heading")}>{cms.intro?.heading ? renderLines(cms.intro.heading) : <>Her şey basit<br />bir fikirle başladı.</>}</h2>
        <p className="display-copy">{cms.intro?.body || <>İyi yemek, sevdiğiniz insanlarla<br /> paylaşıldığında daha güzeldir.</>}</p>
        <p className="body-copy">Yalıkavak Körfezi’nin panoramik manzarasına karşı La Lara; bir araya gelmek, güzel yemekler yemek, uzun sohbetler etmek ve sevdiklerinizle zaman geçirmek için tasarlanmış bir buluşma noktası.</p>
      </section>

      <section className="split-section opaque-section">
        <div className="split-image"><Image src={photos.atmosphere} alt="Dining atmosphere at La Lara Restaurant" fill sizes="(max-width:900px) 100vw,58vw" className="cover" /></div>
        <div className="split-copy">
          <p className="eyebrow" style={cmsStyle("at-the-table", "eyebrow")}>{cms["at-the-table"]?.eyebrow || "Sofrada"}</p><h2 style={cmsStyle("at-the-table", "heading")}>{cms["at-the-table"]?.heading ? renderLines(cms["at-the-table"].heading) : <>Paylaşmak<br />için.</>}</h2>
          <p>{cms["at-the-table"]?.body || "Akdeniz misafirperverliğinden ilham alan soframız; lezzeti, sohbeti ve Yalıkavak’ın kendine özgü ritmini bir araya getiriyor."}</p>
          <p>Yemek için gelin. Gün batımı, hikâyeler ve biraz daha uzun sürmesini isteyeceğiniz anlar için kalın.</p>
          <a href="#menus" className="line-link">Menülerimizi keşfet <span>→</span></a>
        </div>
      </section>

      <section className="elephant opaque-section">
  <div className="elephant-icon">
    <Image
      src="/pink-elephant.ico"
      alt="La Lara pembe fil simgesi"
      width={62}
      height={62}
    />
  </div>

  <p className="eyebrow" style={cmsStyle("pink-elephant", "eyebrow")}>{cms["pink-elephant"]?.eyebrow || "Pembe Fil"}</p>

  <h2>
    “Pembe filler görmen
    <br />
    dileğiyle”
  </h2>

  <p>
    Çocukken, yatmadan önce büyükannemiz hep
    &quot;Pembe filler görmen dileğiyle&quot; derdi.
  </p>

  <p>
    Bunun ne anlama geldiğini hiç sorgulamadık. Sadece ona özgü,
    biraz tuhaf ama sevgi dolu alışkanlıklardan biriydi; kişisel,
    eğlenceli ve biraz da gizemli.
  </p>

  <p>
    Bugün, onun bu sözlerine yeni bir anlam katmayı seviyoruz.
    &quot;Pembe filler görmen dileğiyle&quot; sözü; meraklı kalmanın,
    görünenin ötesini düşünmenin ve biraz daha büyük hayaller kurmanın
    bir hatırlatıcısı bizim için.
  </p>

  <p>
    Pembe fil, restoranımızın simgesi haline geldi. Başkalarına belki
    son derece rastgele bir seçim gibi görünebilir; ama bizim için o,
    evimizden küçük bir parça taşıyor.
  </p>
</section>

<section className="people-behind transparent-section">
  <p className="eyebrow" style={cmsStyle("people-behind-it", "eyebrow")}>{cms["people-behind-it"]?.eyebrow || "Emeği Geçenler"}</p>

  <h2>
    Bir aileden,
    <br />
    bir sofraya.
  </h2>

  <div className="people-behind-copy">
    <p>
      Restoran adını Lara’dan alsa da, bu hikaye tek bir kişiye ait değil.
    </p>

    <p>
      Bu hikaye aynı zamanda çocukluğumuzu şekillendiren ve mutfaklarında
      büyüdüğümüz tüm büyükannelerimiz ve büyükbabalarımız için.
    </p>

    <p>
      Yani burası, kendine has bir şekilde, bir teşekkür niteliğinde.
    </p>

    <strong>
      Lara, Vova, Vitali ve Raya’ya...
    </strong>
  </div>
</section>


      <section id="menus" className="menus transparent-section">
        <div className="section-title"><div><p className="eyebrow">Menüler</p><span>Yalıkavak · Bodrum</span></div><h2>Paylaşmak için<br />hazırlanan lezzetler.</h2></div>
        <div className="menu-grid">
          <article><div className="menu-image"><Image src={photos.food} alt="Mediterranean food at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Akdeniz · Mevsimsel · Paylaşım</p><h3>Yemek</h3><p>Akdeniz lezzetleri, taze malzemeler ve sofradaki herkesi bir araya getirmek için hazırlanan tabaklar.</p><a className="line-link" href={documents.food} target="_blank" rel="noopener noreferrer">Yemek menüsünü gör ↗</a></article>
          <article><div className="menu-image"><Image src={photos.drinks} alt="Cocktails and drinks at La Lara" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Kokteyller · Şarap · Gün Batımı</p><h3>İçecek</h3><p>Gün batımından Yalıkavak gecelerine uzanan anlara eşlik eden kokteyller, şaraplar ve özenle seçilmiş içecekler.</p><a className="line-link" href={documents.drinks} target="_blank" rel="noopener noreferrer">İçecek menüsünü gör ↗</a></article>
          <article><div className="menu-image"><Image src={photos.breakfast} alt="Breakfast at La Lara overlooking Yalıkavak" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div><p className="kicker">Sabah · Kahve · Deniz Manzarası</p><h3>Kahvaltı</h3><p>Yavaş başlayan sabahlar, deniz manzarasına karşı kahvaltı ve Yalıkavak Körfezi’nin ilk ışıkları.</p><a className="line-link" href={documents.breakfast} target="_blank" rel="noopener noreferrer">Kahvaltı menüsünü gör ↗</a></article>
        </div>
      </section>

      <section id="experience" className="experience opaque-section">
        <Image src={photos.sunset} alt="Golden hour at La Lara Yalıkavak" fill sizes="100vw" className="cover" /><div className="image-overlay" />
        <div><p className="eyebrow light">La Lara Deneyimi</p><h2>Gün batımından<br />gecenin ilerleyen saatlerine.</h2><p>Kahvaltı. Öğle yemeği. Gün batımı kokteylleri. Akşam yemeği.<br />Ve acele etmek için hiçbir sebep yok.</p></div>
      </section>

      <section id="story" className="story transparent-section">
        <div className="section-title"><div><p className="eyebrow" style={cmsStyle("our-story", "eyebrow")}>{cms["our-story"]?.eyebrow || "Hikayemiz"}</p><span>Bir aile hikayesi</span></div><h2 style={cmsStyle("our-story", "heading")}>{cms["our-story"]?.heading ? renderLines(cms["our-story"].heading) : <>Lara’dan ilham<br />alan bir sofra.</>}</h2></div>
        <div className="story-grid">
          <div className="story-image"><Image src={photos.story} alt="La Lara Restaurant atmosphere" fill sizes="(max-width:900px) 100vw,56vw" className="cover" /></div>
          <div className="story-copy"><h3>Sıcak. Zarif.<br />Ve karakter dolu.</h3><p>La Lara’da yaratmak istediğimiz hissin kökleri kendi aile hikayemize uzanıyor. Restoranımız adını büyükannemiz Lara’dan alıyor.</p><p>Lara, kariyer sahibi, güçlü bir kişiliğe ve kabul etmek gerekir ki biraz da diva ruhuna sahipti.</p><p>Yemek yapmayı severdi ama misafir ağırlamayı daha da çok severdi. Mutfağındaki masa; uzun sohbetlerin, hikâyelerin, kahkahaların ve paylaşılacak bolca yemeğin olduğu bir yerdi.</p><p>La Lara; onun sıcak, zarif ve kendine has karakterinden ilham alıyor. Restorana onun adını vermek, bize en doğru karar gibi hissettirdi.</p></div>
        </div>
      </section>

      <section id="events" className="events transparent-section">
        <div className="section-title">
          <div>
            <p className="eyebrow">Etkinlikler</p>
            <span>Yalıkavak · Bodrum</span>
          </div>
          <h2>Özel anlar,<br />La Lara’da.</h2>
        </div>
        <div className="events-grid">
          <article className="event-card">
            <div className="event-image"><Image src={photos.event1} alt="La Lara düğün ve kutlama etkinlikleri" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Kutlama · Sofra · Gün Batımı</p>
            <h3>Düğünler</h3>
            <p>Deniz manzarası, özenli sofralar ve size özel bir atmosferle unutulmaz kutlamalar.</p>
          </article>
          <article className="event-card">
            <div className="event-image"><Image src={photos.event2} alt="La Lara özel davetler" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Özel · Zarif · Kişisel</p>
            <h3>Özel Davetler</h3>
            <p>Doğum günlerinden özel akşam yemeklerine, size ve misafirlerinize göre şekillenen davetler.</p>
          </article>
          <article className="event-card">
            <div className="event-image"><Image src={photos.event3} alt="La Lara samimi etkinlikler" fill sizes="(max-width:900px) 100vw,33vw" className="cover" /></div>
            <p className="kicker">Yakın · Sıcak · Paylaşımlı</p>
            <h3>Samimi Etkinlikler</h3>
            <p>Daha küçük gruplar için uzun sofralar, iyi yemek ve birlikte geçirilen zamana odaklanan buluşmalar.</p>
          </article>
        </div>
      </section>

    

      <section id="reserve" className="reservation opaque-section">
        <p className="eyebrow light">{cms.reservation?.eyebrow || "Yalıkavak · Bodrum"}</p><h2 style={cms.reservation?.headingSize ? { fontSize: `${cms.reservation.headingSize}px` } : undefined}>{cms.reservation?.heading ? renderLines(cms.reservation.heading) : <>Masanız<br />sizi bekliyor.</>}</h2><p>{cms.reservation?.body ? renderLines(cms.reservation.body) : <>Manzara için gelin. Yemek, insanlar<br />ve gece için kalın.</>}</p>
        <div className="reservation-actions reservation-actions-stacked"><a className="line-link light-link" href={emailHref}>E-POSTA GÖNDER</a><a className="outline-button tr-uppercase" href={telHref}>REZERVASYON İÇİN ARA</a></div>
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
            <span>Adres</span>
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

          <div>
            <span>Keşfet</span>
            <a href="#story">Hikayemiz</a>
            <a href="#menus">Menüler</a>
            <a href="#experience">Deneyim</a>
            <a href="#events">Etkinlikler</a>
            <a href="#moments">Galeri</a>
          </div>

          <div className="footer-social">
            <span>Takip Et</span>

            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle className="social-fill" cx="17.5" cy="6.5" r="1" />
              </svg>
              <span className="social-name">Instagram</span>
            </a>

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

            <a
              href={settings.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Lara Tripadvisor"
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
