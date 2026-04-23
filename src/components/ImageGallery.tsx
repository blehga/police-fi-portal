"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Photo = {
  id: string;
  url: string;
};

function Lightbox({
  photos,
  idx,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  idx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/90"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-7xl max-h-[92vh]">
          <div
            className="w-full h-full rounded-lg"
            style={{
              backgroundImage: `url("${photos[idx].url}")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-4 text-white text-3xl leading-none"
            aria-label="Close"
            title="Close"
          >
            ×
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-4xl leading-none"
                aria-label="Previous"
                title="Previous"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-4xl leading-none"
                aria-label="Next"
                title="Next"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ImageGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openAt = (i: number) => {
    setIdx(i);
    setOpen(true);
  };

  const close = () => setOpen(false);
  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx((i) => (i + 1) % photos.length);

  if (!photos?.length) return null;

  return (
    <>
      <div className="flex gap-3 flex-wrap">
        {photos.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => openAt(i)}
            aria-label="Open photo"
            title="View"
            className="relative"
          >
            <img
              src={p.url}
              alt=""
              className="w-32 h-32 rounded-md border object-cover hover:opacity-90"
            />
          </button>
        ))}
      </div>

      {mounted && open && (
        <Lightbox
          photos={photos}
          idx={idx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  );
}