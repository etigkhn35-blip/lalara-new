"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventSlider from "@/components/EventSlider";

/* =========================================================
   TYPES
   ========================================================= */

type CmsRecord = {
  eyebrow?: string;
  heading?: string;
  body?: string;

  buttonLabel?: string;
  buttonLink?: string;

  eyebrowSize?: number;
  headingSize?: number;
  textSize?: number;

  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;

  visible?: boolean;
  status?: string;
};

/* =========================================================
   HELPERS
   ========================================================= */

function renderLines(value: string) {
  const lines = value.split("\n");

  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

function renderParagraphs(value: string) {
  return value
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph, index) => (
      <p key={`${paragraph}-${index}`}>
        {renderLines(paragraph)}
      </p>
    ));
}

/* =========================================================
   PAGE
   ========================================================= */

export default function OzelEtkinliklerPage() {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  /* =======================================================
     WHATSAPP
     ======================================================= */

  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Merhaba La Lara, özel bir etkinlik düzenlemek hakkında bilgi almak istiyorum.\n\nEtkinlik türü:\nTercih edilen tarih:\nMisafir sayısı:"
    );

  /* =======================================================
     EVENT IMAGES
     ======================================================= */

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

  /* =======================================================
     LOAD CMS
     ======================================================= */

  useEffect(() => {
    async function loadContent() {
      try {
        const snapshot = await getDocs(
          collection(db, "siteContent")
        );

        const nextCms: Record<
          string,
          CmsRecord
        > = {};

        snapshot.forEach((item) => {
          const data =
            item.data() as CmsRecord;

          if (
            item.id.startsWith("tr-") &&
            data.status === "published"
          ) {
            nextCms[
              item.id.replace("tr-", "")
            ] = data;
          }
        });

        setCms(nextCms);
      } catch (error) {
        console.error(
          "Özel etkinlikler CMS yükleme hatası:",
          error
        );
      }
    }

    loadContent();
  }, []);

  /* =======================================================
     CMS HELPERS
     ======================================================= */

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return cms[key]?.visible !== false;
  }

  /*
   * Font family ve button typography burada
   * özellikle uygulanmıyor.
   *
   * Site fontlarını CSS kontrol ediyor.
   */

  function cmsStyle(
    key: string,
    kind:
      | "eyebrow"
      | "heading"
      | "text"
  ) {
    const item = cms[key];

    if (!item) {
      return undefined;
    }

    const size =
      kind === "eyebrow"
        ? item.eyebrowSize
        : kind === "heading"
          ? item.headingSize
          : item.textSize;

    return {
      ...(size
        ? {
            fontSize: `${size}px`,
          }
        : {}),

      ...(item.fontWeight
        ? {
            fontWeight:
              item.fontWeight,
          }
        : {}),

      ...(item.lineHeight
        ? {
            lineHeight:
              item.lineHeight,
          }
        : {}),

      ...(item.letterSpacing !== undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  /* =======================================================
     CMS RECORDS
     ======================================================= */

  const hero =
    content("private-events-hero");

  const intro =
    content("private-events-intro");

  const lounge =
    content("private-events-lounge");

  const privateEvents =
    content("private-events-restaurant");

  const weddings =
    content("private-events-weddings");

  const finalCta =
    content("private-events-cta");

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="events-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <Header locale="tr" />

      {/* ===================================================
          HERO
          =================================================== */}

      {isVisible("private-events-hero") && (
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

            <p
              className="eyebrow light"
              style={cmsStyle(
                "private-events-hero",
                "eyebrow"
              )}
            >
              {hero?.eyebrow ||
                "LA LARA · YALIKAVAK"}
            </p>

            <h1
              style={cmsStyle(
                "private-events-hero",
                "heading"
              )}
            >
              {hero?.heading
                ? renderLines(hero.heading)
                : (
                  <>
                    Özel Anlar,
                    <br />
                    La Lara&apos;da.
                  </>
                )}
            </h1>

            <p
              style={cmsStyle(
                "private-events-hero",
                "text"
              )}
            >
              {hero?.body
                ? renderLines(hero.body)
                : (
                  <>
                    Samimi buluşmalardan özel
                    davetlere ve kutlamalara
                    kadar, unutulmaz anlar için
                    Yalıkavak&apos;ta size özel
                    bir atmosfer.
                  </>
                )}
            </p>

            <a
              href={
                hero?.buttonLink ||
                "#events"
              }
              className="outline-button"
            >
              {hero?.buttonLabel ||
                "ETKİNLİKLERİ KEŞFEDİN"}
            </a>

          </div>
        </section>
      )}

      {/* ===================================================
          INTRO
          =================================================== */}

      {isVisible("private-events-intro") && (
        <section className="events-editorial-intro">

          <p
            className="eyebrow"
            style={cmsStyle(
              "private-events-intro",
              "eyebrow"
            )}
          >
            {intro?.eyebrow ||
              "ÖZEL DAVETLER"}
          </p>

          <h2
            style={cmsStyle(
              "private-events-intro",
              "heading"
            )}
          >
            {intro?.heading
              ? renderLines(intro.heading)
              : (
                <>
                  Her kutlamanın
                  <br />
                  kendine ait bir hikâyesi var.
                </>
              )}
          </h2>

          <p
            style={cmsStyle(
              "private-events-intro",
              "text"
            )}
          >
            {intro?.body
              ? renderLines(intro.body)
              : (
                <>
                  İster samimi bir akşam,
                  ister özel bir kutlama,
                  ister hayatınızın en önemli
                  günlerinden biri olsun; La
                  Lara&apos;da her daveti kendi
                  karakterine göre planlıyoruz.
                </>
              )}
          </p>

        </section>
      )}

      {/* ===================================================
          EVENTS
          =================================================== */}

      <div
        id="events"
        className="events-editorial-list"
      >

        {/* =================================================
            01 — LOUNGE
            ================================================= */}

        {isVisible(
          "private-events-lounge"
        ) && (
          <section className="event-editorial-row">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                01
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-lounge",
                  "eyebrow"
                )}
              >
                {lounge?.eyebrow ||
                  "LA LARA LOUNGE"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-lounge",
                  "heading"
                )}
              >
                {lounge?.heading
                  ? renderLines(
                      lounge.heading
                    )
                  : (
                    <>
                      Samimi
                      <br />
                      Etkinlikler
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-lounge",
                  "text"
                )}
              >
                {lounge?.body
                  ? renderParagraphs(
                      lounge.body
                    )
                  : (
                    <>
                      <p>
                        Sıcak ve davetkâr
                        atmosferiyle La Lara
                        Lounge, sosyal
                        buluşmalar ve özel
                        kutlamalar için çok
                        yönlü bir etkinlik
                        alanı sunar.
                      </p>

                      <p>
                        Arkadaşlarla keyifli
                        akşamlardan özel
                        kapalı parti
                        organizasyonlarına
                        kadar, etkinliğinizin
                        konseptine göre farklı
                        düzenlemeler
                        oluşturulabilir.
                      </p>

                      <p>
                        Rahat ve samimi
                        atmosferi sayesinde
                        öğleden sonra
                        buluşmalarından uzun
                        akşam sohbetlerine
                        kadar farklı
                        etkinliklere uyum
                        sağlayan bir ortam
                        sunar.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  lounge?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    lounge?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {lounge?.buttonLabel ||
                  "BU ETKİNLİK İÇİN BİLGİ AL"}{" "}
                <span>→</span>
              </a>

            </div>

            <div className="event-editorial-media">
              <EventSlider
                images={loungeImages}
              />
            </div>

          </section>
        )}

        {/* =================================================
            02 — PRIVATE EVENTS
            ================================================= */}

        {isVisible(
          "private-events-restaurant"
        ) && (
          <section className="event-editorial-row is-reversed">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                02
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-restaurant",
                  "eyebrow"
                )}
              >
                {privateEvents?.eyebrow ||
                  "LA LARA RESTAURANT & BAR"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-restaurant",
                  "heading"
                )}
              >
                {privateEvents?.heading
                  ? renderLines(
                      privateEvents.heading
                    )
                  : (
                    <>
                      Özel
                      <br />
                      Davetler
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-restaurant",
                  "text"
                )}
              >
                {privateEvents?.body
                  ? renderParagraphs(
                      privateEvents.body
                    )
                  : (
                    <>
                      <p>
                        La Lara&apos;da seçili
                        alanların rezerve
                        edilmesi veya
                        etkinliğinize özel
                        düzenlenmesi
                        seçenekleriyle kişisel
                        davetler
                        planlayabilirsiniz.
                      </p>

                      <p>
                        Romantik akşam
                        yemekleri, yıl dönümü
                        kutlamaları, sürpriz
                        evlilik teklifleri,
                        doğum günleri, aile ve
                        arkadaş buluşmaları
                        için sıcak ve zarif
                        bir atmosfer
                        sunuyoruz.
                      </p>

                      <p>
                        Ekibimiz
                        etkinliğinizin
                        detaylarını sizinle
                        birlikte
                        değerlendirerek,
                        davetinize uygun bir
                        deneyim oluşturmanıza
                        yardımcı olur.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  privateEvents?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    privateEvents?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {privateEvents?.buttonLabel ||
                  "DAVETİNİZİ PLANLAYIN"}{" "}
                <span>→</span>
              </a>

            </div>

            <div className="event-editorial-media">
              <EventSlider
                images={
                  privateEventImages
                }
              />
            </div>

          </section>
        )}

        {/* =================================================
            03 — WEDDINGS
            ================================================= */}

        {isVisible(
          "private-events-weddings"
        ) && (
          <section className="event-editorial-row">

            <div className="event-editorial-copy">

              <div className="event-editorial-number">
                03
              </div>

              <p
                className="eyebrow"
                style={cmsStyle(
                  "private-events-weddings",
                  "eyebrow"
                )}
              >
                {weddings?.eyebrow ||
                  "YALIKAVAK · BODRUM"}
              </p>

              <h2
                style={cmsStyle(
                  "private-events-weddings",
                  "heading"
                )}
              >
                {weddings?.heading
                  ? renderLines(
                      weddings.heading
                    )
                  : (
                    <>
                      Özel Butik
                      <br />
                      Düğünler
                    </>
                  )}
              </h2>

              <div
                className="event-editorial-text"
                style={cmsStyle(
                  "private-events-weddings",
                  "text"
                )}
              >
                {weddings?.body
                  ? renderParagraphs(
                      weddings.body
                    )
                  : (
                    <>
                      <p>
                        Hayatınızın en özel
                        günlerinden birini
                        Yalıkavak&apos;ın
                        atmosferinde, size ve
                        davetlilerinize özel
                        bir kutlamaya
                        dönüştürün.
                      </p>

                      <p>
                        La Lara&apos;nın sıcak
                        misafirperverlik
                        anlayışı, özenli
                        yemekleri ve kendine
                        özgü atmosferi butik
                        düğünler ve özel
                        kutlamalar için bir
                        araya geliyor.
                      </p>

                      <p>
                        Hayal ettiğiniz daveti
                        bize anlatın.
                        Organizasyonun
                        detaylarını, yemek
                        seçeneklerini ve
                        etkinliğin akışını
                        birlikte
                        değerlendirelim.
                      </p>
                    </>
                  )}
              </div>

              <a
                href={
                  weddings?.buttonLink ||
                  whatsappHref
                }
                target={
                  (
                    weddings?.buttonLink ||
                    whatsappHref
                  ).startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel="noopener noreferrer"
                className="line-link"
              >
                {weddings?.buttonLabel ||
                  "DÜĞÜNÜNÜZ İÇİN BİLGİ AL"}{" "}
                <span>→</span>
              </a>

            </div>

            <div className="event-editorial-media">
              <EventSlider
                images={weddingImages}
              />
            </div>

          </section>
        )}

      </div>

      {/* ===================================================
          FINAL CTA
          =================================================== */}

      {isVisible(
        "private-events-cta"
      ) && (
        <section className="events-page-enquiry">

          <p
            className="eyebrow"
            style={cmsStyle(
              "private-events-cta",
              "eyebrow"
            )}
          >
            {finalCta?.eyebrow ||
              "ÖZEL DAVETLER · YALIKAVAK"}
          </p>

          <h2
            style={cmsStyle(
              "private-events-cta",
              "heading"
            )}
          >
            {finalCta?.heading
              ? renderLines(
                  finalCta.heading
                )
              : (
                <>
                  Birlikte
                  <br />
                  planlayalım.
                </>
              )}
          </h2>

          <p
            style={cmsStyle(
              "private-events-cta",
              "text"
            )}
          >
            {finalCta?.body
              ? renderLines(
                  finalCta.body
                )
              : (
                <>
                  Etkinliğinizin türünü,
                  tarihini ve tahmini misafir
                  sayısını bize iletin.
                  Ekibimiz sizinle iletişime
                  geçsin.
                </>
              )}
          </p>

          <div className="events-page-enquiry-actions">

            <a
              href={
                finalCta?.buttonLink ||
                whatsappHref
              }
              target="_blank"
              rel="noopener noreferrer"
              className="events-page-primary-button"
            >
              {finalCta?.buttonLabel ||
                "WHATSAPP'TAN YAZIN"}
            </a>

            <a
              href="mailto:reservation.bodrum@lalara.com.tr"
              className="line-link"
            >
              E-POSTA GÖNDER{" "}
              <span>→</span>
            </a>

          </div>

        </section>
      )}

      {/* ===================================================
          FOOTER
          =================================================== */}

      <Footer locale="tr" />

    </main>
  );
}