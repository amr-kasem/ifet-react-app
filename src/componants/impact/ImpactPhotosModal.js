import React, { useState } from "react";
import ImageModal from "../Modals/ImageModal";
import styles from "./ImpactPhotosModal.module.css";
import { impactPhotoUrl } from "./impactApi";

// Photographs are grouped by where they belong: attempt-level first, then one
// section per impact. Reading each impact's own list (rather than the
// attempt's, which contains both) is what keeps files from appearing twice.
const ImpactPhotosModal = ({
  visible,
  attempt,
  attemptPhotos,
  shots,
  onClose,
}) => {
  const [fullPhoto, setFullPhoto] = useState(null);

  if (!visible) return null;

  const groups = [
    { key: "attempt", title: "Attempt photographs", photos: attemptPhotos },
    ...shots.map((shot) => ({
      key: `shot-${shot.id}`,
      title: `Impact ${shot.shot_number} — ${shot.result ? "Pass" : "Fail"}`,
      photos: shot.photos || [],
    })),
  ];

  const total = groups.reduce((n, g) => n + g.photos.length, 0);

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>
              Photographs ({total})
              {attempt && (
                <span className={styles.subtitle}>
                  Attempt {attempt.trial_number}
                  {attempt.operator_name ? ` · ${attempt.operator_name}` : ""}
                </span>
              )}
            </h3>
            <button type="button" className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          </div>

          <div className={styles.body}>
            {total === 0 ? (
              <p className={styles.empty}>No photographs on this attempt yet.</p>
            ) : (
              groups.map((group) => (
                <section key={group.key} className={styles.group}>
                  <h4 className={styles.groupTitle}>
                    {group.title}
                    <span className={styles.groupCount}>
                      {group.photos.length}
                    </span>
                  </h4>

                  {group.photos.length === 0 ? (
                    // A photograph count of zero is normal.
                    <p className={styles.groupEmpty}>None</p>
                  ) : (
                    <div className={styles.grid}>
                      {group.photos.map((photo) => {
                        const url = impactPhotoUrl(photo);
                        return (
                          <figure key={photo.id} className={styles.card}>
                            {url ? (
                              <img
                                src={url}
                                alt={photo.filename || "Impact photograph"}
                                className={styles.image}
                                onClick={() => setFullPhoto(photo)}
                              />
                            ) : (
                              // The API exposes no URL for a stored photograph
                              // yet - see impactPhotoUrl.
                              <div className={styles.imageStub}>
                                <span>uploaded</span>
                                <small>no preview available</small>
                              </div>
                            )}
                            <figcaption
                              className={styles.caption}
                              title={photo.note || photo.filename}
                            >
                              {photo.note || photo.filename}
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))
            )}
          </div>

          <p className={styles.footnote}>
            Photographs are append-only — there is no delete. They freeze once
            the attempt has been reviewed. The API does not yet return a URL for
            a stored photograph, so they are listed rather than shown.
          </p>
        </div>
      </div>

      <ImageModal
        isOpen={fullPhoto !== null}
        onClose={() => setFullPhoto(null)}
        imageSrc={fullPhoto ? impactPhotoUrl(fullPhoto) || "" : ""}
        altText={fullPhoto?.filename || "Impact photograph"}
      />
    </>
  );
};

export default ImpactPhotosModal;
