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
            width={190}
            height={70}
            priority
          />
        </a>

        <nav className="contact-nav" aria-label="Ana menü">
          <a href="/tr#story">Hikayemiz</a>
          <a href="/tr#menus">Menüler</a>
          <a href="/tr#experience">Deneyim</a>
          <a href="/tr#moments">Galeri</a>
          <a href="/tr/iletisim" className="active">
            İletişim
          </a>
        </nav>

        <div className="contact-header-right">
          <div className="contact-language">
            <a href="/contact">EN</a>
            <span>/</span>
            <a href="/tr/iletisim" className="active">
              TR
            </a>
          </div>

          <a href="tel:+905458941838" className="contact-header-button">
            Masa Ayırt
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="contact-hero">
        <Image
          src="/images/home/6.jpg"
          alt="La Lara Restaurant & Bar Yalıkavak Bodrum"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          

          <h1>
            Sofranız
            <br />
            sizi bekliyor.
          </h1>

          <p>
            İyi yemekler, uzun sohbetler
            <br />
            ve Yalıkavak akşamları.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-main">
        <div className="contact-heading">
          <div>
            <p className="eyebrow">İletişim</p>
            <span>Yalıkavak · Bodrum</span>
          </div>

          <h2>
            Sizi La Lara&apos;da
            <br />
            görmek isteriz.
          </h2>
        </div>

        <div className="contact-columns">
          <div className="contact-column">
            <span className="contact-label">Adres</span>

            <h3>La Lara</h3>

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
              Yol tarifi al ↗
            </a>
          </div>

          <div className="contact-column">
            <span className="contact-label">Rezervasyon</span>

            <h3>Masa ayırtın</h3>

            <p>
              Rezervasyon ve bilgi için
              <br />
              bizi arayabilir veya e-posta gönderebilirsiniz.
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
            <span className="contact-label">Takip Et</span>

            <h3>Bağlantıda kalın</h3>

            <p>
              La Lara&apos;dan lezzetler, gün batımları
              <br />
              ve Yalıkavak&apos;tan anlar.
            </p>

            <a
              className="contact-text-link"
              href="https://www.instagram.com/lalara.bodrum/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>

            <a
              className="contact-text-link"
              href="https://www.facebook.com/lalararestaurant"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook ↗
            </a>

            <a
              className="contact-text-link"
              href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tripadvisor ↗
            </a>
          </div>
        </div>
      </section>

      
{/* HARİTA */}
<section className="contact-map">
  <div className="contact-map-heading">
    <p className="eyebrow">Konum</p>

    <h2>
      Yalıkavak&apos;ın
      <br />
      kalbinde.
    </h2>

    <a
      href="https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum"
      target="_blank"
      rel="noopener noreferrer"
      className="line-link"
    >
      Google Maps&apos;te Aç ↗
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
      title="La Lara Restaurant & Bar Yalıkavak Bodrum konumu"
    />
  </div>
</section>

      {/* RESERVATION */}
      <section className="contact-reservation">
        <Image
          src="/images/home/1.jpg"
          alt="La Lara Restaurant Yalıkavak'ta yemek deneyimi"
          fill
          sizes="100vw"
          className="cover"
        />

        <div className="contact-reservation-overlay" />

        <div className="contact-reservation-content">
          <p className="eyebrow light">Rezervasyon</p>

          <h2>
            Masanız
            <br />
            sizi bekliyor.
          </h2>

          <p>
            Manzara için gelin. Yemek, insanlar
            <br />
            ve gece için kalın.
          </p>

          <div className="contact-actions">
            <a
              href="tel:+905458941838"
              className="outline-button"
            >
              Rezervasyon için ara
            </a>

            <a
              href="mailto:reservation.bodrum@lalara.com.tr"
              className="line-link light-link"
            >
              E-posta gönder
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={190}
              height={70}
            />

            <p>Restaurant &amp; Bar · Yalıkavak</p>
          </div>

          <div>
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

          <div>
            <span>Keşfet</span>

            <a href="/tr#story">Hikayemiz</a>
            <a href="/tr#menus">Menüler</a>
            <a href="/tr#experience">Deneyim</a>
            <a href="/tr#moments">Galeri</a>
          </div>

          <div>
            <span>Takip Et</span>

            <a
              href="https://www.instagram.com/lalara.bodrum/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>

            <a
              href="https://www.facebook.com/lalararestaurant"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook ↗
            </a>

            <a
              href="https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tripadvisor ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 La Lara Restaurant &amp; Bar</span>
          <span>Yalıkavak · Bodrum</span>

          <div>
            <a href="/contact">EN</a>
            <span> / </span>
            <a href="/tr/iletisim">TR</a>
          </div>
        </div>
      </footer>
    </main>
  );
}