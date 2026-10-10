import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteImage from '../components/SiteImage';
import { IconBox, IconTruck, IconCheckShield, IconHeadset, IconArrowRight } from '../components/Icons';
import './Home.css';
import '../pages/Realisations.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const features = [
  { Icon: IconBox, title: 'Sur mesure', text: 'Un emballage pensé pour votre produit et vos volumes.' },
  { Icon: IconTruck, title: 'Délais tenus', text: 'Une production organisée pour livrer à temps.' },
  { Icon: IconCheckShield, title: 'Qualité constante', text: 'Des matériaux fiables, contrôlés à chaque étape.' },
  { Icon: IconHeadset, title: 'Accompagnement', text: 'Un interlocuteur dédié du devis à la livraison.' },
];

const services = [
  {
    n: '01',
    tag: 'Cartons',
    title: 'Cartons ',
    em: 'boîtes',
    text: 'Simple ou double cannelure, aux dimensions exactes de votre produit.',
    chips: ['Simple cannelure', 'Double cannelure'],
    slot: 'home-service-cartons',
  },
  {
    n: '02',
    tag: 'Sacs kraft',
    title: 'Sacs ',
    em: 'kraft',
    text: 'Sacs en papier kraft, résistants et personnalisables, pour un emballage économique et écologique.',
    chips: ['Résistant', 'Écologique'],
    slot: 'home-service-sacs-kraft',
  },
  {
    n: '03',
    tag: 'Sacs plastique',
    title: 'Sacs ',
    em: 'plastique',
    text: 'Sacs plastique adaptés à vos produits, pour la vente, le transport ou le stockage.',
    chips: ['Sur mesure', 'Résistant'],
    slot: 'home-service-sacs-plastique',
  },
  {
    n: '04',
    tag: 'Papier de soie',
    title: 'Papier de ',
    em: 'soie',
    text: "Papier de soie pour l'emballage cadeau, la protection ou la présentation de vos produits.",
    chips: ['Coloris variés', 'Présentation soignée'],
    slot: 'home-service-papier-de-soie',
  },
  {
    n: '05',
    tag: 'Cartes de remerciement',
    title: 'Cartes de ',
    em: 'remerciement',
    text: 'Cartes de remerciement personnalisées à glisser dans vos commandes, pour soigner l\'expérience client.',
    chips: ['Personnalisable', 'Petites séries'],
    slot: 'home-service-cartes-remerciement',
  },
  {
    n: '06',
    tag: 'Autocollants',
    title: '',
    em: 'Autocollants',
    text: 'Autocollants personnalisés pour tous vos produits et emballages, logo ou design au choix.',
    chips: ['Tous formats', 'Logo personnalisé'],
    slot: 'home-service-autocollants',
  },
];

const projetsFallback = [
  { slot: 'realisation-1', title: 'Projet 1', description: 'Description courte du projet, du besoin client et de la solution apportée.' },
  { slot: 'realisation-2', title: 'Projet 2', description: 'Description courte du projet, du besoin client et de la solution apportée.' },
  { slot: 'realisation-3', title: 'Projet 3', description: 'Description courte du projet, du besoin client et de la solution apportée.' },
];

const steps = [
  { n: '01', title: 'Remplissez le questionnaire', text: 'Quelques questions sur votre produit et vos besoins.' },
  { n: '02', title: 'Recevez votre devis', text: 'Nous étudions votre demande et vous envoyons une offre chiffrée.' },
  { n: '03', title: 'Validez et recevez', text: 'Vous acceptez le devis, on lance la production et la livraison.' },
];

export default function Home() {
  const solutionsRef = useRef(null);
  const [activeSolution, setActiveSolution] = useState(0);
  const [projets, setProjets] = useState(projetsFallback);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/realisations`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) setProjets(data.slice(0, 3));
      })
      .catch(() => {
        // silencieux : les projets par défaut restent affichés
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollSolutions = (dir) => {
    const el = solutionsRef.current;
    if (!el) return;
    const card = el.querySelector('.solution-card');
    const step = card ? card.offsetWidth + 24 : 320;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const handleSolutionsScroll = () => {
    const el = solutionsRef.current;
    if (!el) return;
    const card = el.querySelector('.solution-card');
    const step = card ? card.offsetWidth + 24 : 320;
    const idx = Math.round(el.scrollLeft / step);
    setActiveSolution(Math.max(0, Math.min(idx, services.length - 1)));
  };

  return (
    <>
      <section className="hero-stage">
        <div className="hero">
          <SiteImage
            slot="home-hero"
            label="Photo hero — atelier, produits ou entrepôt"
            ratio="1 / 1"
            className="hero-bg"
            allowVideo
          />
          <div className="hero-overlay" />

          <div className="container hero-top">
            <p className="hero-topline">
              Votre emballage mérite d'être fiable. Nous concevons des solutions
              qui protègent vos produits et donnent une bonne image à votre marque.
              {/* Remplacez cette phrase par le slogan officiel dès qu'il est prêt. */}
            </p>
          </div>

          <div className="container hero-content">
            <div className="hero-brand">
              <h1 className="hero-brand-name">N Vision</h1>
              <span className="hero-brand-tag">Packaging</span>
            </div>
            <div className="hero-actions">
              <Link to="/devis" className="btn btn-primary">Demander un devis</Link>
              <Link to="/services" className="btn btn-outline-light">Voir nos services</Link>
            </div>
          </div>
        </div>

        <div className="about-reveal">
          <div className="container">
            <div className="about-bubble">
              <div className="about-bubble-left">
                <h2 className="about-title">Qu'est-ce que <em>N Vision</em> ?</h2>
                <Link to="/devis" className="about-cta">
                  Demander un devis <IconArrowRight width={16} height={16} strokeWidth={2} />
                </Link>
              </div>
              <div className="about-bubble-right">
                <p className="about-text">
                  N Vision est une entreprise de <em>packaging</em> qui conçoit des solutions
                  d'emballage <em>sur mesure</em>{' '}
                  <span className="about-chip" aria-hidden="true"><IconBox /></span>{' '}
                  pour les entreprises de tous secteurs, du carton standard aux volumes
                  industriels complets{' '}
                  <span className="about-chip" aria-hidden="true"><IconTruck /></span>{' '}
                  avec un <em>accompagnement</em> dédié à chaque étape.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section features-row">
        <div className="container">
          <div className="grid grid-4">
            {features.map((f) => (
              <div className="feature-item" key={f.title}>
                <span className="feature-icon"><f.Icon /></span>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section solutions-band">
        <div className="container">
          <div className="section-heading">
            <h2>Nos solutions</h2>
            <Link to="/services" className="see-all">Voir tous les services →</Link>
          </div>
        </div>

        <div className="solutions-scroll" ref={solutionsRef} onScroll={handleSolutionsScroll}>
          {services.map((s, i) => (
            <div
              className={`solution-card ${i === activeSolution ? 'is-active' : ''}`}
              key={s.n}
              onMouseEnter={() => setActiveSolution(i)}
              onFocus={() => setActiveSolution(i)}
              tabIndex={0}
            >
              <div className="solution-card-media">
                <SiteImage slot={s.slot} label={`Photo — ${s.tag}`} ratio="4 / 3" className="solution-card-img" />
                <span className="solution-card-number">{s.n}</span>
              </div>
              <div className="solution-card-body">
                <span className="solution-card-tag">{s.tag}</span>
                <h3>{s.title}<em>{s.em}</em></h3>
                <span className="solution-card-divider" />
                <p>{s.text}</p>
                <Link to="/devis" className="solution-card-btn" aria-label={`Demander un devis — ${s.tag}`}>
                  <IconArrowRight width={16} height={16} strokeWidth={2} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="container solutions-nav">
          <div className="solutions-arrows">
            <button
              type="button"
              className="solutions-arrow"
              onClick={() => scrollSolutions(-1)}
              aria-label="Solution précédente"
            >
              <IconArrowRight width={16} height={16} strokeWidth={2} className="solutions-arrow-icon" />
            </button>
            <button
              type="button"
              className="solutions-arrow"
              onClick={() => scrollSolutions(1)}
              aria-label="Solution suivante"
            >
              <IconArrowRight width={16} height={16} strokeWidth={2} />
            </button>
          </div>
          <div className="solutions-dots">
            {services.map((s, i) => (
              <span
                key={s.n}
                className={`solutions-dot ${i === activeSolution ? 'is-active' : ''}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section projects-preview">
        <div className="container">
          <div className="section-heading">
            <h2>Nos réalisations</h2>
            <Link to="/realisations" className="see-all">Voir tous nos projets →</Link>
          </div>
          <div className="grid grid-3" style={{ marginTop: 32 }}>
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

      <section className="section">
        <div className="container">
          <div className="steps-bubble">
            <h2>Comment ça marche</h2>
            <div className="grid grid-3 steps-grid">
              {steps.map((s) => (
                <div className="step" key={s.n}>
                  <span className="step-number">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Prêt à démarrer<br />votre projet ?</h2>
            <p>Décrivez votre besoin en quelques minutes, on s'occupe du reste.</p>
            <Link to="/devis" className="cta-card-btn">
              Demander un devis <IconArrowRight width={18} height={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
