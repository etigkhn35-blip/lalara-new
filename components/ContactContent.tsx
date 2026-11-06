
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/lib/cms/useSiteContent";
import { contactOriginals } from "@/lib/cms/contact";

import "./contact-reference.css";

export type ContactMedia = {
  hero: string;
  reservation: string;
  event?: string;
  social?: string;
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

function renderLines(value = "") {
  return value.split("\n").map((line, index, all) => (
    <span key={index}>
      {line}
      {index < all.length - 1 && <br />}
    </span>
  ));
}

function ContactPhoto({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  return (
    <div className="contact-ref-photo">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 800px) 100vw, 55vw"
          className="contact-ref-image"
        />
      ) : (
        <div className="contact-ref-placeholder">
          IMAGE
        </div>
      )}
    </div>
  );
}

export default function ContactContent({
  initialMedia,
}: {
  initialMedia: ContactMedia;
}) {
  // Keep server-provided images until the live Firestore document arrives.
  const [media, setMedia] = useState<ContactMedia>(() => ({
    hero: initialMedia?.hero ?? "",
    reservation: initialMedia?.reservation ?? "",
    event: initialMedia?.event ?? "",
    social: initialMedia?.social ?? "",
  }));

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "pageMedia", "contact"),
      (snapshot) => {
        if (!snapshot.exists()) return;
        const fields = snapshot.data()?.fields;
        if (!fields || typeof fields !== "object") return;
        setMedia((previous) => ({
          hero: typeof fields.hero === "string" ? fields.hero : previous.hero,
          reservation: typeof fields.reservation === "string" ? fields.reservation : previous.reservation,
          event: typeof fields.event === "string" ? fields.event : previous.event,
          social: typeof fields.social === "string" ? fields.social : previous.social,
        }));
      },
      (error) => console.error("Contact media subscription error:", error)
    );
    return () => unsubscribe();
  }, []);

  const [contact, setContact] =
    useState<ContactSettings>(DEFAULT_CONTACT);

  useEffect(() => {
    async function loadSettings() {
      try {
        const snapshot = await getDoc(
          doc(db, "siteSettings", "contact")
        );

        if (snapshot.exists()) {
          setContact({
            ...DEFAULT_CONTACT,
            ...(snapshot.data() as ContactSettings),
          });
        }
      } catch (error) {
        console.error("Contact settings error:", error);
      }
    }

    loadSettings();
  }, []);

  const { ready, getContent, isVisible, styleFor } =
    useSiteContent({
      locale: "en",
      originals: contactOriginals.en,
    });

  const hero = getContent("contact-hero");
  const reservations = getContent("reservations");
  const information = getContent("contact-information");
  const social = getContent("social");
  const map = getContent("contact-map");

  const phone = contact.phone || DEFAULT_CONTACT.phone!;
  const email = contact.email || DEFAULT_CONTACT.email!;
  const whatsapp = (
    contact.whatsapp || DEFAULT_CONTACT.whatsapp!
  ).replace(/\D/g, "");

  const mapsUrl =
    contact.mapsUrl || DEFAULT_CONTACT.mapsUrl!;

  const mapEmbedUrl =
    contact.mapEmbedUrl || DEFAULT_CONTACT.mapEmbedUrl!;

  const whatsappUrl =
    `https://wa.me/${whatsapp}?text=` +
    encodeURIComponent(
      "Hello La Lara, I would like to book a table.\n\nDate:\nTime:\nNumber of guests:"
    );

  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <main className="contact-reference-page">
      <Header locale="en" />

      <div
        style={{ visibility: ready ? "visible" : "hidden" }}
        aria-busy={!ready}
      >
        {/* HERO */}
        {isVisible("contact-hero") && (
          <section className="contact-ref-hero">
            {media.hero && (
              <Image
                src={media.hero}
                alt="La Lara Restaurant overlooking Yalıkavak"
                fill
                priority
                sizes="100vw"
                className="contact-ref-image"
              />
            )}

            <div className="contact-ref-hero-shade" />

            <div className="contact-ref-hero-text">
              {hero?.eyebrow && (
                <p
                  className="contact-ref-eyebrow"
                  style={styleFor("contact-hero", "eyebrow")}
                >
                  {hero.eyebrow}
                </p>
              )}

              <h1 style={styleFor("contact-hero", "heading")}>
                {hero?.heading || "Get In Touch."}
              </h1>

              <p style={styleFor("contact-hero", "text")}>
                {hero?.body || "We'd love to see you."}
              </p>
            </div>
          </section>
        )}

        

        {/* RESERVATIONS */}
        {isVisible("reservations") && (
          <section className="contact-ref-section contact-ref-reservations">
            <div className="contact-ref-copy contact-ref-pink">
              <p
                className="contact-ref-eyebrow"
                style={styleFor("reservations", "eyebrow")}
              >
                {reservations?.eyebrow || "RESERVATIONS"}
              </p>

              <h2 style={styleFor("reservations", "heading")}>
                {reservations?.heading || "Book a table."}
              </h2>

              <p
                className="contact-ref-description"
                style={styleFor("reservations", "text")}
              >
                {renderLines(reservations?.body || "Visit us for breakfast, lunch, dinner, cocktails or just a glass of wine.")}
              </p>

              <div className="contact-ref-links">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WHATSAPP <span>→</span>
                </a>

                <a href={phoneUrl}>
                  CONTACT US <span>→</span>
                </a>
              </div>
            </div>

            <ContactPhoto
              src={media.reservation}
              alt="Dining at La Lara Restaurant"
            />
          </section>
        )}

        

        {/* PRIVATE BOOKINGS */}
        {isVisible("contact-information") && (
          <section className="contact-ref-section contact-ref-events">
            <ContactPhoto
              src={media.event}
              alt="Flowers and private event arrangements at La Lara"
            />

            <div className="contact-ref-copy contact-ref-cream">
              <p
                className="contact-ref-eyebrow"
                style={styleFor("contact-information", "eyebrow")}
              >
                {information?.eyebrow || "PRIVATE BOOKINGS"}
              </p>

              <h2 style={styleFor("contact-information", "heading")}>
                {information?.heading || "Book your next event."}
              </h2>

              <p
                className="contact-ref-description"
                style={styleFor("contact-information", "text")}
              >
                {renderLines(information?.body || "For celebrations bringing people together and all other special moments, our team can help you plan the occasion.")}
              </p>

              <div className="contact-ref-links">
                <a href={`mailto:${email}`}>
                  EMAIL US <span>→</span>
                </a>

                <a href={phoneUrl}>
                  CONTACT US <span>→</span>
                </a>
              </div>
            </div>
          </section>
        )}

        

        {/* SOCIAL */}
        {isVisible("social") && (
          <section className="contact-ref-section contact-ref-social">
            <div className="contact-ref-copy contact-ref-sage">
              <p
                className="contact-ref-eyebrow"
                style={styleFor("social", "eyebrow")}
              >
                {social?.eyebrow || "FOLLOW US"}
              </p>

              <h2 style={styleFor("social", "heading")}>
                {social?.heading || "Stay connected."}
              </h2>

              <p
                className="contact-ref-description"
                style={styleFor("social", "text")}
              >
                {renderLines(social?.body || "Visit our social media channels for seasonal specials, news from La Lara and beautiful views.")}
              </p>

              <div className="contact-ref-links">
                {contact.instagram && (
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    INSTAGRAM <span>→</span>
                  </a>
                )}

                {contact.facebook && (
                  <a
                    href={contact.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FACEBOOK <span>→</span>
                  </a>
                )}

                {contact.tripadvisor && (
                  <a
                    href={contact.tripadvisor}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TRIPADVISOR <span>→</span>
                  </a>
                )}
              </div>
            </div>

            <ContactPhoto
              src={media.social}
              alt="Yalıkavak Bay and La Lara surroundings"
            />
          </section>
        )}

        

        {/* MAP */}
        {isVisible("contact-map") && (
          <section className="contact-ref-section contact-ref-location">
            <div className="contact-ref-map">
              <iframe
                src={mapEmbedUrl}
                title="La Lara Restaurant location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="contact-ref-copy contact-ref-cream">
              <p
                className="contact-ref-eyebrow"
                style={styleFor("contact-map", "eyebrow")}
              >
                {map?.eyebrow || "FIND US"}
              </p>

              <h2 style={styleFor("contact-map", "heading")}>
                {renderLines(
                  map?.heading || "In the hills\nof Yalıkavak."
                )}
              </h2>


              <div className="contact-ref-links">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styleFor("contact-map", "button")}
                >
                  OPEN GOOGLE MAPS <span>→</span>
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer locale="en" />
    </main>
  );
}
