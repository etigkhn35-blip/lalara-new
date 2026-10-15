import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Story | La Lara Restaurant & Bar Yalıkavak",
  description:
    "Discover the family story behind La Lara Restaurant & Bar in Yalıkavak, Bodrum — the woman behind the name, the pink elephant and the memories that inspired La Lara.",
};

export default function OurStoryPage() {
  return (
    <main className="story-page">
      {/* HEADER */}
      <Header locale="en" />

      {/* HERO */}
      <section className="story-page-hero">
        <Image
          src="/images/home/7.jpg"
          alt="The family story behind La Lara Restaurant & Bar"
          fill
          priority
          sizes="100vw"
          className="cover"
        />

        <div className="image-overlay" />

        <div className="story-page-hero-content">
          <p className="eyebrow light">La Lara · Yalıkavak</p>

          <h1>Our Story</h1>

          <p>
            The people, the memories and the little things
            <br />
            that made La Lara.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="story-page-intro">
        <p className="eyebrow">Where It Began</p>

        <h2>
          The Woman
          <br />
          Behind the Name
        </h2>

        <p className="story-page-lead">
          Every family has someone who brings everyone together.
          <br />
          In ours, that person was Lara.
        </p>
      </section>

      {/* LARA */}
      <section className="story-page-section story-page-section-lara">
        <div className="story-page-image">
          <Image
            src="/images/home/7.jpg"
            alt="The story of Lara and the inspiration behind La Lara"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="cover"
          />
        </div>

        <div className="story-page-copy">
          <p className="eyebrow">01 · Lara</p>

          <h2>
            Warm, spirited
            <br />
            and full of character.
          </h2>

          <p>
            Our grandmother was far from ordinary. She was a career
            woman with a strong personality, an unmistakable sense of
            style and, we must admit, a little bit of a diva.
          </p>

          <p>
            She loved to cook, but what she enjoyed even more was
            having people around her table.
          </p>

          <p>
            There was always room for another guest, another story,
            another conversation. Meals had a wonderful habit of
            lasting longer than planned. People came together to
            laugh, to share news, sometimes to solve a problem, and
            always to enjoy something delicious.
          </p>

          <p>
            For Lara, hospitality was never about making a grand
            impression. It was about making people feel welcome,
            comfortable and cared for.
          </p>

          <p>And somehow, she made it look effortless.</p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="story-page-quote">
        <p>
          “When we began imagining our own restaurant,
          <br />
          we kept returning to those memories.”
        </p>
      </section>

      {/* MEMORY */}
      <section className="story-page-section story-page-section-reverse">
        <div className="story-page-copy">
          <p className="eyebrow">A Place of Our Own</p>

          <h2>
            Carrying the
            <br />
            feeling forward.
          </h2>

          <p>
            Not because we wanted to recreate her home, but because
            we wanted to bring that same feeling to a new place.
          </p>

          <p>
            A place where good food brings people together. Where
            conversations are never rushed. Where the atmosphere
            feels elegant without ever feeling formal.
          </p>

          <p>Warm, spirited and full of character.</p>

          <p>Just like Lara.</p>
        </div>

        <div className="story-page-image">
          <Image
            src="/images/home/2.jpg"
            alt="La Lara Restaurant atmosphere in Yalıkavak"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className="cover"
          />
        </div>
      </section>

      {/* PINK ELEPHANT */}
      <section className="story-page-elephant">
        <div className="story-page-elephant-heading">
          <p className="eyebrow">A Little Family Tradition</p>

          <h2>
            May You Dream
            <br />
            of Pink Elephants
          </h2>
        </div>

        <div className="story-page-elephant-grid">
          <div
            className="story-page-elephant-mark"
            aria-hidden="true"
          >
            <Image
              src="/pink-elephant.ico"
              alt=""
              width={150}
              height={150}
            />
          </div>

          <div className="story-page-elephant-copy">
            <p>
              There is one little phrase from our childhood that has
              stayed with us all these years.
            </p>

            <p>
              Every night, before we went to sleep, our grandmother
              would say:
            </p>

            <blockquote>
              “May you dream of pink elephants.”
            </blockquote>

            <p>
              We never questioned it much back then. It was simply
              something Lara said — a little unusual, a little
              mysterious and completely her own.
            </p>

            <p>
              As children, we loved it without needing to understand
              it.
            </p>

            <p>
              Today, those words have taken on a new meaning for us.
            </p>

            <p>
              To dream of pink elephants is to keep a little wonder
              in your life. To stay curious. To see possibilities
              where others might not. To never become too grown-up
              to dream of something extraordinary.
            </p>

            <p>
              And so, the pink elephant found its way into La Lara.
            </p>

            <p>
              To someone discovering it for the first time, it may
              seem like a playful, unexpected symbol.
            </p>

            <p>
              To us, it is something much more personal.
            </p>

            <p>
              A memory of our grandmother. A little piece of
              childhood. And a reminder that the things we love most
              do not always need an explanation.
            </p>
          </div>
        </div>
      </section>

      {/* PEOPLE */}
      <section className="story-page-people">
        <div className="story-page-people-image">
          <Image
            src="/images/home/8.jpg"
            alt="Family-inspired hospitality at La Lara"
            fill
            sizes="100vw"
            className="cover"
          />

          <div className="image-overlay" />
        </div>

        <div className="story-page-people-content">
          <p className="eyebrow light">
            The People Behind Our Story
          </p>

          <h2>
            More than
            <br />
            one name.
          </h2>

          <div className="story-page-people-copy">
            <p>
              Although La Lara carries our grandmother&apos;s name,
              its story reaches beyond one person.
            </p>

            <p>
              It belongs to the family tables we grew up around, the
              kitchens that welcomed us, the conversations we still
              remember and the grandparents who shaped the way we
              see the world.
            </p>

            <p>
              Each of them left us something that no recipe could
              ever capture: the understanding that sharing a meal is
              about so much more than food.
            </p>

            <p>
              La Lara is our way of carrying those memories forward,
              while creating new ones with the people who join us.
            </p>

            <p>
              And, in its own small way, it is a thank you.
            </p>

            <strong>
              To Lara, Vova, Vitali &amp; Raya.
            </strong>

            <em>With love, from our family to yours.</em>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="story-page-cta">
        <p className="eyebrow">La Lara · Yalıkavak</p>

        <h2>
          Come and make
          <br />
          your own memories.
        </h2>

        <div className="story-page-cta-actions">
          <Link href="/#menus" className="line-link">
            VIEW OUR MENUS <span>→</span>
          </Link>

          <a
            href="https://wa.me/905458941838?text=Hello%20La%20Lara%2C%20I%20would%20like%20to%20request%20a%20reservation."
            target="_blank"
            rel="noopener noreferrer"
            className="outline-button story-page-dark-button"
          >
            RESERVE A TABLE
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <Footer locale="en" />
    </main>
  );
}