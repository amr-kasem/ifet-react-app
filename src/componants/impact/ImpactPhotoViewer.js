import React, { useCallback, useEffect, useState } from "react";
import styles from "./ImpactPhotoViewer.module.css";
import { impactPhotoUrl } from "./impactApi";

// A gallery for impact evidence: thumbnails that open a full-size viewer with
// keyboard navigation.
//
// Photographs are append-only and freeze at review, so this is read-only by
// design - there is no delete, and there is no route that would provide one.
//
// `impactPhotoUrl` returns null while the API exposes no location for a stored
// photograph. The tile then names the file rather than rendering a broken
// image, and says why on hover. The moment PhotoSchema carries `path` (or
// `url`/`stored_filename`) these become real thumbnails with no change here.

const labelOf = (photo) =>
  photo?.note || photo?.filename || (photo ? `photo ${photo.id}` : "");

const takenAt = (photo) => {
  if (!photo?.created_at) return null;
  const d = new Date(photo.created_at);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString();
};

// --- the full-size viewer -------------------------------------------------
export const PhotoLightbox = ({ photos, index, onIndex, onClose }) => {
  const count = photos.length;
  const photo = photos[index];

  const step = useCallback(
    (by) => onIndex((index + by + count) % count),
    [index, count, onIndex]
  );

  // Arrow keys and Escape, because a gallery that needs the mouse for every
  // photograph is slower than the table it replaced.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  if (!photo) return null;
  const url = impactPhotoUrl(photo);
  const when = takenAt(photo);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.viewer}>
        <div className={styles.viewerBar}>
          <span className={styles.viewerTitle} title={labelOf(photo)}>
            {labelOf(photo)}
          </span>
          <span className={styles.counter}>
            {index + 1} of {count}
          </span>
          <button type="button" className={styles.close} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.stage}>
          {count > 1 && (
            <button
              type="button"
              className={`${styles.nav} ${styles.prev}`}
              onClick={() => step(-1)}
              title="Previous (left arrow)"
            >
              &#8249;
            </button>
          )}

          {url ? (
            <img src={url} alt={labelOf(photo)} className={styles.full} />
          ) : (
            <div className={styles.unavailable}>
              <strong>{photo.filename || `photo ${photo.id}`}</strong>
              <span>
                This photograph is stored, but the API does not yet return its
                location, so it cannot be displayed.
              </span>
            </div>
          )}

          {count > 1 && (
            <button
              type="button"
              className={`${styles.nav} ${styles.next}`}
              onClick={() => step(1)}
              title="Next (right arrow)"
            >
              &#8250;
            </button>
          )}
        </div>

        <div className={styles.meta}>
          {photo.note && <span className={styles.note}>{photo.note}</span>}
          {when && <span className={styles.when}>{when}</span>}
          {url && (
            <a
              className={styles.openOriginal}
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              Open original
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// --- the thumbnails -------------------------------------------------------
const ImpactPhotoViewer = ({ photos, empty = "none" }) => {
  const [open, setOpen] = useState(null);

  const list = photos || [];
  if (list.length === 0) return <span className={styles.muted}>{empty}</span>;

  return (
    <>
      <div className={styles.strip}>
        {list.map((photo, i) => {
          const url = impactPhotoUrl(photo);
          const label = labelOf(photo);
          return url ? (
            <button
              key={photo.id}
              type="button"
              className={styles.thumbButton}
              onClick={() => setOpen(i)}
              title={label}
            >
              <img src={url} alt={label} className={styles.thumb} />
            </button>
          ) : (
            <button
              key={photo.id}
              type="button"
              className={styles.stub}
              onClick={() => setOpen(i)}
              title={`${label} — stored, but the API returns no location for it yet`}
            >
              {photo.filename || `photo ${photo.id}`}
            </button>
          );
        })}
      </div>

      {open !== null && (
        <PhotoLightbox
          photos={list}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
};

export default ImpactPhotoViewer;
