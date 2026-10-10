import { Link } from 'react-router-dom';
import logo from '../assets/n_vision_logo.png';
import { IconFacebook, IconInstagram, IconLinkedin } from './Icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="N Vision" className="footer-logo" />
          <span>N Vision</span>
          <p>Cartons, sacs kraft et plastique, papier de soie, cartes de remerciement et autocollants personnalisés pour votre entreprise.</p>
          {/* Remplacez ces liens "#" par les vraies pages sociales de N Vision. */}
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><IconFacebook width={18} height={18} strokeWidth={1.6} /></a>
            <a href="#" aria-label="Instagram"><IconInstagram width={18} height={18} strokeWidth={1.6} /></a>
            <a href="#" aria-label="LinkedIn"><IconLinkedin width={18} height={18} strokeWidth={1.6} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/services">Services</Link>
          <Link to="/realisations">Réalisations</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>contact@nvision-packaging.com</p>
          <p><a href="tel:+2250594752070">+225 05 94 75 20 70</a></p>
          <p>Abidjan, Côte d'Ivoire</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} N Vision — Tous droits réservés</span>
        {/* Remplacez ces liens "#" dès que les pages légales existent. */}
        <div className="footer-legal">
          <a href="#">Mentions légales</a>
          <a href="#">Confidentialité</a>
          <a href="#">CGU</a>
        </div>
      </div>
    </footer>
  );
}
