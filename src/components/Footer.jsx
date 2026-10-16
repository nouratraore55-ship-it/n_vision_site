import { Link } from 'react-router-dom';
import logoRuby from '../assets/logo-ruby.png';
import { IconFacebook, IconInstagram, IconLinkedin } from './Icons';
import './Footer.css';

const produits = [
  'Cartons',
  'Sacs kraft',
  'Sacs plastique',
  'Sacs zip',
  'Papier de soie',
  'Cartes de visite',
  'Cartes de remerciement',
  'Autocollants',
];

export default function Footer() {
  return (
    <div className="nv">
      <footer className="nv-footer">
        <div className="wrap">
          <div className="ft">
            <div>
              <div className="ft-brand">
                <img src={logoRuby} alt="Logo N Vision" />
                <strong>N Vision</strong>
                <p>Packaging personnalisé à votre logo et à vos couleurs.</p>
              </div>
              <div className="ft-contact">
                <p>contact@nvision-packaging.com</p>
                <p><a href="tel:+2250594752070">+225 05 94 75 20 70</a></p>
                <p>Abidjan, Côte d'Ivoire</p>
              </div>
              {/* Remplacez ces liens "#" par les vraies pages sociales de N Vision. */}
              <div className="ft-social">
                <a href="#" aria-label="Facebook"><IconFacebook width={18} height={18} strokeWidth={1.6} /></a>
                <a href="#" aria-label="Instagram"><IconInstagram width={18} height={18} strokeWidth={1.6} /></a>
                <a href="#" aria-label="LinkedIn"><IconLinkedin width={18} height={18} strokeWidth={1.6} /></a>
              </div>
            </div>
            <div className="cols">
              <div>
                <h4>Aide</h4>
                <Link to="/faq">FAQ</Link>
                <Link to="/devis">Devis</Link>
              </div>
              <div>
                <h4>Liens</h4>
                <Link to="/">Accueil</Link>
                <Link to="/services">Services</Link>
                <Link to="/realisations">Réalisations</Link>
              </div>
              <div>
                <h4>Produits</h4>
                {produits.map((p) => (
                  <Link key={p} to="/services">{p}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="copy">
            <span>© {new Date().getFullYear()} N Vision. Tous droits réservés.</span>
            {/* Remplacez ces liens "#" dès que les pages légales existent. */}
            <span><a href="#">Mentions légales</a> · <a href="#">Confidentialité</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
