"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";

/* =========================================================
   TYPES
   ========================================================= */

type LibraryImage = {
  id: string;
  url: string;
  publicId: string;
  name: string;
  createdAt?: unknown;
};

type SingleField = {
  type: "single";
  key: string;
  label: string;
  description: string;
  fallback?: string;
};

type SliderField = {
  type: "slider";
  key: string;
  label: string;
  description: string;
  fallback?: string[];
};

type MediaField = SingleField | SliderField;

type PageDefinition = {
  key: string;
  label: string;
  eyebrow: string;
  description: string;
  fields: MediaField[];
};

type PageMediaData = Record<string, string | string[]>;
type AllPageMedia = Record<string, PageMediaData>;

type PickerState = {
  open: boolean;
  pageKey: string;
  fieldKey: string;
  type: "single" | "slider";
};

/* =========================================================
   CLOUDINARY
   ========================================================= */

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtmvfneo";

const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lalara_cms";

async function uploadToCloudinary(file: File) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "lalara/library");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Cloudinary upload failed"
    );
  }

  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
  };
}

/* =========================================================
   PAGE DEFINITIONS
   ========================================================= */

const PAGE_DEFINITIONS: PageDefinition[] = [
  /* =========================================================
     HOMEPAGE
     ========================================================= */
  {
    key: "homepage",
    label: "Homepage",
    eyebrow: "Homepage photography",
    description:
      "Manage homepage photography in the same order it appears on the website.",
    fields: [
      {
        type: "single",
        key: "hero",
        label: "01 · Hero",
        description: "Main homepage hero image.",
      },
      {
        type: "single",
        key: "food",
        label: "02 · Menu — Food",
        description: "Food card photography used on the homepage.",
      },
      {
        type: "single",
        key: "drinks",
        label: "03 · Menu — Drinks",
        description: "Drinks card photography used on the homepage.",
      },
      {
        type: "single",
        key: "breakfast",
        label: "04 · Menu — Breakfast",
        description: "Breakfast card photography used on the homepage.",
      },
      {
        type: "single",
        key: "atmosphere",
        label: "05 · Our Story",
        description:
          "Photography used beside the Our Story section on the homepage.",
      },
      {
        type: "single",
        key: "moments",
        label: "06 · Atmosphere / Gallery",
        description:
          "Photography used in the homepage atmosphere and gallery section.",
      },
      {
        type: "single",
        key: "sunset",
        label: "07 · Private Events",
        description:
          "Photography used in the homepage Private Events section.",
      },
    ],
  },
  /* =========================================================
     OUR STORY
     ========================================================= */
  {
    key: "story",
    label: "Our Story",
    eyebrow: "Our Story photography",
    description:
      "Manage the photography used on the Our Story page in the same order it appears on the website.",
    fields: [
      {
        type: "single",
        key: "hero",
        label: "01 · Our Story Hero",
        description:
          "Main photography used at the top of the Our Story page.",
      },
      {
        type: "single",
        key: "lara",
        label: "02 · The Woman Behind the Name",
        description:
          "Photography used beside Lara's story.",
      },
      {
        type: "single",
        key: "restaurant",
        label: "03 · A Place of Our Own",
        description:
          "Restaurant atmosphere photography used in the story.",
      },
      {
        type: "single",
        key: "people",
        label: "04 · The People Behind Our Story",
        description:
          "Photography used in The People Behind Our Story section.",
      },
    ],
  },
  /* =========================================================
     MENU PAGES
     ========================================================= */
  {
    key: "menus",
    label: "Menu Pages",
    eyebrow: "Menu page photography",
    description:
      "Manage the main photography used on the Food, Drinks and Breakfast menu pages.",
    fields: [
      {
        type: "single",
        key: "food",
        label: "01 · Food Menu",
        description:
          "Main photography used on the Food Menu page.",
      },
      {
        type: "single",
        key: "drinks",
        label: "02 · Drinks Menu",
        description:
          "Main photography used on the Drinks Menu page.",
      },
      {
        type: "single",
        key: "breakfast",
        label: "03 · Breakfast Menu",
        description:
          "Main photography used on the Breakfast Menu page.",
      },
    ],
  },

  /* =========================================================
     GALLERY
     ========================================================= */
  {
    key: "gallery",
    label: "Gallery",
    eyebrow: "Gallery photography",
    description:
      "Manage the Gallery hero and all Gallery photographs.",
    fields: [
      {
        type: "single",
        key: "hero",
        label: "01 · Gallery Hero",
        description:
          "Main image at the top of the Gallery page.",
      },
      {
        type: "slider",
        key: "photos",
        label: "02 · Gallery Photos",
        description:
          "Add, remove and reorder photographs shown in the Gallery.",
      },
    ],
  },

  /* =========================================================
     PRIVATE EVENTS
     ========================================================= */
  {
    key: "private-events",
    label: "Private Events",
    eyebrow: "Private Events photography",
    description:
      "Manage the hero, weddings, celebrations and gathering photography separately.",
    fields: [
      {
        type: "single",
        key: "hero",
        label: "01 · Private Events Hero",
        description:
          "Main image at the top of the Private Events page.",
      },
      {
        type: "slider",
        key: "weddings",
        label: "02 · Weddings",
        description:
          "Photography used in the Weddings section.",
      },
      {
        type: "slider",
        key: "celebrations",
        label: "03 · Private Celebrations",
        description:
          "Photography used in the Private Celebrations section.",
      },
      {
        type: "slider",
        key: "gatherings",
        label: "04 · Intimate Gatherings",
        description:
          "Photography used in the Intimate Gatherings section.",
      },
    ],
  },

  /* =========================================================
     CONTACT
     ========================================================= */
  {
    key: "contact",
    label: "Contact",
    eyebrow: "Contact photography",
    description:
      "Manage Contact and reservation photography.",
    fields: [
      {
        type: "single",
        key: "hero",
        label: "01 · Contact Hero",
        description:
          "Main photography used on the Contact page.",
      },
      {
        type: "single",
        key: "reservation",
        label: "02 · Reservation Background",
        description:
          "Background photography used in the reservation area.",
      },
    ],
  },
];
/* =========================================================
   HELPERS
   ========================================================= */

function createLibraryId() {
  return `img_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function uniqueUrls(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

/* =========================================================
   PAGE
   ========================================================= */

export default function MediaPage() {
  const [library, setLibrary] = useState<LibraryImage[]>([]);
  const [pageMedia, setPageMedia] =
    useState<AllPageMedia>({});

  const [selectedSection, setSelectedSection] =
    useState("homepage");

  const [picker, setPicker] =
    useState<PickerState>({
      open: false,
      pageKey: "",
      fieldKey: "",
      type: "single",
    });

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const uploadInput = useRef<HTMLInputElement>(null);

  const currentPage = useMemo(
    () =>
      PAGE_DEFINITIONS.find(
        (page) => page.key === selectedSection
      ) || PAGE_DEFINITIONS[0],
    [selectedSection]
  );

  /* =======================================================
     LOAD
     ======================================================= */

  useEffect(() => {
    async function loadEverything() {
      try {
        setLoading(true);
        setMessage("");

        /* LIBRARY */

        const librarySnapshot = await getDocs(
          collection(db, "mediaLibrary")
        );

        const loadedLibrary: LibraryImage[] = [];

        librarySnapshot.forEach((snapshot) => {
          const data =
            snapshot.data() as Partial<LibraryImage>;

          if (!data.url) return;

          loadedLibrary.push({
            id: snapshot.id,
            url: data.url,
            publicId: data.publicId || "",
            name: data.name || "La Lara image",
            createdAt: data.createdAt,
          });
        });

        /* PAGE MEDIA */

        const loadedPages: AllPageMedia = {};

        for (const page of PAGE_DEFINITIONS) {
          const snapshot = await getDoc(
            doc(db, "pageMedia", page.key)
          );

          if (snapshot.exists()) {
            const data = snapshot.data();

            loadedPages[page.key] =
              (data.fields || {}) as PageMediaData;
          }
        }

        /* LEGACY MEDIA */

        const legacySnapshot = await getDoc(
          doc(db, "siteSettings", "media")
        );

        if (legacySnapshot.exists()) {
          const legacy = legacySnapshot.data();

          const oldImages =
            (legacy.images || {}) as Record<
              string,
              {
                url?: string;
                publicId?: string;
                name?: string;
              }
            >;

          const mappings = [
            ["homepage", "hero", "hero"],
            ["homepage", "atmosphere", "atmosphere"],
            ["homepage", "food", "food"],
            ["homepage", "drinks", "drinks"],
            ["homepage", "breakfast", "breakfast"],
            ["homepage", "sunset", "sunset"],
            ["homepage", "moments", "moments"],
            ["contact", "hero", "contactHero"],
            [
              "contact",
              "reservation",
              "contactReservation",
            ],
          ];

          mappings.forEach(
            ([pageKey, fieldKey, legacyKey]) => {
              const image = oldImages[legacyKey];

              if (!image?.url) return;

              if (!loadedPages[pageKey]) {
                loadedPages[pageKey] = {};
              }

              if (!(fieldKey in loadedPages[pageKey])) {
                loadedPages[pageKey][fieldKey] =
                  image.url;
              }
            }
          );

          /* OLD GALLERY */

          const oldGallery = Array.isArray(
            legacy.gallery
          )
            ? legacy.gallery
            : [];

          const oldGalleryUrls = oldGallery
            .map(
              (item: { url?: string }) =>
                item?.url || ""
            )
            .filter(Boolean);

          if (
            oldGalleryUrls.length &&
            !loadedPages.gallery?.photos
          ) {
            loadedPages.gallery = {
              ...(loadedPages.gallery || {}),
              photos: oldGalleryUrls,
            };
          }

       

          /* OLD EVENTS */

          const event1 = oldImages.event1?.url;
          const event2 = oldImages.event2?.url;
          const event3 = oldImages.event3?.url;

          if (!loadedPages["private-events"]) {
            loadedPages["private-events"] = {};
          }

          if (
            event1 &&
            !loadedPages["private-events"].weddings
          ) {
            loadedPages["private-events"].weddings = [
              event1,
            ];
          }

          if (
            event2 &&
            !loadedPages["private-events"]
              .celebrations
          ) {
            loadedPages[
              "private-events"
            ].celebrations = [event2];
          }

          if (
            event3 &&
            !loadedPages["private-events"].gatherings
          ) {
            loadedPages["private-events"].gatherings = [
              event3,
            ];
          }
        }

        setLibrary(loadedLibrary);
        setPageMedia(loadedPages);
      } catch (error) {
        console.error(error);
        setMessage("Media could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadEverything();
  }, []);

  /* =======================================================
     VALUES
     ======================================================= */

  function getSingleValue(
    pageKey: string,
    field: SingleField
  ) {
    const value =
      pageMedia[pageKey]?.[field.key];

    if (typeof value === "string") {
      /*
       * Empty string means intentionally removed.
       * Undefined means no CMS value yet -> fallback.
       */
      return value;
    }

    return field.fallback || "";
  }

  function getSliderValues(
    pageKey: string,
    field: SliderField
  ) {
    const value =
      pageMedia[pageKey]?.[field.key];

    if (Array.isArray(value)) {
      return value;
    }

    return field.fallback || [];
  }

  function updateSingle(
    pageKey: string,
    fieldKey: string,
    value: string
  ) {
    setPageMedia((current) => ({
      ...current,
      [pageKey]: {
        ...(current[pageKey] || {}),
        [fieldKey]: value,
      },
    }));
  }

  function updateSlider(
    pageKey: string,
    fieldKey: string,
    value: string[]
  ) {
    setPageMedia((current) => ({
      ...current,
      [pageKey]: {
        ...(current[pageKey] || {}),
        [fieldKey]: value,
      },
    }));
  }

  /* =======================================================
     PICKER
     ======================================================= */

  function openPicker(
    pageKey: string,
    field: MediaField
  ) {
    setPicker({
      open: true,
      pageKey,
      fieldKey: field.key,
      type: field.type,
    });
  }

  function closePicker() {
    setPicker({
      open: false,
      pageKey: "",
      fieldKey: "",
      type: "single",
    });
  }

  function chooseImage(image: LibraryImage) {
    if (!picker.open) return;

    if (picker.type === "single") {
      updateSingle(
        picker.pageKey,
        picker.fieldKey,
        image.url
      );

      closePicker();
      return;
    }

    const current =
      pageMedia[picker.pageKey]?.[
        picker.fieldKey
      ];

    let existing: string[] = [];

    if (Array.isArray(current)) {
      existing = current;
    } else {
      const definition =
        PAGE_DEFINITIONS.find(
          (page) => page.key === picker.pageKey
        );

      const field = definition?.fields.find(
        (item) =>
          item.key === picker.fieldKey &&
          item.type === "slider"
      ) as SliderField | undefined;

      existing = field?.fallback || [];
    }

    updateSlider(
      picker.pageKey,
      picker.fieldKey,
      uniqueUrls([...existing, image.url])
    );
  }

  /* =======================================================
     UPLOAD
     ======================================================= */

  async function uploadFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    event.target.value = "";

    if (!files.length) return;

    const invalid = files.find(
      (file) =>
        !file.type.startsWith("image/") ||
        file.size > 10 * 1024 * 1024
    );

    if (invalid) {
      setMessage(
        "Only image files up to 10 MB are allowed."
      );
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      setMessage("Your session has expired.");
      return;
    }

    try {
      setUploading(true);

      setMessage(
        `Uploading ${files.length} image(s)...`
      );

      const uploaded: LibraryImage[] = [];

      for (const file of files) {
        const result =
          await uploadToCloudinary(file);

        const id = createLibraryId();

        const image: LibraryImage = {
          id,
          url: result.url,
          publicId: result.publicId,
          name: file.name,
        };

        await setDoc(
          doc(db, "mediaLibrary", id),
          {
            ...image,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            createdByEmail: user.email || "",
          }
        );

        uploaded.push(image);
      }

      setLibrary((current) => [
        ...uploaded,
        ...current,
      ]);

      setMessage(
        `${uploaded.length} image(s) uploaded ✓`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Upload failed: ${error.message}`
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  /* =======================================================
     REMOVE FROM PAGE
     ======================================================= */

  function removeSingle(
    pageKey: string,
    fieldKey: string
  ) {
    updateSingle(pageKey, fieldKey, "");
  }

  function removeSliderImage(
    pageKey: string,
    field: SliderField,
    index: number
  ) {
    const values =
      getSliderValues(pageKey, field);

    updateSlider(
      pageKey,
      field.key,
      values.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  }

  function moveSliderImage(
    pageKey: string,
    field: SliderField,
    index: number,
    direction: -1 | 1
  ) {
    const values = [
      ...getSliderValues(pageKey, field),
    ];

    const target = index + direction;

    if (
      target < 0 ||
      target >= values.length
    ) {
      return;
    }

    [values[index], values[target]] = [
      values[target],
      values[index],
    ];

    updateSlider(
      pageKey,
      field.key,
      values
    );
  }

  /* =======================================================
     SAVE
     ======================================================= */

  async function saveCurrentPage() {
    const user = auth.currentUser;

    if (!user) {
      setMessage("Your session has expired.");
      return;
    }

    try {
      setSaving(true);

      setMessage(
        `Saving ${currentPage.label}...`
      );

      const fields =
        pageMedia[currentPage.key] || {};

      await setDoc(
        doc(
          db,
          "pageMedia",
          currentPage.key
        ),
        {
          fields,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
          updatedByEmail: user.email || "",
        },
        {
          merge: true,
        }
      );

      /* ===============================================
         LEGACY COMPATIBILITY
         =============================================== */

      const legacyRef = doc(
        db,
        "siteSettings",
        "media"
      );

      const legacySnapshot =
        await getDoc(legacyRef);

      const legacy = legacySnapshot.exists()
        ? legacySnapshot.data()
        : {};

      const oldImages = {
        ...(legacy.images || {}),
      };

      if (currentPage.key === "homepage") {
        const keys = [
          "hero",
          "atmosphere",
          "food",
          "drinks",
          "breakfast",
          "sunset",
          "moments",
        ];

        keys.forEach((key) => {
          const value = fields[key];

          if (typeof value !== "string") {
            return;
          }

          if (!value) {
            delete oldImages[key];
            return;
          }

          oldImages[key] = {
            ...(oldImages[key] || {}),
            url: value,
          };
        });

        await setDoc(
          legacyRef,
          {
            images: oldImages,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
          },
          { merge: true }
        );
      }

      if (currentPage.key === "contact") {
        const hero = fields.hero;
        const reservation =
          fields.reservation;

        if (typeof hero === "string") {
          if (hero) {
            oldImages.contactHero = {
              ...(oldImages.contactHero ||
                {}),
              url: hero,
            };
          } else {
            delete oldImages.contactHero;
          }
        }

        if (
          typeof reservation === "string"
        ) {
          if (reservation) {
            oldImages.contactReservation = {
              ...(oldImages
                .contactReservation || {}),
              url: reservation,
            };
          } else {
            delete oldImages
              .contactReservation;
          }
        }

        await setDoc(
          legacyRef,
          {
            images: oldImages,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
          },
          { merge: true }
        );
      }

      if (currentPage.key === "gallery") {
        const photos = fields.photos;

        if (Array.isArray(photos)) {
          const gallery = photos.map(
            (url, index) => {
              const image = library.find(
                (item) => item.url === url
              );

              return {
                id:
                  image?.id ||
                  `gallery_${index}`,
                url,
                publicId:
                  image?.publicId || "",
                name:
                  image?.name ||
                  `Gallery image ${
                    index + 1
                  }`,
              };
            }
          );

          await setDoc(
            legacyRef,
            {
              gallery,
              updatedAt:
                serverTimestamp(),
              updatedBy: user.uid,
            },
            { merge: true }
          );
        }
      }

      if (
        currentPage.key ===
        "private-events"
      ) {
        const weddings =
          fields.weddings;

        const celebrations =
          fields.celebrations;

        const gatherings =
          fields.gatherings;

        const event1 =
          Array.isArray(weddings)
            ? weddings[0] || ""
            : "";

        const event2 =
          Array.isArray(celebrations)
            ? celebrations[0] || ""
            : "";

        const event3 =
          Array.isArray(gatherings)
            ? gatherings[0] || ""
            : "";

        if (event1) {
          oldImages.event1 = {
            ...(oldImages.event1 || {}),
            url: event1,
          };
        } else {
          delete oldImages.event1;
        }

        if (event2) {
          oldImages.event2 = {
            ...(oldImages.event2 || {}),
            url: event2,
          };
        } else {
          delete oldImages.event2;
        }

        if (event3) {
          oldImages.event3 = {
            ...(oldImages.event3 || {}),
            url: event3,
          };
        } else {
          delete oldImages.event3;
        }

        await setDoc(
          legacyRef,
          {
            images: oldImages,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
          },
          { merge: true }
        );
      }

      setMessage(
        `${currentPage.label} saved ✓`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? `Save failed: ${error.message}`
          : "Save failed."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     LIBRARY USAGE
     ======================================================= */

  function getImageUsage(url: string) {
    const usage: string[] = [];

    PAGE_DEFINITIONS.forEach((page) => {
      const values =
        pageMedia[page.key] || {};

      page.fields.forEach((field) => {
        const value = values[field.key];

        if (
          typeof value === "string" &&
          value === url
        ) {
          usage.push(
            `${page.label} · ${field.label}`
          );
        }

        if (
          Array.isArray(value) &&
          value.includes(url)
        ) {
          usage.push(
            `${page.label} · ${field.label}`
          );
        }
      });
    });

    return usage;
  }

  /* =======================================================
     DELETE FROM LIBRARY
     ======================================================= */

async function deleteLibraryImage(image: LibraryImage) {
  const usage = getImageUsage(image.url);

  const warning = usage.length
    ? `This photo is currently used in:\n\n${usage.join(
        "\n"
      )}\n\nRemoving it from the Photo Library will NOT remove it from those pages. Continue?`
    : `Delete "${image.name}" from the Photo Library?`;

  const confirmed = window.confirm(warning);

  if (!confirmed) return;

  try {
    await deleteDoc(
      doc(db, "mediaLibrary", image.id)
    );

    setLibrary((current) =>
      current.filter(
        (item) => item.id !== image.id
      )
    );

    setMessage(
      usage.length
        ? "Photo removed from Library. Existing page placements were kept ✓"
        : "Photo removed from Library ✓"
    );
  } catch (error) {
    console.error(error);

    setMessage(
      error instanceof Error
        ? `Delete failed: ${error.message}`
        : "Photo could not be removed."
    );
  }
}

  /* =======================================================
     UI
     ======================================================= */

  return (
    <AdminShell
      eyebrow="Website"
      title="Photography"
    >
      <input
        ref={uploadInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={uploadFiles}
      />

      {/* HEADER */}

      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">
            Photography
          </p>

          <h1>Website photography.</h1>

          <p
            style={{
              marginTop: 10,
              maxWidth: 650,
              opacity: 0.62,
              lineHeight: 1.65,
            }}
          >
            Choose a page below and manage
            only the photography used on that
            page.
          </p>
        </div>

        <button
          type="button"
          className="admin-button primary"
          disabled={uploading}
          onClick={() =>
            uploadInput.current?.click()
          }
        >
          {uploading
            ? "Uploading..."
            : "+ Upload photos"}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginBottom: 20,
            padding: "13px 16px",
            background:
              "rgba(200,84,93,.08)",
            border:
              "1px solid rgba(200,84,93,.16)",
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          {message}
        </div>
      )}

      {/* NAVIGATION */}

      <section
        className="admin-panel-card"
        style={{ marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {PAGE_DEFINITIONS.map(
            (page) => (
              <button
                key={page.key}
                type="button"
                className={
                  selectedSection ===
                  page.key
                    ? "admin-button primary"
                    : "admin-button"
                }
                onClick={() =>
                  setSelectedSection(
                    page.key
                  )
                }
              >
                {page.label}
              </button>
            )
          )}

          <button
            type="button"
            className={
              selectedSection ===
              "library"
                ? "admin-button primary"
                : "admin-button"
            }
            onClick={() =>
              setSelectedSection("library")
            }
          >
            Photo Library
          </button>
        </div>
      </section>

      {/* ===================================================
          PHOTO LIBRARY
          =================================================== */}

      {selectedSection ===
      "library" ? (
        <section className="admin-panel-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-eyebrow">
                Photo Library
              </p>

              <h2>All photography</h2>

              <p
                style={{
                  marginTop: 8,
                  opacity: 0.6,
                  lineHeight: 1.6,
                }}
              >
                Upload photography once and
                reuse it throughout the
                website.
              </p>
            </div>

            <button
              type="button"
              className="admin-button primary"
              disabled={uploading}
              onClick={() =>
                uploadInput.current?.click()
              }
            >
              {uploading
                ? "Uploading..."
                : "+ Upload photos"}
            </button>
          </div>

          {loading ? (
            <p
              style={{
                marginTop: 24,
                opacity: 0.55,
              }}
            >
              Loading photography...
            </p>
          ) : library.length === 0 ? (
            <div
              style={{
                marginTop: 24,
                padding: "50px 20px",
                textAlign: "center",
                border:
                  "1px dashed rgba(0,0,0,.14)",
                opacity: 0.55,
              }}
            >
              No photography uploaded yet.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(190px, 1fr))",
                gap: 14,
                marginTop: 26,
              }}
            >
              {library.map((image) => {
                const usage =
                  getImageUsage(
                    image.url
                  );

                return (
                  <article
                    key={image.id}
                    style={{
                      background: "#fff",
                      border:
                        "1px solid rgba(0,0,0,.10)",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio:
                          "4 / 3",
                        overflow: "hidden",
                        background:
                          "#eceae5",
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit:
                            "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: 12,
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: 13,
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {image.name}
                      </strong>

                      <div
                        style={{
                          marginTop: 7,
                          minHeight: 32,
                          fontSize: 11,
                          lineHeight: 1.45,
                          opacity: 0.55,
                        }}
                      >
                        {usage.length
                          ? `Used: ${usage.join(
                              ", "
                            )}`
                          : "Not used on a page"}
                      </div>

                      <button
                        type="button"
                        className="admin-button"
                        style={{
                          marginTop: 10,
                        }}
                        onClick={() =>
                          deleteLibraryImage(
                            image
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* =================================================
           PAGE PHOTOS
           ================================================= */

        <section className="admin-panel-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-eyebrow">
                {currentPage.eyebrow}
              </p>

              <h2>{currentPage.label}</h2>

              <p
                style={{
                  marginTop: 8,
                  maxWidth: 620,
                  opacity: 0.6,
                  lineHeight: 1.6,
                }}
              >
                {currentPage.description}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 30,
              marginTop: 28,
            }}
          >
            {currentPage.fields.map(
              (field) => {
                /* SINGLE */

                if (
                  field.type ===
                  "single"
                ) {
                  const value =
                    getSingleValue(
                      currentPage.key,
                      field
                    );

                  return (
                    <div
                      key={field.key}
                      style={{
                        paddingTop: 24,
                        borderTop:
                          "1px solid rgba(0,0,0,.10)",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: 14,
                        }}
                      >
                        <strong
                          style={{
                            display:
                              "block",
                            fontSize: 16,
                          }}
                        >
                          {field.label}
                        </strong>

                        <span
                          style={{
                            display:
                              "block",
                            marginTop: 5,
                            opacity: 0.55,
                            fontSize: 13,
                          }}
                        >
                          {
                            field.description
                          }
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "minmax(220px, 380px) 1fr",
                          gap: 24,
                          alignItems:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            aspectRatio:
                              "16 / 10",
                            overflow:
                              "hidden",
                            background:
                              "#eceae5",
                          }}
                        >
                          {value ? (
                            <img
                              src={value}
                              alt={
                                field.label
                              }
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                                display:
                                  "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                display:
                                  "grid",
                                placeItems:
                                  "center",
                                opacity:
                                  0.4,
                              }}
                            >
                              No image
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap: 10,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <button
                            type="button"
                            className="admin-button primary"
                            onClick={() =>
                              openPicker(
                                currentPage.key,
                                field
                              )
                            }
                          >
                            Choose photo
                          </button>

                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              removeSingle(
                                currentPage.key,
                                field.key
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                /* SLIDER */

                const values =
                  getSliderValues(
                    currentPage.key,
                    field
                  );

                return (
                  <div
                    key={field.key}
                    style={{
                      paddingTop: 24,
                      borderTop:
                        "1px solid rgba(0,0,0,.10)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "flex-start",
                        justifyContent:
                          "space-between",
                        gap: 20,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display:
                              "block",
                            fontSize: 16,
                          }}
                        >
                          {field.label}
                        </strong>

                        <span
                          style={{
                            display:
                              "block",
                            marginTop: 5,
                            opacity: 0.55,
                            fontSize: 13,
                          }}
                        >
                          {
                            field.description
                          }
                        </span>
                      </div>

                      <button
                        type="button"
                        className="admin-button primary"
                        onClick={() =>
                          openPicker(
                            currentPage.key,
                            field
                          )
                        }
                      >
                        + Add photos
                      </button>
                    </div>

                    {values.length ===
                    0 ? (
                      <div
                        style={{
                          padding:
                            "38px 20px",
                          border:
                            "1px dashed rgba(0,0,0,.15)",
                          textAlign:
                            "center",
                          opacity: 0.55,
                        }}
                      >
                        No photos selected.
                      </div>
                    ) : (
                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(180px, 1fr))",
                          gap: 14,
                        }}
                      >
                        {values.map(
                          (
                            url,
                            index
                          ) => (
                            <article
                              key={`${url}-${index}`}
                              style={{
                                border:
                                  "1px solid rgba(0,0,0,.10)",
                                background:
                                  "#fff",
                              }}
                            >
                              <div
                                style={{
                                  position:
                                    "relative",
                                  aspectRatio:
                                    "4 / 3",
                                  overflow:
                                    "hidden",
                                  background:
                                    "#eceae5",
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`${field.label} ${
                                    index +
                                    1
                                  }`}
                                  style={{
                                    width:
                                      "100%",
                                    height:
                                      "100%",
                                    objectFit:
                                      "cover",
                                    display:
                                      "block",
                                  }}
                                />

                                <span
                                  style={{
                                    position:
                                      "absolute",
                                    top: 8,
                                    left: 8,
                                    padding:
                                      "5px 7px",
                                    background:
                                      "rgba(20,20,20,.75)",
                                    color:
                                      "#fff",
                                    fontSize:
                                      10,
                                  }}
                                >
                                  {String(
                                    index +
                                      1
                                  ).padStart(
                                    2,
                                    "0"
                                  )}
                                </span>
                              </div>

                              <div
                                style={{
                                  padding:
                                    10,
                                  display:
                                    "flex",
                                  gap: 6,
                                  flexWrap:
                                    "wrap",
                                }}
                              >
                                <button
                                  type="button"
                                  className="admin-button"
                                  disabled={
                                    index ===
                                    0
                                  }
                                  onClick={() =>
                                    moveSliderImage(
                                      currentPage.key,
                                      field,
                                      index,
                                      -1
                                    )
                                  }
                                >
                                  ←
                                </button>

                                <button
                                  type="button"
                                  className="admin-button"
                                  disabled={
                                    index ===
                                    values.length -
                                      1
                                  }
                                  onClick={() =>
                                    moveSliderImage(
                                      currentPage.key,
                                      field,
                                      index,
                                      1
                                    )
                                  }
                                >
                                  →
                                </button>

                                <button
                                  type="button"
                                  className="admin-button"
                                  onClick={() =>
                                    removeSliderImage(
                                      currentPage.key,
                                      field,
                                      index
                                    )
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </article>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              marginTop: 36,
              paddingTop: 24,
              borderTop:
                "1px solid rgba(0,0,0,.10)",
            }}
          >
            <button
              type="button"
              className="admin-button primary"
              disabled={saving}
              onClick={
                saveCurrentPage
              }
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>
          </div>
        </section>
      )}

      {/* ===================================================
          PICKER
          =================================================== */}

      {picker.open && (
        <div
          onClick={closePicker}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background:
              "rgba(20,20,18,.72)",
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width:
                "min(1100px, 100%)",
              maxHeight:
                "calc(100vh - 48px)",
              overflowY: "auto",
              background: "#f7f5f0",
              padding: 28,
              boxShadow:
                "0 30px 90px rgba(0,0,0,.30)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-start",
                gap: 20,
                marginBottom: 24,
              }}
            >
              <div>
                <p className="admin-eyebrow">
                  Photo Library
                </p>

                <h2>
                  Choose photography
                </h2>

                <p
                  style={{
                    marginTop: 8,
                    opacity: 0.6,
                  }}
                >
                  {picker.type ===
                  "slider"
                    ? "Select one or more photographs."
                    : "Select a photograph."}
                </p>
              </div>

              <button
                type="button"
                className="admin-button"
                onClick={closePicker}
              >
                Close
              </button>
            </div>

            {library.length === 0 ? (
              <div
                style={{
                  padding:
                    "50px 20px",
                  textAlign: "center",
                  opacity: 0.55,
                }}
              >
                No photography in the
                library yet.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {library.map(
                  (image) => (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() =>
                        chooseImage(
                          image
                        )
                      }
                      style={{
                        border:
                          "1px solid rgba(0,0,0,.12)",
                        padding: 0,
                        background:
                          "#fff",
                        cursor:
                          "pointer",
                        textAlign:
                          "left",
                      }}
                    >
                      <div
                        style={{
                          aspectRatio:
                            "4 / 3",
                          overflow:
                            "hidden",
                        }}
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          style={{
                            width:
                              "100%",
                            height:
                              "100%",
                            objectFit:
                              "cover",
                            display:
                              "block",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          padding: 10,
                          fontSize: 12,
                          whiteSpace:
                            "nowrap",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {image.name}
                      </div>
                    </button>
                  )
                )}
              </div>
            )}

            {picker.type ===
              "slider" && (
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  className="admin-button primary"
                  onClick={closePicker}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}