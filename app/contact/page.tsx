import Image from "next/image";

export default function ContactPage() {
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

          <a href="tel:+905458941838" className="contact-header-button">
            Book a Table
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
            Come find
            <br />
            your table.
          </h1>

          <p>
            Good food, long conversations
            <br />
            and Yalıkavak evenings.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-main">
        <div className="contact-heading">
          <div>
            <p className="eyebrow">Contact</p>
            <span>Yalıkavak · Bodrum</span>
          </div>

          <h2>
            We&apos;d love
            <br />
            to see you.
          </h2>
        </div>

        <div className="contact-columns">
          <div className="contact-column">
            <span className="contact-label">Visit</span>

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
              Get directions ↗
            </a>
          </div>

          <div className="contact-column">
            <span className="contact-label">Reservations</span>

            <h3>Book a table</h3>

            <p>
              For reservations and enquiries,
              <br />
              call or email our team.
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
            <span className="contact-label">Follow</span>

            <h3>Stay connected</h3>

            <p>
              Follow La Lara for food,
              <br />
              sunsets and moments from Yalıkavak.
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
          <p className="eyebrow light">Reservations</p>

          <h2>
            Your table
            <br />
            awaits.
          </h2>

          <p>
            Come for the view. Stay for the food,
            <br />
            the people and the night.
          </p>

          <div className="contact-actions">
            <a
              href="tel:+905458941838"
              className="outline-button"
            >
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
    <p className="eyebrow">Find Us</p>

    <h2>
      In the heart of
      <br />
      Yalıkavak.
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
            <span>Visit</span>

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
            <span>Explore</span>

            <a href="/#story">Our Story</a>
            <a href="/#menus">Menus</a>
            <a href="/#experience">Experience</a>
            <a href="/#moments">Gallery</a>
          </div>

          <div>
            <span>Follow</span>

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