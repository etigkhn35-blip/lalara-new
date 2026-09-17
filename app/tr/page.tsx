import Image from "next/image";

const photos = {
  hero: "/images/home/1.jpg",
  philosophy: "/images/home/2.jpg",
  food: "/images/home/3.jpg",
  drinks: "/images/home/4.jpg",
  breakfast: "/images/home/5.jpg",
  goldenHour: "/images/home/6.jpg",
  story: "/images/home/7.jpg",
  moment: "/images/home/8.jpg",
};

export default function TurkishHome() {
  return (
    <main className="tr-page">
      {/* HEADER */}
      <header className="site-header">
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

        <nav className="desktop-nav" aria-label="Ana menü">
          <a href="#story">Hikayemiz</a>
          <a href="#menu">Menüler</a>
          <a href="#experience">Deneyim</a>
          <a href="#moments">Galeri</a>
      <a href="/tr/iletisim">İletişim</a>
        </nav>

        <div className="header-actions">
          <div className="language" aria-label="Dil seçimi">
            <a href="/">EN</a>
            <span className="language-divider">/</span>
            <span>TR</span>
          </div>

          <a href="#reserve" className="reserve-small">
            Masa Ayırt
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <Image
          src={photos.hero}
          alt="La Lara Restaurant Yalıkavak Bodrum"
          fill
          priority
          sizes="100vw"
          className="cover-image hero-image"
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="eyebrow light">Yalıkavak · Bodrum</p>

          <h1>
            İyi yemek,
            <br />
            sevdiklerinle daha güzel.
          </h1>

          <p className="hero-copy">
            Akdeniz lezzetleri, uzun sohbetler
            <br className="desktop-break" />
            ve hatırlanmaya değer akşamlar.
          </p>

          <div className="hero-actions">
            <a href="#reserve" className="hero-button">
              Masa Ayırt
            </a>

            <a href="#menu" className="hero-text-link">
              Menülerimizi Keşfet
            </a>
          </div>
        </div>

        <a
          href="#intro"
          className="scroll-indicator"
          aria-label="La Lara'yı keşfet"
        >
          <span>La Lara&apos;yı Keşfet</span>
          <i />
        </a>
      </section>

      {/* INTRO */}
      <section id="intro" className="intro section-pad">
        <p className="eyebrow">La Lara · Restaurant &amp; Bar</p>

        <h2>
          Her şey basit
          <br />
          bir fikirle başladı.
        </h2>

        <p className="intro-statement">
          İyi yemek, sevdiğiniz insanlarla
          <br className="desktop-break" />
          paylaşıldığında daha güzeldir.
        </p>

        <p className="intro-text">
          Yalıkavak Körfezi&apos;nin panoramik manzarasına karşı La Lara;
          bir araya gelmek, güzel yemekler yemek, uzun sohbetler etmek ve
          sevdiklerinizle zaman geçirmek için tasarlanmış bir buluşma noktası.
        </p>
      </section>

      {/* PHILOSOPHY */}
      <section className="editorial">
        <div className="editorial-image">
          <Image
            src={photos.philosophy}
            alt="La Lara Restaurant Yalıkavak yemek ve restoran atmosferi"
            fill
            sizes="(max-width: 900px) 100vw, 58vw"
            className="cover-image"
          />
        </div>

        <div className="editorial-copy">
          <p className="eyebrow">Sofrada</p>

          <h2>
            Paylaşmak
            <br />
            için hazırlandı.
          </h2>

          <p>
            Akdeniz misafirperverliğinden ilham alan soframız; lezzeti,
            sohbeti ve Yalıkavak&apos;ın kendine özgü ritmini bir araya
            getiriyor.
          </p>

          <p>
            Yemek için gelin. Gün batımı, hikâyeler ve biraz daha uzun
            sürmesini isteyeceğiniz anlar için kalın.
          </p>

          <a href="#menu" className="text-link">
            Menülerimizi Keşfet <span>→</span>
          </a>
        </div>
      </section>

      {/* MENUS */}
      <section id="menu" className="menu-section section-pad">
        <div className="section-heading menu-heading">
          <div>
            <p className="eyebrow">Menüler</p>
          </div>

          <h2>
            Paylaşmak için
            <br />
            hazırlanan lezzetler.
          </h2>
        </div>

        <div className="menus-editorial">
          {/* FOOD */}
          <article className="menu-feature menu-feature-food">
            <div className="menu-photo menu-photo-large">
              <Image
                src={photos.food}
                alt="La Lara Yalıkavak yemek menüsü ve Akdeniz lezzetleri"
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                className="cover-image"
              />
            </div>

            <div className="menu-copy">
              <p className="menu-kicker">
                Akdeniz · Mevsimsel · Paylaşım
              </p>

              <h3>Yemek</h3>

              <p>
                Akdeniz lezzetleri, taze malzemeler ve sofradaki herkesi bir
                araya getirmek için hazırlanan tabaklar.
              </p>

              <a
                href="/lalara-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Yemek Menüsünü Gör <span>↗</span>
              </a>
            </div>
          </article>

          {/* DRINKS */}
          <article className="menu-feature menu-feature-drinks">
            <div className="menu-photo menu-photo-portrait">
              <Image
                src={photos.drinks}
                alt="La Lara Yalıkavak kokteyl ve içecekler"
                fill
                sizes="(max-width: 900px) 100vw, 36vw"
                className="cover-image"
              />
            </div>

            <div className="menu-copy">
              <p className="menu-kicker">
                Kokteyller · Şarap · Gün Batımı
              </p>

              <h3>İçecek</h3>

              <p>
                Gün batımından Yalıkavak gecelerine uzanan anlara eşlik eden
                kokteyller, şaraplar ve özenle seçilmiş içecekler.
              </p>

              <a
                href="/lalara-drinks.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                İçecek Menüsünü Gör <span>↗</span>
              </a>
            </div>
          </article>

          {/* BREAKFAST */}
          <article className="menu-feature menu-feature-breakfast">
            <div className="menu-photo menu-photo-breakfast">
              <Image
                src={photos.breakfast}
                alt="La Lara Yalıkavak kahvaltı"
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className="cover-image"
              />
            </div>

            <div className="menu-copy">
              <p className="menu-kicker">
                Sabah · Kahve · Deniz Manzarası
              </p>

              <h3>Kahvaltı</h3>

              <p>
                Yavaş başlayan sabahlar, deniz manzarasına karşı kahvaltı ve
                Yalıkavak Körfezi&apos;nin ilk ışıkları.
              </p>

              <a
                href="/lalara-breakfast.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Kahvaltı Menüsünü Gör <span>↗</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="golden-hour">
        <Image
          src={photos.goldenHour}
          alt="La Lara Yalıkavak gün batımı"
          fill
          sizes="100vw"
          className="cover-image"
        />

        <div className="golden-overlay" />

        <div className="golden-content">
          <p className="eyebrow light">La Lara Deneyimi</p>

          <h2>
            Gün batımından
            <br />
            gecenin ilerleyen saatlerine.
          </h2>

          <p>
            Kahvaltı. Öğle yemeği. Gün batımı kokteylleri. Akşam yemeği.
            <br />
            Ve acele etmek için hiçbir sebep yok.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" className="story section-pad">
        <div className="story-heading">
          <div>
            <p className="eyebrow">Hikayemiz</p>
            <span className="section-number">Bir aile hikayesi</span>
          </div>

          <h2>
            Lara&apos;dan ilham
            <br />
            alan bir sofra.
          </h2>
        </div>

        <div className="story-layout">
          <div className="story-image">
            <Image
              src={photos.story}
              alt="La Lara Restaurant Yalıkavak atmosferi"
              fill
              sizes="(max-width: 900px) 100vw, 57vw"
              className="cover-image"
            />
          </div>

          <div className="story-copy">
            <p className="story-lead">
              Sıcak. Zarif.
              <br />
              Ve karakter dolu.
            </p>

            <p>
              La Lara&apos;da yaratmak istediğimiz hissin kökleri kendi aile
              hikayemize uzanıyor. Restoranımız adını büyükannemiz Lara&apos;dan
              alıyor.
            </p>

            <p>
              Lara, aklınıza gelebilecek geleneksel büyükannelerden değildi.
              Kariyer sahibi, güçlü bir kişiliğe ve kabul etmek gerekir ki
              biraz da diva ruhuna sahipti.
            </p>

            <p>
              Yemek yapmayı severdi ama misafir ağırlamayı daha da çok
              severdi. Mutfağındaki masa; uzun sohbetlerin, hikâyelerin,
              kahkahaların ve elbette paylaşılacak bolca yemeğin olduğu bir
              yerdi.
            </p>

            <p>
              Bize gerçek misafirperverliğin ne olduğunu o gösterdi:
              İnsanların kendilerini rahat, değerli ve evlerinde
              hissetmelerini sağlamak.
            </p>
          </div>
        </div>
      </section>
            {/* PEMBE FİL */}
      <section className="elephant-section">
        <div className="elephant-orbit" aria-hidden="true">
          <span>LA LARA</span>
          <Image
  src="/pink-elephant.ico"
  alt=""
  width={52}
  height={52}
  className="pink-elephant-icon"
/>
        </div>

        <p className="eyebrow">Pembe Fil</p>

        <h2>
          “Rüyanda pembe
          <br />
          filler gör.”
        </h2>

        <p className="elephant-text">
          Çocukken büyükannemiz yatmadan önce bize hep bu sözleri söylerdi.
        </p>

        <p className="elephant-text elephant-text-secondary">
          Ne anlama geldiğini pek düşünmezdik. Bu, sadece ona ait olan biraz
          tuhaf, sevgi dolu ve gizemli sözlerden biriydi.
        </p>

        <p className="elephant-text elephant-text-secondary">
          Bugün onun sözlerine yeni bir anlam vermeyi seviyoruz: Meraklı kal,
          alışılmışın ötesini düşün ve biraz daha büyük hayaller kur.
        </p>

        <p className="elephant-note">
          Evimizden küçük bir parça.
        </p>
      </section>

      {/* MOMENTS */}
      <section id="moments" className="moments section-pad">
        <div className="moments-heading">
          <div>
            <p className="eyebrow">La Lara Anları</p>
            <span className="section-number">Yalıkavak · Bodrum</span>
          </div>

          <h2>
            Ye.
            <br />
            İç.
            <br />
            Paylaş.
          </h2>
        </div>

        <div className="moments-collage">
          <div className="moment moment-main">
            <Image
              src={photos.moment}
              alt="La Lara Yalıkavak"
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
              className="cover-image"
            />
          </div>

          <div className="moment moment-food">
            <Image
              src={photos.food}
              alt="La Lara paylaşım yemekleri"
              fill
              sizes="(max-width: 900px) 75vw, 28vw"
              className="cover-image"
            />
          </div>

          <div className="moment moment-space">
            <Image
              src={photos.philosophy}
              alt="La Lara Restaurant Yalıkavak"
              fill
              sizes="(max-width: 900px) 85vw, 38vw"
              className="cover-image"
            />
          </div>

          <div className="moment-quote">
            <span>LA LARA</span>
            <p>
              Buluş.
              <br />
              Tadını çıkar.
              <br />
              Biraz daha kal.
            </p>
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reserve" className="reservation">
        <div className="reservation-inner">
          <p className="eyebrow light">Yalıkavak · Bodrum</p>

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

          <a href="#" className="reservation-button">
            Masa Ayırt
          </a>
        </div>
      </section>

            {/* FOOTER */}
      <footer id="contact" className="footer">
        <div className="footer-top">
          {/* LOGO */}
          <div className="footer-brand">
            <Image
              src="/lalara-logo.png"
              alt="La Lara Restaurant & Bar"
              width={190}
              height={70}
              className="footer-logo-image"
            />
            
          </div>

          {/* ADRES */}
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

          {/* KEŞFET */}
          <div className="footer-column">
            <span>Keşfet</span>

            <a href="#story">Hikayemiz</a>
            <a href="#menu">Menüler</a>
            <a href="#experience">Deneyim</a>
            <a href="#moments">Galeri</a>
          </div>

          {/* SOSYAL MEDYA */}
          <div className="footer-column footer-social">
            <span>La Lara&apos;yı Takip Edin</span>

            <div className="footer-social-icons">
              {/* FACEBOOK */}
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

              {/* INSTAGRAM */}
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

              {/* TRIPADVISOR */}
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

                  <circle
                    cx="7.2"
                    cy="12.5"
                    r="1"
                    fill="currentColor"
                  />

                  <circle
                    cx="16.8"
                    cy="12.5"
                    r="1"
                    fill="currentColor"
                  />

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

        {/* FOOTER BOTTOM */}
        <div className="footer-bottom">
          <span>© 2026 La Lara Restaurant &amp; Bar</span>

          <span>Yalıkavak · Bodrum</span>

          <span>
            <a href="/">EN</a>
            {" / "}
            <a href="/tr">TR</a>
          </span>
        </div>
      </footer>

      {/* MOBILE ACTION BAR */}
      <div className="mobile-actions">
        <a href="#menu">Menüler</a>

        <a href="#reserve">
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