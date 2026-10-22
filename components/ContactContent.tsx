"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import Image from "next/image";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import { useSiteContent } from "@/lib/cms/useSiteContent";
import { contactOriginals } from "@/lib/cms/contact";
import Footer from "@/components/Footer";


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

export type ContactMedia = {
  hero: string;
  reservation: string;
};

type ContactContentProps = {
  initialMedia: ContactMedia;
};

const DEFAULT_CONTACT: ContactSettings = {
  address: "Geriş Mah., 2026. Sokak No:5",
  city: "Yalıkavak, 48990 Bodrum\nMuğla · Türkiye",
  phone: "+90 545 894 18 38",
  email: "reservation.bodrum@lalara.com.tr",
  whatsapp: "905458941838",
  instagram:
    "https://www.instagram.com/lalara.bodrum/",
  facebook:
    "https://www.facebook.com/lalararestaurant",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g312738-d24780161-Reviews-La_Lara_Restaurant_Bar-Yalikavak_Bodrum_District_Mugla_Province_Turkish_Aegean_C.html",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=La+Lara+Restaurant+Yalikavak+Bodrum",
  mapEmbedUrl:
    "https://www.google.com/maps?q=La+Lara+Restaurant+Yalikavak+Bodrum&output=embed",
};

function normalizePhoneForTel(
  value: string
) {
  return value.replace(/[^\d+]/g, "");
}

function normalizeWhatsApp(
  value: string
) {
  return value.replace(/\D/g, "");
}

function renderLines(value = "") {
  return value
    .split("\n")
    .map((line, index, all) => (
      <span key={`${line}-${index}`}>
        {line}
        {index < all.length - 1 && (
          <br />
        )}
      </span>
    ));
}

function ExternalArrow() {
  return (
    <span
  aria-hidden="true"
  style={{
    marginLeft: "4px",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "0.9em",
    fontWeight: 400,
  }}
>
  {"→\uFE0E"}
</span>
  );
}

function cleanExternalArrowLabel(value: string) {
  return value.replace(/[↗➡⬈⤴︎️]/g, "").replace(/\s+/g, " ").trim();
}

export default function ContactContent({
  initialMedia,
}: ContactContentProps) {

  const [contact, setContact] =
    useState<ContactSettings>(
      DEFAULT_CONTACT
    );

  /*
   * MEDIA IS ALREADY AVAILABLE
   * ON THE FIRST RENDER.
   */
  const contactHero =
    initialMedia.hero;

  const reservationImage =
    initialMedia.reservation;

  useEffect(() => {
    async function loadContactSettings() {
      try {
        const contactSnapshot = await getDoc(doc(db, "siteSettings", "contact"));

        if (contactSnapshot.exists()) {
          const data = contactSnapshot.data() as ContactSettings;
          setContact({
            ...DEFAULT_CONTACT,
            ...data,
          });
        }
      } catch (error) {
        console.error("Contact settings load error:", error);
      }
    }

    loadContactSettings();
  }, []);

  const { ready, getContent, isVisible, styleFor } = useSiteContent({
    locale: "en",
    originals: contactOriginals.en,
  });

  const hero = getContent("contact-hero");

  const information =
    getContent(
      "contact-information"
    );

  const reservations =
    getContent("reservations");

  const social =
    getContent("social");

  const map =
    getContent("contact-map");

  const reservationCta =
    getContent("reservation-cta");

  const phone =
    contact.phone ||
    DEFAULT_CONTACT.phone!;

  const email =
    contact.email ||
    DEFAULT_CONTACT.email!;

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
    "Hello La Lara, I would like to request a reservation.\n\nDate:\nTime:\nNumber of guests:";

  const whatsappReservationUrl =
    `https://wa.me/${whatsapp}?text=` +
    encodeURIComponent(
      reservationMessage
    );

  return (
    <main className="contact-page">

      <Header locale="en" />

      <div style={{ visibility: ready ? "visible" : "hidden" }} aria-busy={!ready}>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section
        className="contact-hero"
        style={{
          background: "transparent",
        }}
      >
        <Image
          src={contactHero}
          alt="La Lara Restaurant & Bar Yalıkavak Bodrum"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="cover"
        />

        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          <p className="eyebrow light" style={styleFor("contact-hero", "eyebrow")}>
            {hero?.eyebrow}
          </p>

          <h1 style={styleFor("contact-hero", "heading")}>
            {renderLines(hero?.heading)}
          </h1>

          <p style={styleFor("contact-hero", "text")}>
            {renderLines(hero?.body)}
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT INFORMATION
          ===================================================== */}

      {isVisible(
        "contact-information"
      ) && (
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
                {information?.eyebrow}
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
              style={{
                fontFamily: '"Iowan Old Style", Baskerville, "Times New Roman", serif',
                fontSize: "clamp(44px, 5.8vw, 78px)",
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: "-0.05em",
                ...styleFor("contact-information", "heading"),
              }}
            >
              {renderLines(information?.heading)}
            </h2>
          </div>

          {information?.body && (
            <div
              style={{
                ...styleFor(
                  "contact-information",
                  "text"
                ),
                whiteSpace:
                  "pre-line",
                marginBottom:
                  "48px",
              }}
            >
              {information.body}
            </div>
          )}

          <div className="contact-columns">

            {/* VISIT */}

            <div className="contact-column">
              <span className="contact-label">
                Visit
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
                Get directions <ExternalArrow />
              </a>
            </div>

            {/* RESERVATIONS */}

            {isVisible(
              "reservations"
            ) && (
              <div className="contact-column">
                <span
                  className="contact-label"
                  style={styleFor(
                    "reservations",
                    "eyebrow"
                  )}
                >
                  {reservations?.eyebrow}
                </span>

                <h3
                  style={styleFor(
                    "reservations",
                    "heading"
                  )}
                >
                  {reservations?.heading}
                </h3>

                <p
                  style={styleFor(
                    "reservations",
                    "text"
                  )}
                >
                  {renderLines(reservations?.body)}
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

            {isVisible(
              "social"
            ) && (
              <div className="contact-column">
                <span
                  className="contact-label"
                  style={styleFor(
                    "social",
                    "eyebrow"
                  )}
                >
                  {social?.eyebrow}
                </span>

                <h3
                  style={styleFor(
                    "social",
                    "heading"
                  )}
                >
                  {social?.heading}
                </h3>

                <p
                  style={styleFor(
                    "social",
                    "text"
                  )}
                >
                  {renderLines(social?.body)}
                </p>

                <div className="footer-social contact-follow-social">

                  {/* INSTAGRAM */}

                  {contact.instagram && (
                    <a
                      href={
                        contact.instagram
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="La Lara on Instagram"
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
                      href={
                        contact.facebook
                      }
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
                  )}

                  {/* TRIPADVISOR */}

                  {contact.tripadvisor && (
                    <a
                      href={
                        contact.tripadvisor
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="La Lara on Tripadvisor"
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
          RESERVATION CTA
          ===================================================== */}

      {isVisible(
        "reservation-cta"
      ) && (
        <section className="contact-reservation">

          <Image
            src={reservationImage}
            alt="Dining at La Lara Restaurant Yalıkavak"
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
              {reservationCta?.eyebrow}
            </p>

            <h2
              style={styleFor(
                "reservation-cta",
                "heading"
              )}
            >
              {renderLines(reservationCta?.heading)}
            </h2>

            <p
              style={styleFor(
                "reservation-cta",
                "text"
              )}
            >
              {renderLines(reservationCta?.body)}
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
                {reservationCta?.buttonLabel}
              </a>

              <a
                href={`mailto:${email}`}
                className="line-link light-link"
              >
                Email us
              </a>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          MAP
          ===================================================== */}

      {isVisible(
        "contact-map"
      ) && (
        <section className="contact-map">
          <div className="contact-map-heading">
            <p
              className="eyebrow"
              style={styleFor(
                "contact-map",
                "eyebrow"
              )}
            >
              {map?.eyebrow}
            </p>

            <h2
              style={styleFor(
                "contact-map",
                "heading"
              )}
            >
              {renderLines(map?.heading)}
            </h2>

            {map?.body && (
              <p
                style={styleFor(
                  "contact-map",
                  "text"
                )}
              >
                {renderLines(
                  map.body
                )}
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
              {cleanExternalArrowLabel(map?.buttonLabel || "")}{" "}
              <ExternalArrow />
            </a>
          </div>

          <div className="contact-map-frame">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="La Lara Restaurant & Bar location in Yalıkavak Bodrum"
            />
          </div>
        </section>
      )}

            </div>

      <Footer locale="en" />

    </main>
  );
}