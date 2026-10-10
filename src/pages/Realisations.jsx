import { useEffect, useState } from 'react';
import SiteImage from '../components/SiteImage';
import './Realisations.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const fallback = new Array(6).fill(null).map((_, i) => ({
  slot: `realisation-${i + 1}`,
  title: `Projet ${i + 1}`,
  description: 'Description courte du projet, du besoin client et de la solution apportée.',
}));

export default function Realisations() {
  const [projets, setProjets] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/realisations`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) setProjets(data);
      })
      .catch(() => {
        // silencieux : les projets par défaut restent affichés
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Réalisations</p>
          <h1>Quelques exemples de nos projets</h1>
          <p className="page-hero-sub">
            Cette page accueillera bientôt des photos et des cas clients réels.
            Pour l'instant, voici l'emplacement prévu pour chaque réalisation.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {projets.map((p) => (
              <div className="realisation-card" key={p.slot}>
                <SiteImage slot={p.slot} label={`Photo — ${p.title}`} />
                <div className="realisation-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
