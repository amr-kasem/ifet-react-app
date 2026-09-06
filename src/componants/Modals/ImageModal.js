import React, { useEffect } from 'react';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, imageSrc, altText = "Image" }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.imageModalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.imageModalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <img 
          src={imageSrc} 
          alt={altText} 
          className={styles.fullImage}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default ImageModal;
