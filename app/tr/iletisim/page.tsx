import Image from "next/image";

export default function IletisimPage() {
  return (
    <main className="contact-page">
      {/* HEADER */}
      <header className="contact-header">
        <a href="/tr" className="brand" aria-label="La Lara ana sayfa">
          <Image
            src="/lalara-logo.png"
            alt="La Lara Restaurant & Bar"
            width={180}
            height={60}
            className="brand-logo"
            priority
          />
        </a>

        <nav className="contact-nav" aria-label="Ana menü">
          <a href="/tr/#story">Hikayemiz</a>
          <a href="/tr/#menu">Menüler</a>
          <a href="/tr/#moments">Galeri</a>
          <a href="/tr/iletisim">İletişim</a>
        </nav>

        <div className="contact-header-right">
          <a href="/contact">EN</a>
          <span>/</span>
          <a href="/tr/iletisim">TR</a>
        </div>
      </header>

      {/* HERO */}
      <section className="contact-hero">
        <p className="eyebrow">La Lara · Yalıkavak · Bodrum</p>

        <h1>
          Masanıza
          <br />
          bekliyoruz.
        </h1>

        <p className="contact-hero-text">
          Kahvaltı, uzun öğle yemekleri, gün batımı içecekleri
          <br />
          ve Yalıkavak Körfezi&apos;ne karşı keyifli akşamlar.
        </p>
      </section>

      {/* İLETİŞİM */}
      <section className="contact-details">
        <div className="contact-details-title">
          <p className="eyebrow">İletişim</p>

          <h2>
            Bize
            <br />
            ulaşın.
          </h2>
        </div>

        <div className="contact-information">
          <div className="contact-item">
            <span>Adres</span>

            <p>
              Geriş Mah., 2026. Sokak No:5
              <br />
              Yalıkavak, 48990 Bodrum
              <br />
              Muğla · Türkiye
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              Yol tarifi al <b>↗</b>
            </a>
          </div>

          <div className="contact-item">
            <span>Rezervasyon</span>

            <a href="tel:+905458941838" className="contact-big-link">
              +90 545 894 18 38
            </a>

            <a
              href="mailto:reservation.bodrum@lalara.com.tr"
              className="contact-mail"
            >
              reservation.bodrum@lalara.com.tr
            </a>
          </div>

          <div className="contact-item">
            <span>Sosyal Medya</span>

            <div className="contact-socials">
              <a
                href="https://www.facebook.com/lalararestaurant"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook <b>↗</b>
              </a>

              <a
                href="https://www.instagram.com/lalara.bodrum/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <b>↗</b>
              </a>

              <a
                href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tripadvisor <b>↗</b>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HARİTA */}
      <section className="contact-map-section">
        <div className="contact-map-heading">
          <p className="eyebrow">Konum</p>

          <h2>
            Yalıkavak.
            <br />
            Denizin yanı başında.
          </h2>
        </div>

        <div className="contact-map">
          <iframe
            title="La Lara Restaurant Yalıkavak konumu"
            src="https://www.google.com/maps?q=La%20Lara%20Restaurant%20Yalikavak%20Bodrum&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* REZERVASYON */}
      <section className="contact-reservation">
        <p className="eyebrow light">La Lara Restaurant &amp; Bar</p>

        <h2>
          Masanız
          <br />
          sizi bekliyor.
        </h2>

        <p>
          Rezervasyon ve bilgi için
          <br />
          bizi arayın veya e-posta gönderin.
        </p>

        <div className="contact-reservation-actions">
          <a href="tel:+905458941838">
            Bizi Arayın
          </a>

          <a href="mailto:reservation.bodrum@lalara.com.tr">
            E-posta Gönder
          </a>
        </div>
      </section>

     {/* FOOTER */}
<footer className="site-footer">
  <div className="footer-main">
    <div className="footer-brand">
      <a href="/tr" aria-label="La Lara ana sayfa">
        <Image
          src="/lalara-logo.png"
          alt="La Lara Restaurant & Bar"
          width={170}
          height={60}
          className="footer-logo"
        />
      </a>

      <p>Restaurant &amp; Bar</p>
    </div>

    <div className="footer-column">
      <span>Adres</span>

      <p>
        Geriş Mah., 2026. Sokak No:5
        <br />
        Yalıkavak, 48990 Bodrum
        <br />
        Muğla · Türkiye
      </p>

      <a href="tel:+905458941838">
        +90 545 894 18 38
      </a>

      <a href="mailto:reservation.bodrum@lalara.com.tr">
        reservation.bodrum@lalara.com.tr
      </a>
    </div>

    <div className="footer-column">
      <span>Keşfet</span>

      <a href="/tr/#story">Hikayemiz</a>
      <a href="/tr/#menu">Menüler</a>
      <a href="/tr/#moments">Galeri</a>
      <a href="/tr/iletisim">İletişim</a>
    </div>

    <div className="footer-column footer-social">
      <span>La Lara&apos;yı Takip Edin</span>

      <div className="footer-social-icons">
        <a
          href="https://www.facebook.com/lalararestaurant"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="La Lara Facebook"
          className="social-button"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="social-svg"
          >
            <path
              fill="currentColor"
              d="M13.5 22v-9h3l.45-3.5H13.5V7.25c0-1.01.28-1.7 1.74-1.7H17.1V2.42c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.62v2.6H7v3.5h2.9v9h3.6Z"
            />
          </svg>
        </a>

        <a
          href="https://www.instagram.com/lalara.bodrum/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="La Lara Instagram"
          className="social-button"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="social-svg"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <circle
              cx="12"
              cy="12"
              r="3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />

            <circle
              cx="17.4"
              cy="6.7"
              r="1"
              fill="currentColor"
            />
          </svg>
        </a>

        <a
          href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="La Lara Tripadvisor"
          className="social-button"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="social-svg tripadvisor-svg"
          >
            <circle
              cx="7.2"
              cy="12.5"
              r="3.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <circle
              cx="16.8"
              cy="12.5"
              r="3.2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <circle cx="7.2" cy="12.5" r="1" fill="currentColor" />
            <circle cx="16.8" cy="12.5" r="1" fill="currentColor" />

            <path
              d="M4.2 8.9 2.6 7.2h4.2M19.8 8.9l1.6-1.7h-4.2M9.9 13.5 12 16l2.1-2.5M8.8 8.9c1-.65 2.05-.95 3.2-.95s2.2.3 3.2.95"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <span>© 2026 La Lara Restaurant &amp; Bar</span>

    <span>Yalıkavak · Bodrum</span>

    <div className="footer-language">
      <a href="/contact">EN</a>
      <span>/</span>
      <a href="/tr/iletisim">TR</a>
    </div>
  </div>
</footer>

{/* MOBILE ACTION BAR */}
<div className="mobile-action-bar">
  <a href="/tr/#menu">Menüler</a>

  <a href="tel:+905458941838" className="mobile-reserve">
    Rezervasyon
  </a>

  <a
    href="https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum"
    target="_blank"
    rel="noopener noreferrer"
  >
    Yol Tarifi
  </a>
</div>
</main>
);
}