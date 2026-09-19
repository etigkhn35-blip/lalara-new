"use client";

import { useEffect, useMemo, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";

type Language = "EN" | "TR";
type PageType = "Home" | "Contact";

type FormData = {
  eyebrow: string;
  heading: string;
  body: string;
  buttonLabel: string;
  eyebrowSize: number;
  headingSize: number;
  textSize: number;
  buttonSize: number;
  fontFamily: "display" | "sans";
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
};

const homeSections = [
  "Hero",
  "Intro",
  "At the Table",
  "Pink Elephant",
  "People Behind It",
  "Menus",
  "Experience",
  "Our Story",
  "Gallery",
  "Reservation",
];

const contactSections = [
  "Contact Hero",
  "Contact Heading",
  "Contact Visit",
  "Contact Reservations",
  "Contact Follow",
  "Contact Map",
  "Contact Reservation",
];

const blank: FormData = {
  eyebrow: "",
  heading: "",
  body: "",
  buttonLabel: "",
  eyebrowSize: 10,
  headingSize: 72,
  textSize: 12,
  buttonSize: 12,
  fontFamily: "display",
  fontWeight: 400,
  lineHeight: 1.1,
  letterSpacing: 0,
};

const defaults: Record<Language, Record<string, Partial<FormData>>> = {
  EN: {
    "Hero": { eyebrow:"Yalıkavak · Bodrum", heading:"Good food tastes better\nwhen it is shared.", body:"Mediterranean flavours, long conversations\nand evenings made to remember.", buttonLabel:"Reserve a table" },
    "Intro": { eyebrow:"La Lara · Restaurant & Bar", heading:"Created around\na simple idea.", body:"Good food tastes better when it is shared\nwith the people you love.\n\nWith panoramic views over Yalıkavak Bay, La Lara is a place to gather, eat well, talk for hours and enjoy the people around you." },
    "At the Table": { eyebrow:"At the table", heading:"Made for\nsharing.", body:"Inspired by Mediterranean hospitality, our table brings together food, conversation and the effortless rhythm of Yalıkavak.\n\nCome for the food. Stay for the sunset, the stories and the moments that last a little longer.", buttonLabel:"Discover our menus" },
    "Pink Elephant": { eyebrow:"The Pink Elephant", heading:"“May you dream\nof pink elephants”", body:"When we were children, our grandmother always said “May you dream of pink elephants” before we went to bed.\n\nWe never really thought about what it meant. It was simply one of those slightly strange, affectionate things that belonged to her. Personal, playful and a little mysterious.\n\nToday, we like to give her words a new meaning. May you dream of pink elephants — a reminder to stay curious, think beyond the obvious and dream a little bigger.\n\nThe pink elephant became a symbol of our restaurant. To anyone else, it might seem wonderfully random. To us, it carries a little piece of home." },
    "People Behind It": { eyebrow:"The People Behind It", heading:"From a family,\nto a table.", body:"Although Lara gave the restaurant its name, the story belongs to more than one person.\n\nIt is also for all our grandparents who shaped our childhood, whose kitchens we grew up in.\n\nSo this place is, in its own way, a thank you.\n\nTo Lara, Vova, Vitali & Raya." },
    "Menus": { eyebrow:"The Menus", heading:"Food made\nto be shared.", body:"Food — Mediterranean flavours, fresh ingredients and plates created to bring everyone around the table.\n\nDrinks — Cocktails, wine and carefully chosen drinks made for golden hour and long Yalıkavak nights.\n\nBreakfast — Slow mornings, breakfast by the sea and the first light over Yalıkavak Bay.", buttonLabel:"View menus" },
    "Experience": { eyebrow:"The La Lara Experience", heading:"From golden hour\nto late-night dining.", body:"Breakfast. Lunch. Sunset drinks. Dinner.\nAnd no reason to rush." },
    "Our Story": { eyebrow:"Our Story", heading:"A table\ninspired by Lara.", body:"The feeling we wanted to capture at La Lara has its roots in our own family. The restaurant is named after our grandmother, Lara.\n\nShe wasn’t quite the traditional grandmother you might imagine. She was a career woman with a big personality and, admittedly, a touch of diva in her.\n\nShe loved to cook, but even more than that, she loved to host. Her kitchen table was a place for long conversations, stories, laughter and the occasional problem that needed solving. And inevitably, there was also lots of food to share. She showed us what hospitality is really about: making people feel comfortable, cared for and at home.\n\nWhen we began imagining the restaurant, we kept coming back to that feeling. Somewhere to eat well, talk for hours and spend time with the people you love.\n\nLa Lara is inspired by her character - warm, elegant and full of personality. Naming the restaurant after her simply felt right." },
    "Gallery": { eyebrow:"La Lara Moments", heading:"Stay a little\nlonger.", body:"Gather.\nSavor.\nShare." },
    "Reservation": { eyebrow:"Yalıkavak · Bodrum", heading:"Your table\nawaits.", body:"Come for the view. Stay for the food,\nthe people and the night.", buttonLabel:"Book a Table" },

    "Contact Hero": { heading:"Come find\nyour table.", body:"Good food, long conversations\nand Yalıkavak evenings." },
    "Contact Heading": { eyebrow:"Contact", heading:"We'd love\nto see you.", body:"Yalıkavak · Bodrum" },
    "Contact Visit": { eyebrow:"Visit", heading:"La Lara", body:"Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye", buttonLabel:"Get directions ↗" },
    "Contact Reservations": { eyebrow:"Reservations", heading:"Book a table", body:"For reservations and enquiries,\ncall or email our team.", buttonLabel:"Book a Table" },
    "Contact Follow": { eyebrow:"Follow", heading:"Stay connected", body:"Follow La Lara for food,\nsunsets and moments from Yalıkavak." },
    "Contact Map": { eyebrow:"Find Us", heading:"In the heart of\nYalıkavak.", buttonLabel:"Open in Google Maps ↗" },
    "Contact Reservation": { eyebrow:"Reservations", heading:"Your table\nawaits.", body:"Come for the view. Stay for the food,\nthe people and the night.", buttonLabel:"Book a Table" },
  },
  TR: {
    "Hero": { eyebrow:"Yalıkavak · Bodrum", heading:"İyi yemek,\nsevdiklerinle daha güzel.", body:"Akdeniz lezzetleri, uzun sohbetler\nve hatırlanmaya değer akşamlar.", buttonLabel:"Masa ayırt" },
    "Intro": { eyebrow:"La Lara · Restaurant & Bar", heading:"Her şey basit\nbir fikirle başladı.", body:"İyi yemek, sevdiğiniz insanlarla\npaylaşıldığında daha güzeldir.\n\nYalıkavak Körfezi’nin panoramik manzarasına karşı La Lara; bir araya gelmek, güzel yemekler yemek, uzun sohbetler etmek ve sevdiklerinizle zaman geçirmek için tasarlanmış bir buluşma noktası." },
    "At the Table": { eyebrow:"Sofrada", heading:"Paylaşmak\niçin.", body:"Akdeniz misafirperverliğinden ilham alan soframız; lezzeti, sohbeti ve Yalıkavak’ın kendine özgü ritmini bir araya getiriyor.\n\nYemek için gelin. Gün batımı, hikâyeler ve biraz daha uzun sürmesini isteyeceğiniz anlar için kalın.", buttonLabel:"Menülerimizi keşfet" },
    "Pink Elephant": { eyebrow:"Pembe Fil", heading:"“Pembe filler görmen\ndileğiyle”", body:"Çocukken, yatmadan önce büyükannemiz hep \"Pembe filler görmen dileğiyle\" derdi.\n\nBunun ne anlama geldiğini hiç sorgulamadık. Sadece ona özgü, biraz tuhaf ama sevgi dolu alışkanlıklardan biriydi; kişisel, eğlenceli ve biraz da gizemli.\n\nBugün, onun bu sözlerine yeni bir anlam katmayı seviyoruz. \"Pembe filler görmen dileğiyle\" sözü; meraklı kalmanın, görünenin ötesini düşünmenin ve biraz daha büyük hayaller kurmanın bir hatırlatıcısı bizim için.\n\nPembe fil, restoranımızın simgesi haline geldi. Başkalarına belki son derece rastgele bir seçim gibi görünebilir; ama bizim için o, evimizden küçük bir parça taşıyor." },
    "People Behind It": { eyebrow:"Emeği Geçenler", heading:"Bir aileden,\nbir sofraya.", body:"Restoran adını Lara’dan alsa da, bu hikaye tek bir kişiye ait değil.\n\nBu hikaye aynı zamanda çocukluğumuzu şekillendiren ve mutfaklarında büyüdüğümüz tüm büyükannelerimiz ve büyükbabalarımız için.\n\nYani burası, kendine has bir şekilde, bir teşekkür niteliğinde.\n\nLara, Vova, Vitali ve Raya’ya..." },
    "Menus": { eyebrow:"Menüler", heading:"Paylaşmak için\nhazırlanan lezzetler.", body:"Yemek — Akdeniz lezzetleri, taze malzemeler ve sofradaki herkesi bir araya getirmek için hazırlanan tabaklar.\n\nİçecek — Gün batımından Yalıkavak gecelerine uzanan anlara eşlik eden kokteyller, şaraplar ve özenle seçilmiş içecekler.\n\nKahvaltı — Yavaş başlayan sabahlar, deniz manzarasına karşı kahvaltı ve Yalıkavak Körfezi’nin ilk ışıkları.", buttonLabel:"Menüleri gör" },
    "Experience": { eyebrow:"La Lara Deneyimi", heading:"Gün batımından\ngecenin ilerleyen saatlerine.", body:"Kahvaltı. Öğle yemeği. Gün batımı kokteylleri. Akşam yemeği.\nVe acele etmek için hiçbir sebep yok." },
    "Our Story": { eyebrow:"Hikayemiz", heading:"Lara’dan ilham\nalan bir sofra.", body:"La Lara’da yaratmak istediğimiz hissin kökleri kendi aile hikayemize uzanıyor. Restoranımız adını büyükannemiz Lara’dan alıyor.\n\nLara, kariyer sahibi, güçlü bir kişiliğe ve kabul etmek gerekir ki biraz da diva ruhuna sahipti.\n\nYemek yapmayı severdi ama misafir ağırlamayı daha da çok severdi. Mutfağındaki masa; uzun sohbetlerin, hikâyelerin, kahkahaların ve paylaşılacak bolca yemeğin olduğu bir yerdi.\n\nLa Lara; onun sıcak, zarif ve kendine has karakterinden ilham alıyor. Restorana onun adını vermek, bize en doğru karar gibi hissettirdi." },
    "Gallery": { eyebrow:"La Lara Anları", heading:"Biraz daha\nkal.", body:"Buluş.\nTadını çıkar.\nPaylaş." },
    "Reservation": { eyebrow:"Yalıkavak · Bodrum", heading:"Masanız\nsizi bekliyor.", body:"Manzara için gelin. Yemek, insanlar\nve gece için kalın.", buttonLabel:"Masa Ayırt" },

    "Contact Hero": { heading:"Sofranız\nsizi bekliyor.", body:"İyi yemekler, uzun sohbetler\nve Yalıkavak akşamları." },
    "Contact Heading": { eyebrow:"İletişim", heading:"Sizi La Lara'da\ngörmek isteriz.", body:"Yalıkavak · Bodrum" },
    "Contact Visit": { eyebrow:"Adres", heading:"La Lara", body:"Geriş Mah., 2026. Sokak No:5\nYalıkavak, 48990 Bodrum\nMuğla · Türkiye", buttonLabel:"Yol tarifi al ↗" },
    "Contact Reservations": { eyebrow:"Rezervasyon", heading:"Masa ayırtın", body:"Rezervasyon ve bilgi için\nbizi arayabilir veya e-posta gönderebilirsiniz.", buttonLabel:"Masa Ayırt" },
    "Contact Follow": { eyebrow:"Takip Et", heading:"Bağlantıda kalın", body:"La Lara'dan lezzetler, gün batımları\nve Yalıkavak'tan anlar." },
    "Contact Map": { eyebrow:"Konum", heading:"Yalıkavak'ın\nkalbinde.", buttonLabel:"Google Maps'te Aç ↗" },
    "Contact Reservation": { eyebrow:"Rezervasyon", heading:"Masanız\nsizi bekliyor.", body:"Manzara için gelin. Yemek, insanlar\nve gece için kalın.", buttonLabel:"Masa Ayırt" },
  },
};

function sectionKey(section: string) {
  return section
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

function defaultFor(language: Language, section: string): FormData {
  return {
    ...blank,
    ...(defaults[language]?.[section] ?? {}),
  };
}

export default function ContentPage() {
  const [language, setLanguage] = useState<Language>("EN");
  const [page, setPage] = useState<PageType>("Home");
  const [section, setSection] = useState("Hero");
  const [form, setForm] = useState<FormData>(blank);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("");

  const sections = useMemo(
    () => page === "Home" ? homeSections : contactSections,
    [page]
  );

  const documentId = `${language.toLowerCase()}-${sectionKey(section)}`;

  useEffect(() => {
    setSection(page === "Home" ? "Hero" : "Contact Hero");
  }, [page]);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      setSaveState("");

      try {
        const snapshot = await getDoc(doc(db, "siteContent", documentId));
        const fallback = defaultFor(language, section);

        if (snapshot.exists()) {
          const data = snapshot.data();
          setForm({
            eyebrow: data.eyebrow ?? fallback.eyebrow,
            heading: data.heading ?? fallback.heading,
            body: data.body ?? fallback.body,
            buttonLabel: data.buttonLabel ?? fallback.buttonLabel,
            eyebrowSize: data.eyebrowSize ?? fallback.eyebrowSize,
            headingSize: data.headingSize ?? fallback.headingSize,
            textSize: data.textSize ?? fallback.textSize,
            buttonSize: data.buttonSize ?? fallback.buttonSize,
            fontFamily: data.fontFamily ?? fallback.fontFamily,
            fontWeight: data.fontWeight ?? fallback.fontWeight,
            lineHeight: data.lineHeight ?? fallback.lineHeight,
            letterSpacing: data.letterSpacing ?? fallback.letterSpacing,
          });
        } else {
          setForm(fallback);
        }
      } catch (error) {
        console.error(error);
        setForm(defaultFor(language, section));
        setSaveState("Could not load content.");
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [documentId, language, section]);

  function updateField<K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveContent(status: "draft" | "published") {
    if (!auth.currentUser) {
      setSaveState("Please sign in again.");
      return;
    }

    setSaveState("Saving...");

    try {
      await setDoc(
        doc(db, "siteContent", documentId),
        {
          ...form,
          language: language.toLowerCase(),
          page: page.toLowerCase(),
          section,
          status,
          updatedBy: auth.currentUser.uid,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSaveState(
        status === "published"
          ? "Published successfully."
          : "Draft saved."
      );
    } catch (error) {
      console.error(error);
      setSaveState("Save failed.");
    }
  }

  const previewFont =
    form.fontFamily === "sans"
      ? '"Helvetica Neue", Helvetica, Arial, sans-serif'
      : '"Iowan Old Style", Baskerville, "Times New Roman", serif';

  return (
    <AdminShell eyebrow="Content" title="Site Editor">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Website CMS</p>
          <h1>Edit the website.</h1>
        </div>

        <div className="admin-segmented">
          <button
            className={language === "EN" ? "active" : ""}
            onClick={() => setLanguage("EN")}
          >
            EN
          </button>

          <button
            className={language === "TR" ? "active" : ""}
            onClick={() => setLanguage("TR")}
          >
            TR
          </button>
        </div>
      </div>

      <div className="admin-segmented" style={{ marginBottom: 24 }}>
        <button
          className={page === "Home" ? "active" : ""}
          onClick={() => setPage("Home")}
        >
          Home
        </button>

        <button
          className={page === "Contact" ? "active" : ""}
          onClick={() => setPage("Contact")}
        >
          Contact / İletişim
        </button>
      </div>

      <div className="editor-layout">
        <aside className="editor-sections">
          <span>{page} sections</span>

          {sections.map((item) => (
            <button
              key={item}
              className={section === item ? "active" : ""}
              onClick={() => setSection(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="editor-form admin-panel-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-eyebrow">{language} · {page}</p>
              <h2>{section}</h2>
            </div>
          </div>

          {loading ? (
            <p className="admin-save-message">Loading content...</p>
          ) : (
            <>
              <label className="admin-field">
                <span>Eyebrow / small label</span>
                <input
                  value={form.eyebrow}
                  onChange={(event) =>
                    updateField("eyebrow", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Heading</span>
                <textarea
                  rows={3}
                  value={form.heading}
                  onChange={(event) =>
                    updateField("heading", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Body copy</span>
                <textarea
                  rows={8}
                  value={form.body}
                  onChange={(event) =>
                    updateField("body", event.target.value)
                  }
                />
              </label>

              <label className="admin-field">
                <span>Button label</span>
                <input
                  value={form.buttonLabel}
                  onChange={(event) =>
                    updateField("buttonLabel", event.target.value)
                  }
                />
              </label>

              <div className="admin-field-grid">
                <label className="admin-field">
                  <span>Eyebrow size (px)</span>
                  <input
                    type="number"
                    min="8"
                    max="40"
                    value={form.eyebrowSize}
                    onChange={(event) =>
                      updateField("eyebrowSize", Number(event.target.value))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Heading size (px)</span>
                  <input
                    type="number"
                    min="20"
                    max="160"
                    value={form.headingSize}
                    onChange={(event) =>
                      updateField("headingSize", Number(event.target.value))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Text size (px)</span>
                  <input
                    type="number"
                    min="9"
                    max="40"
                    value={form.textSize}
                    onChange={(event) =>
                      updateField("textSize", Number(event.target.value))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Button size (px)</span>
                  <input
                    type="number"
                    min="9"
                    max="32"
                    value={form.buttonSize}
                    onChange={(event) =>
                      updateField("buttonSize", Number(event.target.value))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Font family</span>
                  <select
                    value={form.fontFamily}
                    onChange={(event) =>
                      updateField(
                        "fontFamily",
                        event.target.value as FormData["fontFamily"]
                      )
                    }
                  >
                    <option value="display">Display / Serif</option>
                    <option value="sans">Sans Serif</option>
                  </select>
                </label>

                <label className="admin-field">
                  <span>Font weight</span>
                  <select
                    value={form.fontWeight}
                    onChange={(event) =>
                      updateField("fontWeight", Number(event.target.value))
                    }
                  >
                    <option value="300">Light 300</option>
                    <option value="400">Regular 400</option>
                    <option value="500">Medium 500</option>
                    <option value="600">Semi Bold 600</option>
                    <option value="700">Bold 700</option>
                  </select>
                </label>

                <label className="admin-field">
                  <span>Line height</span>
                  <input
                    type="number"
                    min="0.8"
                    max="2.5"
                    step="0.05"
                    value={form.lineHeight}
                    onChange={(event) =>
                      updateField("lineHeight", Number(event.target.value))
                    }
                  />
                </label>

                <label className="admin-field">
                  <span>Letter spacing (px)</span>
                  <input
                    type="number"
                    min="-5"
                    max="20"
                    step="0.1"
                    value={form.letterSpacing}
                    onChange={(event) =>
                      updateField("letterSpacing", Number(event.target.value))
                    }
                  />
                </label>
              </div>

              {saveState && (
                <p className="admin-save-message">{saveState}</p>
              )}

              <div className="admin-form-actions">
                <button
                  className="admin-button secondary"
                  onClick={() => saveContent("draft")}
                >
                  Save draft
                </button>

                <button
                  className="admin-button primary"
                  onClick={() => saveContent("published")}
                >
                  Publish changes
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="editor-preview admin-panel-card">
          <div className="preview-toolbar">
            <span>Live preview</span>
          </div>

          <div className="preview-canvas">
            <span style={{ fontSize: form.eyebrowSize }}>
              {form.eyebrow || `${language} · ${section}`}
            </span>

            <h3
              style={{
                fontFamily: previewFont,
                fontSize: `${Math.min(form.headingSize, 80)}px`,
                fontWeight: form.fontWeight,
                lineHeight: form.lineHeight,
                letterSpacing: `${form.letterSpacing}px`,
                whiteSpace: "pre-line",
              }}
            >
              {form.heading || "Your changes appear here."}
            </h3>

            <p
              style={{
                fontSize: `${Math.min(form.textSize, 22)}px`,
                lineHeight: form.lineHeight,
                letterSpacing: `${form.letterSpacing}px`,
                whiteSpace: "pre-line",
              }}
            >
              {form.body || "Edit the fields to preview this section."}
            </p>

            {form.buttonLabel && (
              <button
                className="admin-button secondary"
                style={{ fontSize: form.buttonSize }}
              >
                {form.buttonLabel}
              </button>
            )}
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
