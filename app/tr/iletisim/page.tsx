"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

type ContactSettings = {
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tripadvisor?: string;
  mapsUrl?: string;
  mapEmbedUrl?: string;
};

type MediaSettings = {
  images?: {
    contactHero?: {
      url?: string;
    };
    contactReservation?: {
      url?: string;
    };
  };
};

const DEFAULT_CONTACT: ContactSettings = {
  address: "Geriş Mah., 2026. Sokak No:5",
  city: "Yalıkavak, 48990 Bodrum\nMuğla · Türkiye",
  phone: "+90 545 894 18 38",
  email: "reservation.bodrum@lalara.com.tr",
  whatsapp: "905458941838",
  instagram: "https://www.instagram.com/lalara.bodrum/",
  facebook: "https://www.facebook.com/lalararestaurant",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum",
  mapEmbedUrl:
    "https://www.google.com/maps?q=La+Lara+Restaurant+Yalikavak+Bodrum&output=embed",
};

function normalizePhoneForTel(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function normalizeWhatsApp(value: string) {
  return value.replace(/\D/g, "");
}

function renderLines(value: string) {
  return value.split("\n").map((line, index, all) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < all.length - 1 && <br />}
    </span>
  ));
}

export default function IletisimPage() {
  const [cms, setCms] =
    useState<Record<string, CmsRecord>>({});

  const [contact, setContact] =
    useState<ContactSettings>(DEFAULT_CONTACT);

  const [contactHero, setContactHero] =
    useState("/images/home/6.jpg");

  const [reservationImage, setReservationImage] =
    useState("/images/home/1.jpg");

  useEffect(() => {
    async function loadCms() {
      try {
        /* =====================================================
           WEBSITE CONTENT
           ===================================================== */

        const snapshot = await getDocs(
          collection(db, "siteContent")
        );

        const next: Record<string, CmsRecord> = {};

        snapshot.forEach((item) => {
          const data = item.data() as CmsRecord;

          if (
            item.id.startsWith("tr-") &&
            data.status === "published"
          ) {
            next[item.id.replace("tr-", "")] = data;
          }
        });

        setCms(next);

        /* =====================================================
           CONTACT SETTINGS
           ===================================================== */

        const contactSnapshot = await getDoc(
          doc(db, "siteSettings", "contact")
        );

        if (contactSnapshot.exists()) {
          const data =
            contactSnapshot.data() as ContactSettings;

          setContact({
            ...DEFAULT_CONTACT,
            ...data,
          });
        }

        /* =====================================================
           MEDIA SETTINGS
           ===================================================== */

        const mediaSnapshot = await getDoc(
          doc(db, "siteSettings", "media")
        );

        if (mediaSnapshot.exists()) {
          const media =
            mediaSnapshot.data() as MediaSettings;

          setContactHero(
            media.images?.contactHero?.url ||
              "/images/home/6.jpg"
          );

          setReservationImage(
            media.images?.contactReservation?.url ||
              "/images/home/1.jpg"
          );
        }
      } catch (error) {
        console.error(
          "TR Contact CMS load error:",
          error
        );
      }
    }

    loadCms();
  }, []);

  function content(key: string) {
    return cms[key];
  }

  function isVisible(key: string) {
    return cms[key]?.visible !== false;
  }

  function styleFor(
    key: string,
    kind:
      | "eyebrow"
      | "heading"
      | "text"
      | "button"
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
      ...(size
        ? {
            fontSize: `${size}px`,
          }
        : {}),

      ...(item.fontFamily
        ? {
            fontFamily:
              item.fontFamily === "sans"
                ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
                : '"Iowan Old Style", Baskerville, "Times New Roman", serif',
          }
        : {}),

      ...(item.fontWeight
        ? {
            fontWeight: item.fontWeight,
          }
        : {}),

      ...(item.lineHeight
        ? {
            lineHeight: item.lineHeight,
          }
        : {}),

      ...(item.letterSpacing !== undefined
        ? {
            letterSpacing: `${item.letterSpacing}px`,
          }
        : {}),
    };
  }

  /*
   * Admin → Website → Contact → TR
   *
   * Contact Hero
   * → tr-contact-hero
   *
   * Contact Information
   * → tr-contact-information
   *
   * Reservations
   * → tr-reservations
   *
   * Social
   * → tr-social
   *
   * Contact Map
   * → tr-contact-map
   *
   * Reservation CTA
   * → tr-reservation-cta
   */

  
  const information = content("contact-information");
  const reservations = content("reservations");
  const social = content("social");
  const map = content("contact-map");
  const reservationCta = content("reservation-cta");

  const phone =
    contact.phone || DEFAULT_CONTACT.phone!;

  const email =
    contact.email || DEFAULT_CONTACT.email!;

  const whatsapp =
    normalizeWhatsApp(
      contact.whatsapp ||
        DEFAULT_CONTACT.whatsapp!
    ) || "905458941838";

  const mapsUrl =
    contact.mapsUrl ||
    DEFAULT_CONTACT.mapsUrl!;

  const mapEmbedUrl =
    contact.mapEmbedUrl ||
    DEFAULT_CONTACT.mapEmbedUrl!;

  const reservationMessage =
    "Merhaba La Lara, rezervasyon talebinde bulunmak istiyorum.\n\nTarih:\nSaat:\nKişi sayısı:";

  const whatsappReservationUrl =
    `https://wa.me/${whatsapp}?text=` +
    encodeURIComponent(reservationMessage);

  return (
    <main className="contact-page">
      <Header locale="tr" />

     {/* =====================================================
    HERO
    ===================================================== */}

<section className="contact-hero">
  <Image
    src={contactHero}
    alt="La Lara Restaurant & Bar Yalıkavak Bodrum"
    fill
    priority
    sizes="100vw"
    className="cover"
  />

  <div className="contact-hero-overlay" />

  <div className="contact-hero-content">
    <p className="eyebrow light">
      La Lara · Yalıkavak
    </p>

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

      {/* =====================================================
          CONTACT INFORMATION
          ===================================================== */}

      {isVisible("contact-information") && (
        <section className="contact-main">
          <div className="contact-heading">
            <div>
              <p
                className="eyebrow"
                style={styleFor(
                  "contact-information",
                  "eyebrow"
                )}
              >
                {information?.eyebrow ||
                  "İletişim"}
              </p>

              <span
                style={styleFor(
                  "contact-information",
                  "text"
                )}
              >
                Yalıkavak · Bodrum
              </span>
            </div>

            <h2
              style={styleFor(
                "contact-information",
                "heading"
              )}
            >
              {information?.heading
                ? renderLines(
                    information.heading
                  )
                : (
                  <>
                    Sizi La Lara&apos;da
                    <br />
                    görmek isteriz.
                  </>
                )}
            </h2>
          </div>

          {information?.body && (
            <div
              style={{
                ...styleFor(
                  "contact-information",
                  "text"
                ),
                whiteSpace: "pre-line",
                marginBottom: "48px",
              }}
            >
              {information.body}
            </div>
          )}

          <div className="contact-columns">
            {/* ADDRESS */}

            <div className="contact-column">
              <span className="contact-label">
                Adres
              </span>

              <h3>La Lara</h3>

              <p>
                {contact.address ||
                  DEFAULT_CONTACT.address}

                <br />

                {renderLines(
                  contact.city ||
                    DEFAULT_CONTACT.city!
                )}
              </p>

              <a
                className="contact-text-link"
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Yol tarifi al ↗
              </a>
            </div>

            {/* RESERVATIONS */}

            {isVisible("reservations") && (
              <div className="contact-column">
                <span
                  className="contact-label"
                  style={styleFor(
                    "reservations",
                    "eyebrow"
                  )}
                >
                  {reservations?.eyebrow ||
                    "Rezervasyon"}
                </span>

                <h3
                  style={styleFor(
                    "reservations",
                    "heading"
                  )}
                >
                  {reservations?.heading ||
                    "Masa ayırtın"}
                </h3>

                <p
                  style={styleFor(
                    "reservations",
                    "text"
                  )}
                >
                  {reservations?.body
                    ? renderLines(
                        reservations.body
                      )
                    : (
                      <>
                        Rezervasyon ve bilgi için
                        <br />
                        bizi arayabilir veya
                        e-posta gönderebilirsiniz.
                      </>
                    )}
                </p>

                <a
                  className="contact-primary-link"
                  href={`tel:${normalizePhoneForTel(
                    phone
                  )}`}
                >
                  {phone}
                </a>

                <a
                  className="contact-text-link"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              </div>
            )}

            {/* SOCIAL */}

            {isVisible("social") && (
              <div className="contact-column">
                <span
                  className="contact-label"
                  style={styleFor(
                    "social",
                    "eyebrow"
                  )}
                >
                  {social?.eyebrow ||
                    "Takip Et"}
                </span>

                <h3
                  style={styleFor(
                    "social",
                    "heading"
                  )}
                >
                  {social?.heading ||
                    "Bağlantıda kalın"}
                </h3>

                <p
                  style={styleFor(
                    "social",
                    "text"
                  )}
                >
                  {social?.body
                    ? renderLines(social.body)
                    : (
                      <>
                        La Lara&apos;dan lezzetler,
                        gün batımları
                        <br />
                        ve Yalıkavak&apos;tan anlar.
                      </>
                    )}
                </p>

                <div className="footer-social contact-follow-social">
                  {/* INSTAGRAM */}

                  {contact.instagram && (
                    <a
                      href={contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="La Lara Instagram"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                        />

                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                        />

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
                  )}

                  {/* FACEBOOK */}

                  {contact.facebook && (
                    <a
                      href={contact.facebook}
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

                      <span className="social-name">
                        Facebook
                      </span>
                    </a>
                  )}

                  {/* TRIPADVISOR */}

                  {contact.tripadvisor && (
                    <a
                      href={
                        contact.tripadvisor
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="La Lara Tripadvisor"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          cx="7"
                          cy="13"
                          r="4"
                        />

                        <circle
                          cx="17"
                          cy="13"
                          r="4"
                        />

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
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          MAP
          ===================================================== */}

      {isVisible("contact-map") && (
        <section className="contact-map">
          <div className="contact-map-heading">
            <p
              className="eyebrow"
              style={styleFor(
                "contact-map",
                "eyebrow"
              )}
            >
              {map?.eyebrow || "Konum"}
            </p>

            <h2
              style={styleFor(
                "contact-map",
                "heading"
              )}
            >
              {map?.heading
                ? renderLines(map.heading)
                : (
                  <>
                    Yalıkavak&apos;ın
                    <br />
                    kalbinde.
                  </>
                )}
            </h2>

            {map?.body && (
              <p
                style={styleFor(
                  "contact-map",
                  "text"
                )}
              >
                {renderLines(map.body)}
              </p>
            )}

            <a
              href={
                map?.buttonLink ||
                mapsUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
              style={styleFor(
                "contact-map",
                "button"
              )}
            >
              {map?.buttonLabel ||
                "Google Maps'te Aç ↗"}
            </a>
          </div>

          <div className="contact-map-frame">
            <iframe
              src={mapEmbedUrl}
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
      )}

      {/* =====================================================
          RESERVATION CTA
          ===================================================== */}

      {isVisible("reservation-cta") && (
        <section className="contact-reservation">
          <Image
            src={reservationImage}
            alt="La Lara Restaurant Yalıkavak'ta yemek deneyimi"
            fill
            sizes="100vw"
            className="cover"
          />

          <div className="contact-reservation-overlay" />

          <div className="contact-reservation-content">
            <p
              className="eyebrow light"
              style={styleFor(
                "reservation-cta",
                "eyebrow"
              )}
            >
              {reservationCta?.eyebrow ||
                "Rezervasyon"}
            </p>

            <h2
              style={styleFor(
                "reservation-cta",
                "heading"
              )}
            >
              {reservationCta?.heading
                ? renderLines(
                    reservationCta.heading
                  )
                : (
                  <>
                    Masanız
                    <br />
                    sizi bekliyor.
                  </>
                )}
            </h2>

            <p
              style={styleFor(
                "reservation-cta",
                "text"
              )}
            >
              {reservationCta?.body
                ? renderLines(
                    reservationCta.body
                  )
                : (
                  <>
                    Manzara için gelin. Yemek,
                    insanlar
                    <br />
                    ve gece için kalın.
                  </>
                )}
            </p>

            <div className="contact-actions">
              <a
                className="outline-button"
                href={
                  reservationCta?.buttonLink ||
                  whatsappReservationUrl
                }
                target="_blank"
                rel="noopener noreferrer"
                style={styleFor(
                  "reservation-cta",
                  "button"
                )}
              >
                {reservationCta?.buttonLabel ||
                  "REZERVASYON TALEBİ"}
              </a>

              <a
                href={`mailto:${email}`}
                className="line-link light-link"
              >
                E-posta gönder
              </a>
            </div>
          </div>
        </section>
      )}

      <Footer locale="tr" />
    </main>
  );
}