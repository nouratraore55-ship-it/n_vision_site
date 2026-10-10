import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/n_vision_logo.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/realisations', label: 'Réalisations' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt="N Vision" className="navbar-logo" />
          <span className="navbar-brand-text">
            <span className="navbar-brand-name">N Vision</span>
            <span className="navbar-brand-tag">Packaging</span>
          </span>
        </NavLink>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/devis" className="btn btn-primary navbar-cta" onClick={() => setOpen(false)}>
            Demander un devis
          </NavLink>
        </nav>

        <button
          className="navbar-toggle"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
