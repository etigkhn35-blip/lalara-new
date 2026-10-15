"use client";

import Image from "next/image";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventSlider from "@/components/EventSlider";

export default function PrivateEventsPage() {
  const whatsappHref =
    "https://wa.me/905458941838?text=" +
    encodeURIComponent(
      "Hello La Lara, I would like to enquire about hosting a private event.\n\nEvent type:\nPreferred date:\nNumber of guests:"
    );

  const loungeImages = [
    {
      src: "/images/home/4.jpg",
      alt: "Private events at La Lara Lounge",
    },
    {
      src: "/images/home/5.jpg",
      alt: "La Lara Lounge Yalıkavak",
    },
    {
      src: "/images/home/6.jpg",
      alt: "La Lara Lounge event space",
    },
  ];

  const privateEventImages = [
    {
      src: "/images/home/7.jpg",
      alt: "Private occasions at La Lara",
    },
    {
      src: "/images/home/2.jpg",
      alt: "Private dining at La Lara Restaurant",
    },
    {
      src: "/images/home/3.jpg",
      alt: "Private celebration at La Lara Yalıkavak",
    },
  ];

  const weddingImages = [
    {
      src: "/images/home/8.jpg",
      alt: "Boutique wedding at La Lara",
    },
    {
      src: "/images/home/1.jpg",
      alt: "Wedding celebration in Yalıkavak",
    },
    {
      src: "/images/home/9.jpg",
      alt: "Private wedding celebration at La Lara",
    },
  ];

  return (
    <main className="events-page">
      <Header locale="en" />

      {/* HERO */}

      <section className="events-page-hero">
        <Image
          src="/images/home/8.jpg"
          alt="Private events at La Lara Yalıkavak"
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
            Special Moments,
            <br />
            at La Lara.
          </h1>

          <p>
            From intimate gatherings to private
            celebrations, a beautiful setting in
            Yalıkavak for the moments worth remembering.
          </p>

          <a
            href="#events"
            className="outline-button"
          >
            DISCOVER EVENTS
          </a>
        </div>
      </section>

      {/* INTRO */}

      <section className="events-editorial-intro">
        <p className="eyebrow">
          PRIVATE EVENTS
        </p>

        <h2>
          Every celebration
          <br />
          has its own story.
        </h2>

        <p>
          Whether it is an intimate evening, a special
          celebration or one of life&apos;s most important
          occasions, we approach every event at La Lara
          with its own character.
        </p>
      </section>

      {/* EVENTS */}

      <div
        id="events"
        className="events-editorial-list"
      >
        {/* 01 */}

        <section className="event-editorial-row">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              01
            </div>

            <p className="eyebrow">
              LA LARA LOUNGE
            </p>

            <h2>
              Intimate
              <br />
              Events
            </h2>

            <div className="event-editorial-text">
              <p>
                With its warm and welcoming atmosphere,
                La Lara Lounge offers a versatile setting
                for social gatherings and private
                celebrations.
              </p>

              <p>
                From relaxed evenings with friends to
                private parties, the space can be adapted
                to suit the character of your occasion.
              </p>

              <p>
                Its comfortable and informal atmosphere
                works beautifully for everything from
                afternoon gatherings to long evenings
                together.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              ENQUIRE ABOUT THIS EVENT{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={loungeImages} />
          </div>
        </section>

        {/* 02 */}

        <section className="event-editorial-row is-reversed">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              02
            </div>

            <p className="eyebrow">
              LA LARA RESTAURANT &amp; BAR
            </p>

            <h2>
              Private
              <br />
              Occasions
            </h2>

            <div className="event-editorial-text">
              <p>
                Selected areas of La Lara can be arranged
                for private occasions, creating a more
                personal setting for you and your guests.
              </p>

              <p>
                Romantic dinners, anniversaries,
                proposals, birthdays and gatherings with
                family, friends or colleagues can all be
                celebrated in a warm and elegant
                atmosphere.
              </p>

              <p>
                Our team will work with you to understand
                the occasion and help shape an experience
                around your plans.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              PLAN YOUR OCCASION{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={privateEventImages} />
          </div>
        </section>

        {/* 03 */}

        <section className="event-editorial-row">
          <div className="event-editorial-copy">
            <div className="event-editorial-number">
              03
            </div>

            <p className="eyebrow">
              YALIKAVAK · BODRUM
            </p>

            <h2>
              Boutique
              <br />
              Weddings
            </h2>

            <div className="event-editorial-text">
              <p>
                Celebrate one of life&apos;s most special
                moments in the atmosphere of Yalıkavak,
                surrounded by the people who matter most.
              </p>

              <p>
                La Lara brings together warm hospitality,
                thoughtful food and its distinctive
                setting for boutique weddings and
                personal celebrations.
              </p>

              <p>
                Tell us about the day you imagine and
                we&apos;ll explore the event details, dining
                options and flow of the celebration with
                you.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="line-link"
            >
              WEDDING ENQUIRIES{" "}
              <span>→</span>
            </a>
          </div>

          <div className="event-editorial-media">
            <EventSlider images={weddingImages} />
          </div>
        </section>
      </div>

      {/* FINAL CTA */}

      <section className="events-page-enquiry">
        <p className="eyebrow">
          PRIVATE EVENTS · YALIKAVAK
        </p>

        <h2>
          Let&apos;s plan
          <br />
          it together.
        </h2>

        <p>
          Tell us the type of event, preferred date and
          approximate number of guests and our team will
          help with the next steps.
        </p>

        <div className="events-page-enquiry-actions">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="events-page-primary-button"
          >
            MESSAGE ON WHATSAPP
          </a>

          <a
            href="mailto:reservation.bodrum@lalara.com.tr"
            className="line-link"
          >
            EMAIL US <span>→</span>
          </a>
        </div>
      </section>

      <Footer locale="en" />
    </main>
  );
}