import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FAQ.css';

const faqs = [
  {
    q: 'Quelle est la quantité minimale de commande ?',
    a: "Elle dépend du type d'emballage. Nous étudions chaque demande, ponctuelle ou récurrente, pour vous proposer la solution la plus adaptée à votre volume.",
  },
  {
    q: 'Quels délais de livraison proposez-vous ?',
    a: 'Les délais varient selon le produit et la quantité. Ils vous sont communiqués précisément avec votre devis, en tenant compte des éventuels pics saisonniers.',
  },
  {
    q: 'Proposez-vous des emballages personnalisés avec logo ?',
    a: 'Oui, nous pouvons imprimer votre logo et vos couleurs sur vos emballages pour une image de marque cohérente.',
  },
  {
    q: 'Avez-vous des emballages écologiques ou recyclables ?',
    a: 'Oui, des options recyclables ou éco-responsables sont disponibles. Précisez-le dans votre questionnaire pour que nous en tenions compte dans le devis.',
  },
  {
    q: 'Comment se passe la demande de devis ?',
    a: "Vous remplissez notre questionnaire en ligne, nous étudions votre demande, puis vous recevez un lien vers votre devis que vous pouvez consulter et accepter.",
  },
  {
    q: "Puis-je commander régulièrement (mensuel, hebdomadaire) ?",
    a: 'Oui, nous proposons un suivi et un réassort automatique pour les commandes récurrentes, avec un interlocuteur dédié si besoin.',
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-question" onClick={onToggle}>
        <span>{item.q}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <div className="faq-answer">{item.a}</div>}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Questions fréquentes</p>
          <h1>Tout ce qu'il faut savoir avant de commander</h1>
        </div>
      </section>

      <section className="section">
        <div className="container faq-container">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}

          <div className="faq-cta">
            <p>Une autre question ? Contactez-nous ou lancez directement votre demande de devis.</p>
            <Link to="/devis" className="btn btn-primary">Demander un devis</Link>
          </div>
        </div>
      </section>
    </>
  );
}
