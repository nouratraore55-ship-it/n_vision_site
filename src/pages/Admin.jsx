import { useEffect, useState } from 'react';
import './Admin.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');
const TOKEN_KEY = 'nvision_admin_token';

const STATUS_LABELS = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  devis_envoye: 'Devis envoyé',
};

const FIELD_LABELS = {
  produit: 'Produit à emballer',
  dimensions: 'Dimensions',
  produits: "Type(s) d'emballage souhaité(s)",
  creation: 'Création qui intéresse le client',
  variante: 'Pièce identique ou personnalisée',
  quantite: 'Quantité souhaitée',
  delai: 'Délai souhaité',
  budget: 'Budget',
  prioriteBudget: 'Priorité',
  logo: 'Logo sur emballage',
  couleurs: 'Couleurs à respecter',
  message: 'Message',
};

// Certains champs sont enregistrés avec une valeur codée (ex: "qualite") —
// on l'affiche de façon lisible dans l'admin.
const VALUE_LABELS = {
  variante: { identique: 'Pièce identique', personnalisee: 'Version personnalisée' },
  prioriteBudget: { prix: 'Prix le plus bas', qualite: 'Meilleure qualité, même plus cher' },
  logo: { oui: 'Oui', non: 'Non' },
};

const FILE_KIND_LABELS = {
  logo: 'Logo',
  design: 'Design',
  photo: 'Photo produit',
};

// Emplacements qui acceptent aussi une vidéo (fond animé), en plus d'une photo.
const VIDEO_ALLOWED_SLOTS = new Set(['home-hero']);
const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';
const IMAGE_OR_VIDEO_ACCEPT = 'image/png,image/jpeg,image/webp,video/mp4,video/webm';

// Emplacements de photos gérables depuis l'admin, groupés par endroit sur le site
const SITE_IMAGE_GROUPS = [
  {
    section: "Page d'accueil",
    slots: [
      {
        slot: 'home-hero',
        label: 'Photo ou vidéo du hero (grande photo en haut)',
        accept: IMAGE_OR_VIDEO_ACCEPT,
      },
    ],
  },
  {
    section: 'Nos services (page d\'accueil + page Services)',
    slots: [
      { slot: 'service-cartons-boites', label: 'Cartons & boîtes' },
      { slot: 'service-sacs-kraft', label: 'Sacs kraft' },
      { slot: 'service-sacs-plastique', label: 'Sacs plastique' },
      { slot: 'service-papier-de-soie', label: 'Papier de soie' },
      { slot: 'service-cartes-remerciement', label: 'Cartes de remerciement / Cartes de visite' },
      { slot: 'service-autocollants', label: 'Autocollants' },
    ],
  },
];

// Projets de la page "Réalisations" — gérés dans leur propre onglet admin
// (photo + titre + description ensemble, pas juste la photo).
const REALISATION_ADMIN_SLOTS = [1, 2, 3, 4, 5, 6].map((n) => ({
  slot: `realisation-${n}`,
  label: `Projet ${n}`,
}));

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState('');
  const [devis, setDevis] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [imageStatus, setImageStatus] = useState({}); // { [slot]: 'uploading' | 'error' | undefined }
  const [imageError, setImageError] = useState({}); // { [slot]: message }
  const [imageVersion, setImageVersion] = useState({}); // { [slot]: timestamp } — force le rechargement de l'aperçu
  const [confirmingDelete, setConfirmingDelete] = useState({}); // { [slot]: true } — demande de confirmation avant suppression
  const [imageMime, setImageMime] = useState({}); // { [slot]: mimeType } — pour savoir s'il faut afficher <img> ou <video>
  const [tab, setTab] = useState('devis'); // 'devis' | 'photos' | 'realisations' — sections séparées, pas mélangées
  const [realisationForm, setRealisationForm] = useState({}); // { [slot]: { title, description } }
  const [realisationStatus, setRealisationStatus] = useState({}); // { [slot]: 'saving' | 'saved' | 'error' }
  const [realisationError, setRealisationError] = useState({});
  const [realisationsLoaded, setRealisationsLoaded] = useState(false);

  async function loadList(withToken) {
    setLoading(true);
    setLoadError('');
    try {
      const res = await fetch(`${API_URL}/api/devis`, {
        headers: { Authorization: `Bearer ${withToken}` },
      });
      if (res.status === 401) {
        setAuthed(false);
        setToken('');
        localStorage.removeItem(TOKEN_KEY);
        return false;
      }
      if (!res.ok) throw new Error('load_failed');
      const data = await res.json();
      setDevis(data);
      setAuthed(true);
      return true;
    } catch (err) {
      setLoadError(
        "Impossible de contacter le serveur backend. Vérifiez qu'il est bien lancé (npm start dans le dossier backend)."
      );
      return false;
    } finally {
      setLoading(false);
      setChecking(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadList(token);
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Type de fichier (photo ou vidéo) des emplacements qui acceptent une vidéo,
  // pour savoir quel aperçu afficher (peu d'emplacements concernés, appel léger).
  useEffect(() => {
    VIDEO_ALLOWED_SLOTS.forEach((slot) => {
      fetch(`${API_URL}/api/site-images/${slot}/meta`)
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data.exists) setImageMime((prev) => ({ ...prev, [slot]: data.mimeType }));
        })
        .catch(() => {});
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Connexion impossible.');
        return;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      await loadList(data.token);
    } catch {
      setAuthError('Impossible de contacter le serveur backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setAuthed(false);
    setDevis([]);
    setEmailInput('');
    setPasswordInput('');
    setRealisationsLoaded(false);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/devis/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('update_failed');
      const updated = await res.json();
      setDevis((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
    } catch {
      setLoadError('La mise à jour du statut a échoué.');
    }
  };

  const downloadFile = async (devisId, file) => {
    try {
      const res = await fetch(`${API_URL}/api/devis/${devisId}/files/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('download_failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setLoadError('Le téléchargement du fichier a échoué.');
    }
  };

  const uploadSiteImage = async (slot, file) => {
    if (!file) return;
    setImageStatus((prev) => ({ ...prev, [slot]: 'uploading' }));
    setImageError((prev) => ({ ...prev, [slot]: '' }));
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/api/site-images/${slot}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'upload_failed');
      setImageStatus((prev) => ({ ...prev, [slot]: undefined }));
      setImageVersion((prev) => ({ ...prev, [slot]: Date.now() }));
      if (data.mimeType) setImageMime((prev) => ({ ...prev, [slot]: data.mimeType }));
    } catch (err) {
      setImageStatus((prev) => ({ ...prev, [slot]: 'error' }));
      setImageError((prev) => ({ ...prev, [slot]: err.message === 'upload_failed' ? "L'envoi a échoué." : err.message }));
    }
  };

  const deleteSiteImage = async (slot) => {
    setConfirmingDelete((prev) => ({ ...prev, [slot]: false }));
    setImageStatus((prev) => ({ ...prev, [slot]: 'deleting' }));
    setImageError((prev) => ({ ...prev, [slot]: '' }));
    try {
      const res = await fetch(`${API_URL}/api/site-images/${slot}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok && res.status !== 404) throw new Error(data.error || 'delete_failed');
      setImageStatus((prev) => ({ ...prev, [slot]: undefined }));
      setImageVersion((prev) => ({ ...prev, [slot]: Date.now() }));
      setImageMime((prev) => ({ ...prev, [slot]: undefined }));
    } catch (err) {
      setImageStatus((prev) => ({ ...prev, [slot]: 'error' }));
      setImageError((prev) => ({
        ...prev,
        [slot]: err.message === 'delete_failed' ? "La suppression a échoué." : err.message,
      }));
    }
  };

  const loadRealisations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/realisations`);
      if (!res.ok) throw new Error('load_failed');
      const data = await res.json();
      setRealisationForm(
        Object.fromEntries(data.map((r) => [r.slot, { title: r.title, description: r.description }]))
      );
    } catch {
      // silencieux : les valeurs par défaut restent affichées sur le site
    } finally {
      setRealisationsLoaded(true);
    }
  };

  useEffect(() => {
    if (tab === 'realisations' && !realisationsLoaded) {
      loadRealisations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const updateRealisationField = (slot, field, value) => {
    setRealisationForm((prev) => ({ ...prev, [slot]: { ...prev[slot], [field]: value } }));
  };

  const saveRealisation = async (slot) => {
    const form = realisationForm[slot] || {};
    setRealisationStatus((prev) => ({ ...prev, [slot]: 'saving' }));
    setRealisationError((prev) => ({ ...prev, [slot]: '' }));
    try {
      const res = await fetch(`${API_URL}/api/realisations/${slot}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: form.title || '', description: form.description || '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'save_failed');
      setRealisationStatus((prev) => ({ ...prev, [slot]: 'saved' }));
      setTimeout(() => {
        setRealisationStatus((prev) => (prev[slot] === 'saved' ? { ...prev, [slot]: undefined } : prev));
      }, 2000);
    } catch (err) {
      setRealisationStatus((prev) => ({ ...prev, [slot]: 'error' }));
      setRealisationError((prev) => ({
        ...prev,
        [slot]: err.message === 'save_failed' ? "L'enregistrement a échoué." : err.message,
      }));
    }
  };

  if (checking) {
    return (
      <div className="admin-gate">
        <p>Chargement…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-gate">
        <form className="admin-login" onSubmit={handleLogin}>
          <h1>Espace admin — N Vision</h1>
          <p>Connecte-toi pour voir les demandes de devis.</p>
          <input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          {authError && <p className="admin-error">{authError}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Espace admin — N Vision</h1>
        <div className="admin-header-actions">
          {tab === 'devis' && (
            <button className="btn btn-secondary" onClick={() => loadList(token)} disabled={loading}>
              {loading ? 'Actualisation…' : 'Actualiser'}
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'devis' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('devis')}
        >
          Demandes de devis
        </button>
        <button
          className={`admin-tab ${tab === 'photos' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('photos')}
        >
          Photos du site
        </button>
        <button
          className={`admin-tab ${tab === 'realisations' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('realisations')}
        >
          Réalisations
        </button>
      </nav>

      {tab === 'photos' && (
        <section className="admin-images">
          <h2>Photos du site</h2>
          <p className="admin-images-hint">
            La photo remplace automatiquement le visuel sur le site, dès que l'envoi est terminé.
          </p>
          {SITE_IMAGE_GROUPS.map(({ section, slots }) => (
            <div className="admin-images-section" key={section}>
              <h3 className="admin-images-section-title">{section}</h3>
              <div className="admin-images-grid">
                {slots.map(({ slot, label, accept }) => {
                  const fileUrl = `${API_URL}/api/site-images/${slot}/file${
                    imageVersion[slot] ? `?v=${imageVersion[slot]}` : ''
                  }`;
                  const isVideo = (imageMime[slot] || '').startsWith('video/');
                  return (
                    <div className="admin-image-card" key={slot}>
                      <div className="admin-image-preview">
                        {isVideo ? (
                          <video
                            key={imageVersion[slot] || 'initial'}
                            src={fileUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <img
                            key={imageVersion[slot] || 'initial'}
                            src={fileUrl}
                            alt={label}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              e.currentTarget.style.display = 'block';
                            }}
                          />
                        )}
                      </div>
                      <div className="admin-image-body">
                        <span className="admin-image-label">{label}</span>
                        <div className="admin-image-actions">
                          <label className="btn btn-secondary admin-image-upload">
                            {imageStatus[slot] === 'uploading' ? 'Envoi…' : 'Changer la photo'}
                            <input
                              type="file"
                              accept={accept || IMAGE_ACCEPT}
                              hidden
                              disabled={imageStatus[slot] === 'uploading' || imageStatus[slot] === 'deleting'}
                              onChange={(e) => uploadSiteImage(slot, e.target.files?.[0])}
                            />
                          </label>
                          {!confirmingDelete[slot] ? (
                            <button
                              type="button"
                              className="btn btn-secondary admin-image-delete"
                              disabled={imageStatus[slot] === 'uploading' || imageStatus[slot] === 'deleting'}
                              onClick={() => setConfirmingDelete((prev) => ({ ...prev, [slot]: true }))}
                            >
                              {imageStatus[slot] === 'deleting' ? 'Suppression…' : 'Supprimer la photo'}
                            </button>
                          ) : (
                            <span className="admin-image-confirm">
                              Supprimer ?
                              <button type="button" className="btn btn-danger" onClick={() => deleteSiteImage(slot)}>
                                Oui
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setConfirmingDelete((prev) => ({ ...prev, [slot]: false }))}
                              >
                                Annuler
                              </button>
                            </span>
                          )}
                        </div>
                        {VIDEO_ALLOWED_SLOTS.has(slot) && (
                          <p className="admin-images-hint" style={{ margin: 0 }}>
                            Accepte aussi une vidéo courte (MP4/WebM, 30 Mo max) — elle sera lue en
                            boucle, sans son.
                          </p>
                        )}
                        {imageStatus[slot] === 'error' && <p className="admin-error">{imageError[slot]}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'realisations' && (
        <section className="admin-images">
          <h2>Réalisations</h2>
          <p className="admin-images-hint">
            Complète la photo, le titre et la description de chaque projet affiché sur la page
            « Réalisations » du site.
          </p>
          <div className="admin-images-grid">
            {REALISATION_ADMIN_SLOTS.map(({ slot, label }) => {
              const form = realisationForm[slot] || { title: '', description: '' };
              return (
                <div className="admin-image-card admin-realisation-card" key={slot}>
                  <div className="admin-image-preview">
                    <img
                      key={imageVersion[slot] || 'initial'}
                      src={`${API_URL}/api/site-images/${slot}/file${imageVersion[slot] ? `?v=${imageVersion[slot]}` : ''}`}
                      alt={label}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        e.currentTarget.style.display = 'block';
                      }}
                    />
                  </div>
                  <div className="admin-image-body admin-realisation-body">
                    <div className="admin-image-actions">
                      <label className="btn btn-secondary admin-image-upload">
                        {imageStatus[slot] === 'uploading' ? 'Envoi…' : 'Changer la photo'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          hidden
                          disabled={imageStatus[slot] === 'uploading' || imageStatus[slot] === 'deleting'}
                          onChange={(e) => uploadSiteImage(slot, e.target.files?.[0])}
                        />
                      </label>
                      {!confirmingDelete[slot] ? (
                        <button
                          type="button"
                          className="btn btn-secondary admin-image-delete"
                          disabled={imageStatus[slot] === 'uploading' || imageStatus[slot] === 'deleting'}
                          onClick={() => setConfirmingDelete((prev) => ({ ...prev, [slot]: true }))}
                        >
                          {imageStatus[slot] === 'deleting' ? 'Suppression…' : 'Supprimer la photo'}
                        </button>
                      ) : (
                        <span className="admin-image-confirm">
                          Supprimer ?
                          <button type="button" className="btn btn-danger" onClick={() => deleteSiteImage(slot)}>
                            Oui
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setConfirmingDelete((prev) => ({ ...prev, [slot]: false }))}
                          >
                            Annuler
                          </button>
                        </span>
                      )}
                    </div>
                    {imageStatus[slot] === 'error' && <p className="admin-error">{imageError[slot]}</p>}

                    <label className="admin-realisation-field">
                      Titre du projet
                      <input
                        value={form.title}
                        onChange={(e) => updateRealisationField(slot, 'title', e.target.value)}
                        placeholder={label}
                      />
                    </label>
                    <label className="admin-realisation-field">
                      Description
                      <textarea
                        value={form.description}
                        onChange={(e) => updateRealisationField(slot, 'description', e.target.value)}
                        rows={3}
                        placeholder="Besoin du client, solution apportée…"
                      />
                    </label>

                    <button
                      type="button"
                      className="btn btn-primary admin-realisation-save"
                      onClick={() => saveRealisation(slot)}
                      disabled={realisationStatus[slot] === 'saving'}
                    >
                      {realisationStatus[slot] === 'saving'
                        ? 'Enregistrement…'
                        : realisationStatus[slot] === 'saved'
                        ? 'Enregistré ✓'
                        : 'Enregistrer'}
                    </button>
                    {realisationStatus[slot] === 'error' && (
                      <p className="admin-error">{realisationError[slot]}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tab === 'devis' && (
        <>
          {loadError && <p className="admin-error">{loadError}</p>}

          {devis.length === 0 ? (
            <p className="admin-empty">Aucune demande reçue pour le moment.</p>
          ) : (
            <div className="admin-list">
              {devis.map((d) => {
                const details = d.details || {};
                return (
                  <div className="admin-row" key={d.id}>
                    <button className="admin-row-summary" onClick={() => setOpenId(openId === d.id ? null : d.id)}>
                      <div className="admin-row-main">
                        <strong>{d.contact || '—'}</strong>
                        <span className="admin-row-email">{[d.email, d.telephone].filter(Boolean).join(' · ')}</span>
                      </div>
                      <div className="admin-row-meta">
                        <span className={`admin-status admin-status-${d.status}`}>
                          {STATUS_LABELS[d.status] || d.status}
                        </span>
                        <span className="admin-row-date">{formatDate(d.receivedAt)}</span>
                      </div>
                    </button>

                    {openId === d.id && (
                      <div className="admin-row-detail">
                        <div className="admin-detail-grid">
                          {d.telephone && (
                            <div className="admin-detail-item">
                              <span className="admin-detail-label">Téléphone</span>
                              <span className="admin-detail-value">{d.telephone}</span>
                            </div>
                          )}
                          {Object.entries(FIELD_LABELS).map(([key, label]) =>
                            details[key] ? (
                              <div className="admin-detail-item" key={key}>
                                <span className="admin-detail-label">{label}</span>
                                <span className="admin-detail-value">
                                  {(VALUE_LABELS[key] && VALUE_LABELS[key][details[key]]) || String(details[key])}
                                </span>
                              </div>
                            ) : null
                          )}
                        </div>

                        {d.files && d.files.length > 0 && (
                          <div className="admin-files">
                            <span className="admin-detail-label">Fichiers joints</span>
                            <div className="admin-files-list">
                              {d.files.map((f) => (
                                <button key={f.id} className="admin-file-chip" onClick={() => downloadFile(d.id, f)}>
                                  {FILE_KIND_LABELS[f.kind] || f.kind} — {f.originalName}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="admin-status-actions">
                          <span>Statut :</span>
                          <select value={d.status} onChange={(e) => updateStatus(d.id, e.target.value)}>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
