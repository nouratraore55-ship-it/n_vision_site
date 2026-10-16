import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import realisationBstp from '../assets/realisation-bstp.jpg';
import './Realisations.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// Affichée tant qu'aucune réalisation n'a été ajoutée depuis l'admin.
const DEFAULT_REALISATIONS = [
  {
    id: 'defaut-bstp',
    title: 'Carte de visite entreprise',
    lieu: 'Abidjan, CI',
    description: "Refonte du design et impression des cartes de visite de la BSTP, aux couleurs de l'institution.",
    src: realisationBstp,
  },
];

export default function Realisations() {
  const [projets, setProjets] = useState(DEFAULT_REALISATIONS);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/realisations`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled || !Array.isArray(data) || !data.length) return;
        setProjets(
          data.map((r) => ({
            ...r,
            src: r.hasImage ? `${API_URL}/api/site-images/${r.id}/file?v=${encodeURIComponent(r.updatedAt || '')}` : null,
          }))
        );
      })
      .catch(() => {
        // silencieux : la réalisation par défaut reste affichée
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Réalisations</p>
          <h1>Quelques-uns de nos projets</h1>
          <p className="page-hero-sub">
            Des emballages et supports imprimés aux couleurs de nos clients.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {projets.map((p) => (
              <div className="realisation-card" key={p.id}>
                {p.src ? (
                  <img className="realisation-img" src={p.src} alt={p.title} />
                ) : (
                  <div className="realisation-img realisation-img-empty">Photo à venir</div>
                )}
                <div className="realisation-body">
                  <h3>{p.title}</h3>
                  {p.lieu && <p className="realisation-lieu">{p.lieu}</p>}
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container cta-inline">
          <div>
            <h2>Un projet en tête ?</h2>
            <p>Parlez-nous de votre packaging, on vous prépare un devis.</p>
          </div>
          <Link to="/devis" className="btn btn-primary">Demander un devis</Link>
        </div>
      </section>
    </>
  );
}
