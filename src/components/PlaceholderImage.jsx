import './PlaceholderImage.css';

/**
 * Emplacement réservé pour une vraie photo.
 * Remplacez simplement ce composant par une balise <img src="..." /> une fois
 * les photos disponibles (produits, réalisations, locaux, etc.).
 */
export default function PlaceholderImage({ label = 'Photo à ajouter', ratio = '4 / 3', className = '' }) {
  return (
    <div className={`placeholder-img ${className}`} style={{ aspectRatio: ratio }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="8" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 16.5L8.5 12l4 3.2L16 12l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
