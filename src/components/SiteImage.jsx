import { useEffect, useState } from 'react';
import PlaceholderImage from './PlaceholderImage';
import './SiteImage.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// Affiche une photo (ou, si autorisé, une vidéo) gérée depuis l'admin,
// identifiée par "slot" (ex: "home-hero"). Si aucun fichier n'a encore été
// mis en ligne pour cet emplacement, on retombe automatiquement sur le
// visuel de remplacement (PlaceholderImage).
//
// `allowVideo` : à activer uniquement pour les emplacements qui peuvent
// recevoir une vidéo (ex: le hero) — ça évite un appel réseau
// supplémentaire (vérification du type de fichier) pour tous les autres
// emplacements, qui sont toujours des images.
export default function SiteImage({ slot, label, ratio = '4 / 3', className = '', allowVideo = false }) {
  const [failed, setFailed] = useState(false);
  const [mimeType, setMimeType] = useState(allowVideo ? null : 'image');
  const fileUrl = `${API_URL}/api/site-images/${slot}/file`;

  useEffect(() => {
    if (!allowVideo) return;
    let cancelled = false;
    setFailed(false);
    setMimeType(null);
    fetch(`${API_URL}/api/site-images/${slot}/meta`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        if (!data.exists) {
          setFailed(true);
        } else {
          setMimeType(data.mimeType || 'image');
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot, allowVideo]);

  if (failed) {
    return <PlaceholderImage label={label} ratio={ratio} className={className} />;
  }

  if (allowVideo && mimeType === null) {
    // Vérification du type de fichier en cours — évite un flash d'image cassée.
    return <div className={`site-img site-img-loading ${className}`} style={{ aspectRatio: ratio }} />;
  }

  if (mimeType && mimeType.startsWith('video/')) {
    return (
      <video
        src={fileUrl}
        className={`site-img ${className}`}
        style={{ aspectRatio: ratio }}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={fileUrl}
      alt={label}
      className={`site-img ${className}`}
      style={{ aspectRatio: ratio }}
      onError={() => setFailed(true)}
    />
  );
}
