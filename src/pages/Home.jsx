import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SiteImage from '../components/SiteImage';
import { IlluPackaging, IlluSacs, IlluPapier, IlluCartes } from '../components/Illustrations';
import logoCreme from '../assets/logo-creme.png';
import realisationBstp from '../assets/realisation-bstp.jpg';
import '../nv.css';
import './Home.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const Arrow = () => (
  <svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8" /></svg>
);
const ImgIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" fill="none" strokeWidth="1.5" /><circle cx="9" cy="10" r="2" fill="none" strokeWidth="1.5" /><path d="M3 17l5-4 4 3 3-2 6 4" fill="none" strokeWidth="1.5" /></svg>
);

const SERVICES = [
  {
    slot: 'service-packaging',
    title: ['Packaging', 'personnalisé'],
    chips: ['Votre logo', 'Vos couleurs', 'Vos formats', 'Vos finitions'],
    text: 'Choisissez le support, ajoutez votre identité : nous imprimons votre marque sur tout ce qui accompagne vos produits.',
    Illu: IlluPackaging,
  },
  {
    slot: 'service-sacs',
    title: ['Sacs', '& cartons'],
    chips: ['Kraft', 'Plastique', 'Zip'],
    text: 'Kraft, plastique ou zip, imprimés à votre logo.',
    Illu: IlluSacs,
  },
  {
    slot: 'service-papier-de-soie',
    title: ['Papier', 'de soie'],
    chips: ['Motifs', 'Couleurs'],
    text: 'Imprimé à vos motifs et couleurs.',
    Illu: IlluPapier,
  },
  {
    slot: 'service-cartes',
    title: ['Cartes', '& stickers'],
    chips: ['Cartes de visite', 'Cartes de remerciement', 'Stickers'],
    text: 'Cartes de visite, cartes de remerciement et autocollants à votre logo.',
    Illu: IlluCartes,
  },
];

const STEPS = [
  { n: '01', pos: 'down', title: 'Votre demande', text: "Vous remplissez le questionnaire de devis : type d'emballage, quantité, logo et idées de design." },
  { n: '02', pos: 'up', title: 'Conception', text: 'Nous préparons une proposition de design et un devis adaptés à vos besoins et à votre budget.' },
  { n: '03', pos: 'down', title: 'Validation', text: "Vous recevez le devis par lien, vous l'acceptez et nous lançons la production." },
  { n: '04', pos: 'up', title: 'Livraison', text: "Vos emballages personnalisés sont fabriqués avec soin puis livrés, prêts à l'emploi." },
];

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

function HeroFallback() {
  return <img className="hero-mark" src={logoCreme} alt="" aria-hidden="true" />;
}

function ServiceCard({ s, active, onActivate }) {
  const { Illu } = s;
  return (
    <div
      className={`svc-card ${active ? 'active' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) onActivate(); }}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); } }}
    >
      <SiteImage slot={s.slot} label={s.title.join(' ')} ratio={null} className="svc-photo" fallback={<Illu />} />
      <div className="ov" />
      <div className="chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
      <Link to="/services" className="arr" aria-label={`Voir le service ${s.title.join(' ')}`} onClick={(e) => e.stopPropagation()}>
        <Arrow />
      </Link>
      <div className="cin">
        <h3>{s.title[0]} <br />{s.title[1]}</h3>
        <p>{s.text}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeSvc, setActiveSvc] = useState(0);
  const [realisations, setRealisations] = useState(DEFAULT_REALISATIONS);
  const [wi, setWi] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/api/realisations`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled || !Array.isArray(data) || !data.length) return;
        setRealisations(
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

  const work = realisations[wi % realisations.length];

  return (
    <div className="nv">
      {/* HERO */}
      <header className="hero">
        <div className="ph dark" />
        <SiteImage slot="home-hero" label="N Vision" ratio={null} allowVideo className="hero-photo" fallback={<HeroFallback />} />
        <Navbar overlay />
        <div className="hero-in wrap">
          <div className="hero-body">
            <div>
              <h1>Un packaging<br />à votre image</h1>
              <p>Votre logo, vos couleurs, vos formats : nous personnalisons chaque emballage pour qu'il porte votre marque, du sac kraft au sticker.</p>
              <div className="cta">
                <Link to="/devis" className="btn btn-light">Demander un devis</Link>
                <a href="#realisations" className="link">Voir nos réalisations</a>
              </div>
            </div>
            <div className="glass">
              <div className="top">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z" /><path d="M14 7l3 3" /></svg>
                <Link to="/services" className="circ" aria-label="Voir les services"><Arrow /></Link>
              </div>
              <h3>100 % personnalisable</h3>
              <p>Logo, couleurs et finitions sur vos sacs, papier de soie, cartes et autocollants.</p>
            </div>
          </div>
        </div>
      </header>

      {/* VALEURS */}
      <section id="apropos">
        <div className="wrap">
          <div className="vals-top">
            <span className="tag">Valeurs</span>
            <div className="vals-list">
              <div>Packaging personnalisé <b>01</b></div>
              <div>Logo &amp; couleurs de marque <b>02</b></div>
            </div>
          </div>
          <div className="vals-head">
            <h2>Un emballage <span className="soft">qui vous</span><br />ressemble</h2>
            <Link to="/devis" className="btn btn-dark">Demander un devis</Link>
          </div>
          <div className="vals-grid">
            <SiteImage
              slot="home-valeurs"
              label="N Vision"
              ratio={null}
              className="vals-photo"
              fallback={<div className="ph vals-ph"><ImgIcon /></div>}
            />
            <div className="feats">
              <div className="feat">
                <div className="ico"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" /></svg></div>
                <h3>Le souci du détail</h3>
                <p>Chaque couleur, chaque finition est choisie pour que votre emballage donne envie d'être partagé.</p>
              </div>
              <div className="feat">
                <div className="ico"><svg viewBox="0 0 24 24"><path d="M9 15l6-6M10 6l1-1a4 4 0 016 6l-1 1M14 18l-1 1a4 4 0 01-6-6l1-1" /></svg></div>
                <h3>Un vrai accompagnement</h3>
                <p>Nous partons de votre logo et de vos idées pour proposer un design qui fonctionne en production.</p>
              </div>
              <div className="feat">
                <div className="ico"><svg viewBox="0 0 24 24"><path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19zM5 19l7-7" /></svg></div>
                <h3>Matières responsables</h3>
                <p>Kraft recyclable et papiers de qualité pour un emballage solide et plus respectueux.</p>
              </div>
              <div className="feat">
                <div className="ico"><svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></svg></div>
                <h3>Des designs uniques</h3>
                <p>Couleurs, impressions, autocollants : votre packaging se distingue de celui des autres.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="steps">
        <div className="wrap">
          <div className="steps-head">
            <h2>Quatre étapes pour<br />votre <span className="soft">packaging</span> sur mesure</h2>
            <span className="tag">Comment ça marche</span>
          </div>
          <div className="tl">
            {STEPS.map((st) => (
              <div className={`st ${st.pos}`} key={st.n}>
                <div className="tx">
                  <h3><span>{st.n}</span>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="wrap">
          <div className="sv-head">
            <span className="tag">Services</span>
            <Link to="/services" className="link">Voir tous les services</Link>
          </div>
          <div className="svc-cards">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.slot} s={s} active={activeSvc === i} onActivate={() => setActiveSvc(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section id="realisations">
        <div className="wrap">
          <div className="wk-head">
            <h2>Découvrez nos<br /><span className="soft">dernières</span> réalisations</h2>
            <span className="tag">Réalisations</span>
          </div>
          <div className={`slider ${realisations.length < 2 ? 'single' : ''}`}>
            <div className="wk-main">
              {work.src ? (
                <img src={work.src} alt={work.title} />
              ) : (
                <div className="ph"><ImgIcon />Photo à venir</div>
              )}
            </div>
            {realisations.length > 1 && (
              <div className="next">
                <div className="ph next-ph" />
                <button type="button" onClick={() => setWi((v) => (v + 1) % realisations.length)}>SUIVANT</button>
              </div>
            )}
          </div>
          <div className="meta">
            <div><small>Projet</small><b>{work.title}</b></div>
            <div><small>Lieu</small><b>{work.lieu || '—'}</b></div>
            <p>{work.description}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="ph dark" />
        <div className="wrap">
          <h2>Prêt à personnaliser votre packaging ?</h2>
          <Link to="/devis" className="btn btn-light cta-btn">Demander un devis</Link>
        </div>
      </section>
    </div>
  );
}
