import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logoCreme from '../assets/logo-creme.png';
import logoRuby from '../assets/logo-ruby.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/faq', label: 'FAQ' },
];

// overlay = barre en verre posée sur le hero de l'accueil (texte crème).
// Sinon : barre blanche classique, en haut des autres pages.
export default function Navbar({ overlay = false }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`nvbar ${overlay ? 'nvbar-overlay' : 'nvbar-solid'}`}>
      <div className="nvbar-wrap">
        <nav className="nvbar-inner" aria-label="Navigation principale">
          <Link to="/" className="nvbar-brand" onClick={close}>
            <img src={overlay ? logoCreme : logoRuby} alt="Logo N Vision" />
            <span>N VISION</span>
          </Link>

          <div className="nvbar-links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="nvbar-right">
            <Link to="/devis" className="nvbar-cta">Demander un devis</Link>
            <button
              type="button"
              className="nvbar-burger"
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
            </button>
          </div>
        </nav>

        {open && (
          <div className="nvbar-mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={close}>{l.label}</NavLink>
            ))}
            <Link to="/devis" onClick={close} className="nvbar-mobile-cta">Demander un devis</Link>
          </div>
        )}
      </div>
    </header>
  );
}
