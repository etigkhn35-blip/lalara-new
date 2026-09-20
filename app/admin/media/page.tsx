"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";

type MediaItem = {
  key: string;
  name: string;
  fallback: string;
  url: string;
  publicId?: string;
};

type GalleryItem = {
  id: string;
  url: string;
  publicId: string;
  name: string;
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtmvfneo";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "lalara_cms";

async function uploadToCloudinary(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

  return { url: data.secure_url as string, publicId: data.public_id as string };
}

const initialImages: MediaItem[] = [
  { key: "hero", name: "Homepage Hero", fallback: "/images/home/1.jpg", url: "/images/home/1.jpg" },
  { key: "atmosphere", name: "At the Table", fallback: "/images/home/2.jpg", url: "/images/home/2.jpg" },
  { key: "food", name: "Food", fallback: "/images/home/3.jpg", url: "/images/home/3.jpg" },
  { key: "drinks", name: "Drinks", fallback: "/images/home/4.jpg", url: "/images/home/4.jpg" },
  { key: "breakfast", name: "Breakfast", fallback: "/images/home/5.jpg", url: "/images/home/5.jpg" },
  { key: "sunset", name: "Experience / Sunset", fallback: "/images/home/6.jpg", url: "/images/home/6.jpg" },
  { key: "story", name: "Our Story", fallback: "/images/home/7.jpg", url: "/images/home/7.jpg" },
  { key: "moments", name: "Gallery / Moments fallback", fallback: "/images/home/8.jpg", url: "/images/home/8.jpg" },
  { key: "event1", name: "Private Events — Photo 1 / Weddings", fallback: "/images/home/8.jpg", url: "/images/home/8.jpg" },
  { key: "event2", name: "Private Events — Photo 2 / Private Celebrations", fallback: "/images/home/7.jpg", url: "/images/home/7.jpg" },
  { key: "event3", name: "Private Events — Photo 3 / Intimate Gatherings", fallback: "/images/home/3.jpg", url: "/images/home/3.jpg" },
  { key: "contactHero", name: "Contact Hero", fallback: "/images/home/6.jpg", url: "/images/home/6.jpg" },
];

export default function MediaPage() {
  const [images, setImages] = useState<MediaItem[]>(initialImages);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("");
  const singleInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "siteSettings", "media"));
        const data = snap.data();
        const saved = data?.images as Record<string, { url?: string; publicId?: string; storagePath?: string }> | undefined;

        if (saved) {
          setImages((items) =>
            items.map((item) => ({
              ...item,
              url: saved[item.key]?.url || item.fallback,
              publicId: saved[item.key]?.publicId || undefined,
            }))
          );
        }

        if (Array.isArray(data?.gallery)) {
          setGallery(data.gallery);
        }
      } catch (error) {
        console.error(error);
        setMessage("Media could not be loaded.");
      }
    })();
  }, []);

  async function persist(nextImages: MediaItem[], nextGallery = gallery) {
    const user = auth.currentUser;
    if (!user) throw new Error("Session expired");

    await setDoc(
      doc(db, "siteSettings", "media"),
      {
        images: Object.fromEntries(
          nextImages.map((item) => [
            item.key,
            {
              name: item.name,
              url: item.url,
              publicId: item.publicId || "",
            },
          ])
        ),
        gallery: nextGallery,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        updatedByEmail: user.email || "",
      },
      { merge: true }
    );
  }

  function chooseSingle(key: string) {
    setTarget(key);
    singleInput.current?.click();
  }

  async function uploadSingle(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !target) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("Image must be smaller than 10 MB.");
      return;
    }

    const old = images.find((item) => item.key === target);
    if (!old) return;

    setBusy(target);
    setMessage(`Uploading ${old.name}...`);

    try {
      const uploaded = await uploadToCloudinary(file, `lalara/sections/${target}`);

      const next = images.map((item) =>
        item.key === target
          ? { ...item, url: uploaded.url, publicId: uploaded.publicId }
          : item
      );

      await persist(next);
      setImages(next);

      setMessage(`${old.name} updated ✓`);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed.");
    } finally {
      setBusy("");
    }
  }

  async function removeSingle(item: MediaItem) {
    if (!confirm(`Remove custom ${item.name} image and restore original?`)) return;

    setBusy(item.key);

    try {
      const next = images.map((current) =>
        current.key === item.key
          ? { ...current, url: current.fallback, publicId: undefined }
          : current
      );

      await persist(next);
      setImages(next);
      setMessage(`${item.name} restored ✓`);
    } catch (error) {
      console.error(error);
      setMessage("Delete failed.");
    } finally {
      setBusy("");
    }
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const invalid = files.find(
      (file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024
    );

    if (invalid) {
      setMessage("Gallery accepts image files up to 10 MB each.");
      return;
    }

    setBusy("gallery");
    setMessage(`Uploading ${files.length} gallery image(s)...`);

    try {
      const uploaded: GalleryItem[] = [];

      for (const file of files) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const result = await uploadToCloudinary(file, "lalara/gallery");

        uploaded.push({
          id,
          url: result.url,
          publicId: result.publicId,
          name: file.name,
        });
      }

      const next = [...gallery, ...uploaded];
      await persist(images, next);
      setGallery(next);
      setMessage("Gallery updated ✓");
    } catch (error) {
      console.error(error);
      setMessage("Gallery upload failed.");
    } finally {
      setBusy("");
    }
  }

  async function removeGallery(item: GalleryItem) {
    if (!confirm("Delete this gallery image?")) return;

    setBusy(item.id);

    try {
      // The asset is removed from the website/Firestore here.
      // Physical Cloudinary deletion will be handled later by a signed server endpoint.
      const next = gallery.filter((current) => current.id !== item.id);
      await persist(images, next);
      setGallery(next);
      setMessage("Gallery image deleted ✓");
    } catch (error) {
      console.error(error);
      setMessage("Gallery delete failed.");
    } finally {
      setBusy("");
    }
  }

  async function moveGallery(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const next = [...gallery];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];

    setGallery(next);
    await persist(images, next);
    setMessage("Gallery order saved ✓");
  }

  return (
    <AdminShell eyebrow="Website" title="Media Library">
      <input
        ref={singleInput}
        type="file"
        accept="image/*"
        hidden
        onChange={uploadSingle}
      />

      <input
        ref={galleryInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={uploadGallery}
      />

      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Photography</p>
          <h1>Media library.</h1>
        </div>
      </div>

      {message && <p className="admin-save-message">{message}</p>}

      <section className="admin-panel-card">
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">Website sections</p>
            <h2>Single images</h2>
          </div>
        </div>

        <div className="media-grid">
          {images.map((item) => (
            <article className="media-card" key={item.key}>
              <img src={item.url} alt={item.name} />

              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.publicId ? "Cloudinary" : "Original website image"}
                </span>
              </div>

              <div className="admin-form-actions">
                <button
                  disabled={busy === item.key}
                  onClick={() => chooseSingle(item.key)}
                >
                  Replace
                </button>

                <button
                  disabled={busy === item.key || !item.publicId}
                  onClick={() => removeSingle(item)}
                >
                  Restore original
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-panel-card" style={{ marginTop: 24 }}>
        <div className="admin-card-heading">
          <div>
            <p className="admin-eyebrow">Gallery</p>
            <h2>Multiple images</h2>
          </div>

          <button
            className="admin-button primary"
            disabled={busy === "gallery"}
            onClick={() => galleryInput.current?.click()}
          >
            Add photos
          </button>
        </div>

        {gallery.length === 0 ? (
          <p className="admin-save-message">
            No custom gallery photos yet. The website uses its original images.
          </p>
        ) : (
          <div className="media-grid">
            {gallery.map((item, index) => (
              <article className="media-card" key={item.id}>
                <img src={item.url} alt={item.name || `Gallery ${index + 1}`} />

                <div>
                  <strong>{item.name || `Gallery image ${index + 1}`}</strong>
                  <span>Position {index + 1}</span>
                </div>

                <div className="admin-form-actions">
                  <button
                    disabled={index === 0}
                    onClick={() => moveGallery(index, -1)}
                  >
                    ← Earlier
                  </button>

                  <button
                    disabled={index === gallery.length - 1}
                    onClick={() => moveGallery(index, 1)}
                  >
                    Later →
                  </button>

                  <button
                    disabled={busy === item.id}
                    onClick={() => removeGallery(item)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
