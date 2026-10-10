import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconCheckShield } from '../components/Icons';
import FileDropzone from '../components/FileDropzone';
import './Questionnaire.css';

const PRODUIT_OPTIONS = [
  'Cartons & boîtes',
  'Sacs kraft',
  'Sacs plastique',
  'Papier de soie',
  'Cartes de remerciement',
  'Autocollants',
];

const initialState = {
  contact: '',
  entreprise: '',
  telephone: '',
  email: '',
  produit: '',
  dimensions: '',
  produits: [],
  creation: '',
  variante: 'identique',
  quantite: '',
  delai: '',
  budget: '',
  prioriteBudget: 'qualite',
  logo: 'non',
  couleurs: '',
  message: '',
};

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

export default function Questionnaire() {
  const [form, setForm] = useState(initialState);
  const [logoFiles, setLogoFiles] = useState([]);
  const [designFiles, setDesignFiles] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProduit = (value) => {
    setForm((prev) => {
      const set = new Set(prev.produits);
      if (set.has(value)) {
        set.delete(value);
      } else {
        set.add(value);
      }
      return { ...prev, produits: Array.from(set) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.telephone && !form.email) {
      setError('Merci de renseigner au moins un téléphone ou un email pour vous recontacter.');
      return;
    }

    setSending(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'produits') return;
        formData.append(key, value);
      });
      formData.append('produits', form.produits.join(', '));
      if (logoFiles[0]) formData.append('logo', logoFiles[0]);
      designFiles.forEach((f) => formData.append('designs', f));
      photoFiles.forEach((f) => formData.append('photos', f));

      const res = await fetch(`${API_URL}/api/devis`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('request_failed');
      setSent(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(
        "Votre demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez dans un instant."
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="section confirmation">
        <div className="container confirmation-box">
          <span className="confirmation-icon"><IconCheckShield width={40} height={40} /></span>
          <h1>Demande envoyée</h1>
          <p>
            Merci {form.contact ? form.contact.split(' ')[0] : ''} ! Votre demande a bien été
            transmise à notre équipe. Nous préparons votre devis et vous enverrons un lien pour
            le consulter dès qu'il sera prêt.
          </p>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Demande de devis</p>
          <h1>Parlez-nous de votre projet</h1>
          <p className="page-hero-sub">
            Répondez à ces quelques questions, ça nous aide à vous proposer la bonne création
            et un devis précis.
          </p>
        </div>
      </section>

      <section className="section">
        <form className="container questionnaire-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Vos coordonnées</legend>
            <div className="form-grid">
              <label>
                Nom et prénom
                <input value={form.contact} onChange={update('contact')} required />
              </label>
              <label>
                Nom de l'entreprise (facultatif)
                <input value={form.entreprise} onChange={update('entreprise')} />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Téléphone
                <input value={form.telephone} onChange={update('telephone')} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={update('email')} />
              </label>
            </div>
            <p className="form-hint">Merci de renseigner au moins l'un des deux.</p>
          </fieldset>

          <fieldset>
            <legend>Le produit à emballer</legend>
            <label>
              Qu'est-ce que vous voulez emballer ?
              <textarea value={form.produit} onChange={update('produit')} required />
            </label>
            <label>
              Quelle est la taille du produit (longueur, largeur, hauteur) ?
              <input value={form.dimensions} onChange={update('dimensions')} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Le type d'emballage souhaité</legend>
            <label>Ça peut être plusieurs à la fois</label>
            <div className="checkbox-grid">
              {PRODUIT_OPTIONS.map((option) => (
                <label className="checkbox-option" key={option}>
                  <input
                    type="checkbox"
                    checked={form.produits.includes(option)}
                    onChange={() => toggleProduit(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            <label>
              Une création en particulier vous intéresse ?
              <textarea
                value={form.creation}
                onChange={update('creation')}
                placeholder="Décrivez-la, ou collez le lien d'une pièce vue dans nos réalisations"
              />
            </label>
            <label>
              Vous souhaitez…
              <select value={form.variante} onChange={update('variante')}>
                <option value="identique">Une pièce identique</option>
                <option value="personnalisee">Une version personnalisée</option>
              </select>
            </label>
          </fieldset>

          <fieldset>
            <legend>Quantité et délai</legend>
            <div className="form-grid">
              <label>
                Quantité souhaitée
                <input value={form.quantite} onChange={update('quantite')} />
              </label>
              <label>
                Délai souhaité
                <input value={form.delai} onChange={update('delai')} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Budget</legend>
            <div className="form-grid">
              <label>
                Budget par emballage ou par commande
                <input value={form.budget} onChange={update('budget')} />
              </label>
              <label>
                Priorité
                <select value={form.prioriteBudget} onChange={update('prioriteBudget')}>
                  <option value="prix">Prix le plus bas</option>
                  <option value="qualite">Meilleure qualité, même plus cher</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Logo et couleurs</legend>
            <div className="form-grid">
              <label>
                Logo sur l'emballage ?
                <select value={form.logo} onChange={update('logo')}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </label>
              <label>
                Couleurs précises à respecter ?
                <input value={form.couleurs} onChange={update('couleurs')} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Message (facultatif)</legend>
            <label>
              Précisions supplémentaires
              <textarea value={form.message} onChange={update('message')} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Fichiers (facultatif)</legend>
            <p className="form-hint">
              Un logo, une photo ou une référence à nous montrer ? Formats acceptés : images (PNG, JPG, WEBP) ou PDF, 10 Mo max par fichier.
            </p>
            <FileDropzone
              label="Logo"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
              files={logoFiles}
              onFilesChange={setLogoFiles}
            />
            <FileDropzone
              label="Fichiers de design"
              hint="Plusieurs fichiers possibles"
              multiple
              accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
              files={designFiles}
              onFilesChange={setDesignFiles}
            />
            <FileDropzone
              label="Photos"
              hint="Plusieurs fichiers possibles"
              multiple
              accept="image/png,image/jpeg,image/webp"
              files={photoFiles}
              onFilesChange={setPhotoFiles}
            />
          </fieldset>

          <div className="form-submit">
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
