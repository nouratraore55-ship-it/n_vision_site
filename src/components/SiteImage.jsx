import { useEffect, useState } from 'react';
import PlaceholderImage from './PlaceholderImage';
import './SiteImage.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// Affiche une photo (ou, si autorisé, une vidéo) gérée depuis l'admin,
// identifiée par "slot" (ex: "accueil-hero"). Si aucun fichier n'a encore été
// mis en ligne pour cet emplacement, on retombe automatiquement sur le
// visuel de remplacement (PlaceholderImage).
//
// `allowVideo` : à activer uniquement pour les emplacements qui peuvent
// recevoir une vidéo (ex: le hero) — ça évite un appel réseau
// supplémentaire (vérification du type de fichier) pour tous les autres
// emplacements, qui sont toujours des images.
// `fallback` : ce qu'on affiche s'il n'y a pas de fichier (par défaut, un
// visuel de remplacement). Ex : le logo animé du hero, ou un dessin de service.
// `ratio={null}` : l'image remplit son conteneur (pas de proportion imposée).
export default function SiteImage({ slot, label, ratio = '4 / 3', className = '', allowVideo = false, fallback, version = '' }) {
  const [failed, setFailed] = useState(false);
  const [mimeType, setMimeType] = useState(allowVideo ? null : 'image');
  const fileUrl = `${API_URL}/api/site-images/${slot}/file${version ? `?v=${version}` : ''}`;
  const style = ratio ? { aspectRatio: ratio } : undefined;

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
  }, [slot, allowVideo, version]);

  if (failed) {
    if (fallback !== undefined) return fallback;
    return <PlaceholderImage label={label} ratio={ratio || '4 / 3'} className={className} />;
  }

  if (allowVideo && mimeType === null) {
    // Vérification du type de fichier en cours : on montre déjà le visuel par
    // défaut (ex : logo animé du hero), pour qu'il ne démarre pas en retard.
    if (fallback !== undefined) return fallback;
    return <div className={`site-img site-img-loading ${className}`} style={style} />;
  }

  if (mimeType && mimeType.startsWith('video/')) {
    return (
      <video
        src={fileUrl}
        className={`site-img ${className}`}
        style={style}
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
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
