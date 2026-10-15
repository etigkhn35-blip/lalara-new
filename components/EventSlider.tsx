"use client";

import { useState } from "react";
import Image from "next/image";

type EventImage = {
  src: string;
  alt: string;
};

type EventSliderProps = {
  images: EventImage[];
};

export default function EventSlider({
  images,
}: EventSliderProps) {
  const [current, setCurrent] = useState(0);

  if (!images.length) return null;

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="event-slider">
      <div className="event-slider-track">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={`event-slider-slide ${
              index === current ? "is-active" : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className="cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="event-slider-arrow event-slider-arrow-left"
            onClick={previousSlide}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            className="event-slider-arrow event-slider-arrow-right"
            onClick={nextSlide}
            aria-label="Next image"
          >
            →
          </button>

          <div className="event-slider-counter">
            <span>
              {String(current + 1).padStart(2, "0")}
            </span>

            <i />

            <span>
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
        </>
      )}
    </div>
  );
}