import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../nv.css';
import './Questionnaire.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

const PRODUIT_OPTIONS = [
  'Cartons & boîtes',
  'Sacs kraft',
  'Sacs plastique',
  'Sacs zip',
  'Papier de soie',
  'Cartes de visite / remerciement',
  'Autocollants',
];

const STEP_LABELS = ['Vos coordonnées', 'Votre produit', 'Quantité & budget', 'Logo & fichiers'];
const MAX_SIZE = 10 * 1024 * 1024;
const IMG_ACCEPT = 'image/png,image/jpeg,image/webp,image/svg+xml,application/pdf';

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
  logo: 'oui',
  couleurs: '',
  message: '',
};

const UploadIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
);

function Drop({ id, label, hint, multiple, accept, files, onChange }) {
  const [over, setOver] = useState(false);
  const take = (list) => {
    const arr = Array.from(list || []);
    onChange(multiple ? arr.slice(0, 6) : arr.slice(0, 1));
  };
  return (
    <div>
      <label
        className={`drop ${over ? 'over' : ''}`}
        htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        <UploadIcon />
        <div><strong>{label}</strong>{hint}</div>
        <input id={id} type="file" multiple={multiple} accept={accept} onChange={(e) => take(e.target.files)} />
      </label>
      {files.length > 0 && (
        <ul className="files">
          {files.map((f) => (
            <li key={f.name + f.size}>
              {f.name}{f.size > MAX_SIZE ? ' (trop lourd, 10 Mo max)' : ''}
              <button type="button" aria-label={`Retirer ${f.name}`} onClick={() => onChange(files.filter((x) => x !== f))}>×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Seg({ name, value, options, onChange }) {
  return (
    <div className="seg">
      {options.map(([v, label]) => (
        <label className="chip" key={v}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

export default function Questionnaire() {
  const [form, setForm] = useState(initialState);
  const [logoFiles, setLogoFiles] = useState([]);
  const [designFiles, setDesignFiles] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const topRef = useRef(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));
  const toggleProduit = (value) =>
    setForm((prev) => {
      const s = new Set(prev.produits);
      if (s.has(value)) s.delete(value); else s.add(value);
      return { ...prev, produits: Array.from(s) };
    });

  const check = (i) => {
    if (i === 0) {
      if (!form.contact.trim()) return 'Indiquez votre nom et prénom.';
      if (!form.telephone.trim() && !form.email.trim()) return 'Renseignez au moins un téléphone ou un e-mail.';
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "L'adresse e-mail n'est pas valide.";
    }
    if (i === 1 && !form.produit.trim()) return 'Dites-nous ce que vous voulez emballer.';
    if (i === 3) {
      const big = [...logoFiles, ...designFiles, ...photoFiles].find((f) => f.size > MAX_SIZE);
      if (big) return `Le fichier « ${big.name} » dépasse 10 Mo.`;
    }
    return '';
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const go = (i) => {
    setError('');
    setStep(i);
    setMaxStep((m) => Math.max(m, i));
    scrollTop();
  };

  const submit = async () => {
    setSending(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (k !== 'produits') fd.append(k, v); });
      fd.append('produits', form.produits.join(', '));
      if (logoFiles[0]) fd.append('logo', logoFiles[0]);
      designFiles.forEach((f) => fd.append('designs', f));
      photoFiles.forEach((f) => fd.append('photos', f));
      const res = await fetch(`${API_URL}/api/devis`, { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || '');
      }
      setSent(true);
      scrollTop();
    } catch (err) {
      setError(err.message || "Votre demande n'a pas pu être envoyée. Vérifiez votre connexion et réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    const msg = check(step);
    if (msg) { setError(msg); return; }
    if (step < 3) go(step + 1);
    else submit();
  };

  const reset = () => {
    setForm(initialState);
    setLogoFiles([]); setDesignFiles([]); setPhotoFiles([]);
    setSent(false); setStep(0); setMaxStep(0); setError('');
  };

  return (
    <div className="nv">
      <section className="devis" ref={topRef}>
        <div className="wrap">
          <div className="dv-head">
            <div>
              <h2>Parlez-nous de<br />votre <span className="soft">projet</span></h2>
              <p>Répondez à ces quelques questions : elles nous aident à vous proposer la bonne création et un devis précis.</p>
            </div>
            <span className="tag">Demande de devis</span>
          </div>

          <div className="dv-box">
            <ol className="dv-steps">
              {STEP_LABELS.map((label, i) => (
                <li
                  key={label}
                  className={`${i === step ? 'on' : ''} ${i < maxStep && i !== step ? 'done' : ''}`}
                  onClick={() => { if (!sent && i <= maxStep) { if (i > step && check(step)) { setError(check(step)); return; } go(i); } }}
                >
                  <b>{i + 1}</b><span>{label}</span>
                </li>
              ))}
            </ol>

            {sent ? (
              <div className="dv-done">
                <span className="ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
                <h3>Demande envoyée</h3>
                <p>
                  Merci {form.contact.split(' ')[0]} ! Votre demande a bien été transmise à notre équipe. Nous préparons
                  votre devis et vous enverrons un lien pour le consulter dès qu'il sera prêt.
                </p>
                <div className="dv-done-actions">
                  <Link to="/" className="btn btn-dark">Retour à l'accueil</Link>
                  <button type="button" className="btn btn-ghost" onClick={reset}>Faire une autre demande</button>
                </div>
              </div>
            ) : (
              <form className="dv-form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
                {step === 0 && (
                  <div className="dv-panel">
                    <h3><small>Étape 1 sur 4</small>Vos coordonnées</h3>
                    <div className="dv-grid">
                      <label className="fld">Nom et prénom<input id="dv-contact" value={form.contact} onChange={update('contact')} autoComplete="name" /></label>
                      <label className="fld"><span>Nom de l'entreprise <span className="hint">(facultatif)</span></span><input id="dv-entreprise" value={form.entreprise} onChange={update('entreprise')} autoComplete="organization" /></label>
                      <label className="fld">Téléphone<input id="dv-tel" type="tel" value={form.telephone} onChange={update('telephone')} autoComplete="tel" /></label>
                      <label className="fld">E-mail<input id="dv-email" type="email" value={form.email} onChange={update('email')} autoComplete="email" /></label>
                    </div>
                    <p className="hint">Merci de renseigner au moins un téléphone ou un e-mail pour qu'on puisse vous recontacter.</p>
                  </div>
                )}

                {step === 1 && (
                  <div className="dv-panel">
                    <h3><small>Étape 2 sur 4</small>Votre produit</h3>
                    <label className="fld">Qu'est-ce que vous voulez emballer ?<textarea id="dv-produit" value={form.produit} onChange={update('produit')} /></label>
                    <label className="fld"><span>Taille du produit <span className="hint">(longueur, largeur, hauteur)</span></span><input id="dv-dim" value={form.dimensions} onChange={update('dimensions')} placeholder="ex. 20 × 15 × 8 cm" /></label>
                    <div className="fld"><span>
                      Type d'emballage souhaité <span className="hint">Plusieurs choix possibles</span></span>
                      <div className="chipset">
                        {PRODUIT_OPTIONS.map((o) => (
                          <label className="chip" key={o}>
                            <input type="checkbox" checked={form.produits.includes(o)} onChange={() => toggleProduit(o)} />
                            <span>{o}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="fld">Une création en particulier vous intéresse ?<textarea id="dv-creation" value={form.creation} onChange={update('creation')} placeholder="Décrivez-la, ou collez le lien d'une pièce vue dans nos réalisations" /></label>
                    <div className="fld">
                      Vous souhaitez…
                      <Seg name="variante" value={form.variante} onChange={set('variante')} options={[['identique', 'Une pièce identique'], ['personnalisee', 'Une version personnalisée']]} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="dv-panel">
                    <h3><small>Étape 3 sur 4</small>Quantité, délai et budget</h3>
                    <div className="dv-grid">
                      <label className="fld">Quantité souhaitée<input id="dv-qte" value={form.quantite} onChange={update('quantite')} placeholder="ex. 500 sacs" /></label>
                      <label className="fld">Délai souhaité<input id="dv-delai" value={form.delai} onChange={update('delai')} placeholder="ex. dans 3 semaines" /></label>
                    </div>
                    <label className="fld">Budget par emballage ou par commande<input id="dv-budget" value={form.budget} onChange={update('budget')} placeholder="ex. 150 000 FCFA" /></label>
                    <div className="fld">
                      Votre priorité
                      <Seg name="priorite" value={form.prioriteBudget} onChange={set('prioriteBudget')} options={[['prix', 'Le prix le plus bas'], ['qualite', 'La meilleure qualité']]} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="dv-panel">
                    <h3><small>Étape 4 sur 4</small>Logo, couleurs et fichiers</h3>
                    <div className="fld">
                      Un logo sur l'emballage ?
                      <Seg name="logo" value={form.logo} onChange={set('logo')} options={[['oui', 'Oui'], ['non', 'Non']]} />
                    </div>
                    <label className="fld">Couleurs précises à respecter ?<input id="dv-couleurs" value={form.couleurs} onChange={update('couleurs')} placeholder="ex. bordeaux et crème, ou codes couleur" /></label>
                    <div className="fld"><span>
                      Fichiers <span className="hint">(facultatif) Images PNG, JPG, WEBP ou PDF, 10 Mo max par fichier</span></span>
                      <Drop id="dv-f-logo" label="Votre logo" hint="Un seul fichier" accept={IMG_ACCEPT} files={logoFiles} onChange={setLogoFiles} />
                      <Drop id="dv-f-design" label="Fichiers de design" hint="Jusqu'à 6 fichiers" multiple accept={IMG_ACCEPT} files={designFiles} onChange={setDesignFiles} />
                      <Drop id="dv-f-photo" label="Photos" hint="Jusqu'à 6 fichiers" multiple accept="image/png,image/jpeg,image/webp" files={photoFiles} onChange={setPhotoFiles} />
                    </div>
                    <label className="fld"><span>Précisions supplémentaires <span className="hint">(facultatif)</span></span><textarea id="dv-msg" value={form.message} onChange={update('message')} /></label>
                  </div>
                )}

                <div className="dv-nav">
                  {step > 0 ? (
                    <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>Retour</button>
                  ) : <span />}
                  <span className="dv-err" role="alert">{error}</span>
                  <button type="submit" className="btn btn-dark" disabled={sending}>
                    {step < 3 ? 'Continuer' : sending ? 'Envoi en cours…' : 'Envoyer ma demande'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
