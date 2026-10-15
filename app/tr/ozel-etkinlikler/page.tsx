"use client";

import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventSlider from "@/components/EventSlider";

export default function OzelEtkinliklerPage() {
  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, özel bir etkinlik düzenlemek hakkında bilgi almak istiyorum.\n\nEtkinlik türü:\nTercih edilen tarih:\nMisafir sayısı:"
    );

  const loungeImages = [
    {
      src: "/images/home/4.jpg",
      alt: "La Lara Lounge özel etkinlik",
    },
    {
      src: "/images/home/5.jpg",
      alt: "La Lara Lounge Yalıkavak",
    },
    {
      src: "/images/home/6.jpg",
      alt: "La Lara Lounge etkinlik alanı",
    },
  ];

  const privateEventImages = [
    {
      src: "/images/home/7.jpg",
      alt: "La Lara özel davet",
    },
    {
      src: "/images/home/2.jpg",
      alt: "La Lara Restaurant özel organizasyon",
    },
    {
      src: "/images/home/3.jpg",
      alt: "La Lara Yalıkavak özel davet",
    },
  ];

  const weddingImages = [
    {
      src: "/images/home/8.jpg",
      alt: "La Lara butik düğün",
    },
    {
      src: "/images/home/1.jpg",
      alt: "La Lara Yalıkavak düğün organizasyonu",
    },
    {
      src: "/images/home/9.jpg",
      alt: "La Lara özel düğün daveti",
    },
  ];

  return (
    <main className="events-page">
      <Header locale="tr" />

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="events-page-hero">
        <Image
          src="/images/home/8.jpg"
          alt="La Lara Yalıkavak özel etkinlikler"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div className="events-page-hero-content">
          <p className="eyebrow light">
            LA LARA · YALIKAVAK
          </p>

          <h1>
            Özel Anlar,
            <br />
            La Lara&apos;da.
          </h1>

          <p>
            Samimi buluşmalardan özel davetlere ve
            kutlamalara kadar, unutulmaz anlar için
            Yalıkavak&apos;ta size özel bir atmosfer.
          </p>

          <a
            href="#events"
            className="outline-button"
          >
            ETKİNLİKLERİ KEŞFEDİN
          </a>
        </div>
      </section>

      {/* =====================================================
          INTRO
          ===================================================== */}

      <section className="events-editorial-intro">
        <p className="eyebrow">
          ÖZEL DAVETLER
        </p>

        <h2>
          Her kutlamanın
          <br />
          kendine ait bir hikâyesi var.
        </h2>

        <p>
          İster samimi bir akşam, ister özel bir kutlama,
          ister hayatınızın en önemli günlerinden biri
          olsun; La Lara&apos;da her daveti kendi karakterine
          göre planlıyoruz.
        </p>
      </section>

      {/* =====================================================
          EVENTS
          ===================================================== */}

      <div
        id="events"
        className="events-editorial-list"
      >
        {/* ===================================================
            01 — LOUNGE
            =================================================== */}

        <section className="event-editorial-row">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              01
            </div>

            <p className="eyebrow">
              LA LARA LOUNGE
            </p>

            <h2>
              Samimi
              <br />
              Etkinlikler
            </h2>

            <div className="event-editorial-text">
              <p>
                Sıcak ve davetkâr atmosferiyle La Lara
                Lounge, sosyal buluşmalar ve özel
                kutlamalar için çok yönlü bir etkinlik
                alanı sunar.
              </p>

              <p>
                Arkadaşlarla keyifli akşamlardan özel
                kapalı parti organizasyonlarına kadar,
                etkinliğinizin konseptine göre farklı
                düzenlemeler oluşturulabilir.
              </p>

              <p>
                Rahat ve samimi atmosferi sayesinde
                öğleden sonra buluşmalarından uzun akşam
                sohbetlerine kadar farklı etkinliklere
                uyum sağlayan bir ortam sunar.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              BU ETKİNLİK İÇİN BİLGİ AL{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={loungeImages} />
          </div>
        </section>

        {/* ===================================================
            02 — PRIVATE EVENTS
            =================================================== */}

        <section className="event-editorial-row is-reversed">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              02
            </div>

            <p className="eyebrow">
              LA LARA RESTAURANT &amp; BAR
            </p>

            <h2>
              Özel
              <br />
              Davetler
            </h2>

            <div className="event-editorial-text">
              <p>
                La Lara&apos;da seçili alanların rezerve
                edilmesi veya etkinliğinize özel
                düzenlenmesi seçenekleriyle kişisel
                davetler planlayabilirsiniz.
              </p>

              <p>
                Romantik akşam yemekleri, yıl dönümü
                kutlamaları, sürpriz evlilik teklifleri,
                doğum günleri, aile ve arkadaş
                buluşmaları için sıcak ve zarif bir
                atmosfer sunuyoruz.
              </p>

              <p>
                Ekibimiz etkinliğinizin detaylarını
                sizinle birlikte değerlendirerek,
                davetinize uygun bir deneyim
                oluşturmanıza yardımcı olur.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              DAVETİNİZİ PLANLAYIN{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={privateEventImages} />
          </div>
        </section>

        {/* ===================================================
            03 — WEDDINGS
            =================================================== */}

        <section className="event-editorial-row">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              03
            </div>

            <p className="eyebrow">
              YALIKAVAK · BODRUM
            </p>

            <h2>
              Özel Butik
              <br />
              Düğünler
            </h2>

            <div className="event-editorial-text">
              <p>
                Hayatınızın en özel günlerinden birini
                Yalıkavak&apos;ın atmosferinde, size ve
                davetlilerinize özel bir kutlamaya
                dönüştürün.
              </p>

              <p>
                La Lara&apos;nın sıcak misafirperverlik
                anlayışı, özenli yemekleri ve kendine
                özgü atmosferi butik düğünler ve özel
                kutlamalar için bir araya geliyor.
              </p>

              <p>
                Hayal ettiğiniz daveti bize anlatın.
                Organizasyonun detaylarını, yemek
                seçeneklerini ve etkinliğin akışını
                birlikte değerlendirelim.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              DÜĞÜNÜNÜZ İÇİN BİLGİ AL{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={weddingImages} />
          </div>
        </section>
      </div>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="events-page-enquiry">
        <p className="eyebrow">
          ÖZEL DAVETLER · YALIKAVAK
        </p>

        <h2>
          Birlikte
          <br />
          planlayalım.
        </h2>

        <p>
          Etkinliğinizin türünü, tarihini ve tahmini
          misafir sayısını bize iletin. Ekibimiz sizinle
          iletişime geçsin.
        </p>

        <div className="events-page-enquiry-actions">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="events-page-primary-button"
          >
            WHATSAPP&apos;TAN YAZIN
          </a>

          <a
            href="mailto:reservation.bodrum@lalara.com.tr"
            className="line-link"
          >
            E-POSTA GÖNDER <span>→</span>
          </a>
        </div>
      </section>

      <Footer locale="tr" />
    </main>
  );
}