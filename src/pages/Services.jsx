import { Link } from 'react-router-dom';
import SiteImage from '../components/SiteImage';
import { IlluPackaging, IlluSacs, IlluPapier, IlluCartes } from '../components/Illustrations';
import './Services.css';

const services = [
  {
    title: 'Cartons & boîtes',
    text: 'Carton simple ou double cannelure, aux dimensions de votre produit, pour l\'expédition ou le stockage.',
    slot: 'service-packaging', Illu: IlluPackaging,
  },
  {
    title: 'Sacs kraft',
    text: 'Sacs en papier kraft, résistants et personnalisables, pour un emballage économique et écologique.',
    slot: 'service-sacs', Illu: IlluSacs,
  },
  {
    title: 'Sacs plastique',
    text: 'Sacs plastique adaptés à vos produits, pour la vente, le transport ou le stockage.',
    slot: 'service-sacs', Illu: IlluSacs,
  },
  {
    title: 'Sacs zip',
    text: 'Sacs à fermeture zip, refermables, pour protéger et présenter vos produits.',
    slot: 'service-sacs', Illu: IlluSacs,
  },
  {
    title: 'Papier de soie',
    text: "Papier de soie pour l'emballage cadeau, la protection ou la présentation de vos produits.",
    slot: 'service-papier-de-soie', Illu: IlluPapier,
  },
  {
    title: 'Cartes de remerciement / Cartes de visite',
    text: 'Cartes de remerciement et cartes de visite personnalisées à glisser dans vos commandes ou pour votre identité professionnelle.',
    slot: 'service-cartes', Illu: IlluCartes,
  },
  {
    title: 'Autocollants',
    text: 'Autocollants personnalisés pour tous vos produits et emballages, logo ou design au choix.',
    slot: 'service-cartes', Illu: IlluCartes,
  },
];

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Nos services</p>
          <h1>Des solutions de packaging pour chaque besoin</h1>
          <p className="page-hero-sub">
            Que vous ayez besoin d'un emballage ponctuel ou d'un approvisionnement régulier,
            N Vision adapte la solution à votre produit, votre budget et vos délais.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((s) => (
              <div className="card service-card" key={s.title}>
                <div className="service-visual">
                  <SiteImage slot={s.slot} label={`Photo — ${s.title}`} ratio={null} className="service-photo" fallback={<s.Illu />} />
                </div>
                <div className="service-card-body">
                  <h3>{s.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container cta-inline">
          <div>
            <h2>Vous ne savez pas quel emballage choisir ?</h2>
            <p>Remplissez notre questionnaire, on vous recommande la meilleure solution et un devis adapté.</p>
          </div>
          <Link to="/devis" className="btn btn-primary">Demander un devis</Link>
        </div>
      </section>
    </>
  );
}
