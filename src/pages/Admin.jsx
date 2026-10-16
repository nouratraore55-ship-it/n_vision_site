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
  entreprise: 'Entreprise',
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

const IMAGE_ACCEPT = 'image/png,image/jpeg,image/webp';


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
  const [tab, setTab] = useState('devis'); // 'devis' | 'photos' | 'realisations' — sections séparées, pas mélangées
  const [realisations, setRealisations] = useState([]); // [{ id, title, lieu, description, hasImage }]
  const [realisationStatus, setRealisationStatus] = useState({}); // { [id]: 'saving' | 'saved' | 'error' | 'deleting' }
  const [realisationError, setRealisationError] = useState({});
  const [realisationsLoaded, setRealisationsLoaded] = useState(false);
  const [newReal, setNewReal] = useState({ title: '', lieu: '', description: '' });
  const [newRealFile, setNewRealFile] = useState(null);
  const [newRealStatus, setNewRealStatus] = useState(''); // '' | 'saving' | message d'erreur

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
        'Impossible de contacter le serveur. Réessayez dans un instant.'
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
    } catch (err) {
      setImageStatus((prev) => ({ ...prev, [slot]: 'error' }));
      setImageError((prev) => ({ ...prev, [slot]: err.message === 'upload_failed' ? "L'envoi a échoué." : err.message }));
    }
  };

  const loadRealisations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/realisations`);
      if (!res.ok) throw new Error('load_failed');
      setRealisations(await res.json());
    } catch {
      setLoadError('Impossible de charger les réalisations.');
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

  const updateRealisationField = (id, field, value) => {
    setRealisations((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const authJson = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const addRealisation = async (e) => {
    e.preventDefault();
    if (!newReal.title.trim()) {
      setNewRealStatus('Le titre est requis.');
      return;
    }
    setNewRealStatus('saving');
    try {
      const res = await fetch(`${API_URL}/api/realisations`, {
        method: 'POST',
        headers: authJson,
        body: JSON.stringify(newReal),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "L'ajout a échoué.");
      setRealisations((prev) => [...prev, data]);
      if (newRealFile) {
        await uploadSiteImage(data.id, newRealFile);
        setRealisations((prev) => prev.map((r) => (r.id === data.id ? { ...r, hasImage: true } : r)));
      }
      setNewReal({ title: '', lieu: '', description: '' });
      setNewRealFile(null);
      setNewRealStatus('');
    } catch (err) {
      setNewRealStatus(err.message);
    }
  };

  const saveRealisation = async (r) => {
    setRealisationStatus((prev) => ({ ...prev, [r.id]: 'saving' }));
    setRealisationError((prev) => ({ ...prev, [r.id]: '' }));
    try {
      const res = await fetch(`${API_URL}/api/realisations/${r.id}`, {
        method: 'PUT',
        headers: authJson,
        body: JSON.stringify({ title: r.title || '', lieu: r.lieu || '', description: r.description || '' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "L'enregistrement a échoué.");
      setRealisationStatus((prev) => ({ ...prev, [r.id]: 'saved' }));
      setTimeout(() => {
        setRealisationStatus((prev) => (prev[r.id] === 'saved' ? { ...prev, [r.id]: undefined } : prev));
      }, 2000);
    } catch (err) {
      setRealisationStatus((prev) => ({ ...prev, [r.id]: 'error' }));
      setRealisationError((prev) => ({ ...prev, [r.id]: err.message }));
    }
  };

  const deleteRealisation = async (id) => {
    setConfirmingDelete((prev) => ({ ...prev, [`real:${id}`]: false }));
    setRealisationStatus((prev) => ({ ...prev, [id]: 'deleting' }));
    try {
      const res = await fetch(`${API_URL}/api/realisations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'La suppression a échoué.');
      setRealisations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setRealisationStatus((prev) => ({ ...prev, [id]: 'error' }));
      setRealisationError((prev) => ({ ...prev, [id]: err.message }));
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
          className={`admin-tab ${tab === 'realisations' ? 'admin-tab-active' : ''}`}
          onClick={() => setTab('realisations')}
        >
          Réalisations
        </button>
      </nav>

      {tab === 'realisations' && (
        <section className="admin-images">
          <h2>Réalisations</h2>
          <p className="admin-images-hint">
            Les réalisations s'affichent sur l'accueil (diaporama) et sur la page « Réalisations », dans
            l'ordre où elles ont été ajoutées. Tant qu'il n'y en a aucune, le site montre la carte de visite BSTP.
          </p>

          <form className="admin-image-card admin-realisation-card admin-realisation-new" onSubmit={addRealisation}>
            <div className="admin-image-body admin-realisation-body">
              <h3 className="admin-images-section-title">Ajouter une réalisation</h3>
              <label className="admin-realisation-field">
                Titre du projet
                <input value={newReal.title} onChange={(e) => setNewReal((p) => ({ ...p, title: e.target.value }))} placeholder="ex. Carte de visite entreprise" />
              </label>
              <label className="admin-realisation-field">
                Lieu
                <input value={newReal.lieu} onChange={(e) => setNewReal((p) => ({ ...p, lieu: e.target.value }))} placeholder="ex. Abidjan, CI" />
              </label>
              <label className="admin-realisation-field">
                Description
                <textarea rows={3} value={newReal.description} onChange={(e) => setNewReal((p) => ({ ...p, description: e.target.value }))} placeholder="Besoin du client, solution apportée…" />
              </label>
              <label className="admin-realisation-field">
                Photo (facultatif)
                <input type="file" accept={IMAGE_ACCEPT} onChange={(e) => setNewRealFile(e.target.files?.[0] || null)} />
              </label>
              <button type="submit" className="btn btn-primary admin-realisation-save" disabled={newRealStatus === 'saving'}>
                {newRealStatus === 'saving' ? 'Ajout…' : 'Ajouter'}
              </button>
              {newRealStatus && newRealStatus !== 'saving' && <p className="admin-error">{newRealStatus}</p>}
            </div>
          </form>

          {realisationsLoaded && realisations.length === 0 && (
            <p className="admin-empty">Aucune réalisation pour l'instant.</p>
          )}

          <div className="admin-images-grid">
            {realisations.map((r) => {
              const slot = r.id;
              const busy = imageStatus[slot] === 'uploading' || imageStatus[slot] === 'deleting';
              return (
                <div className="admin-image-card admin-realisation-card" key={r.id}>
                  <div className="admin-image-preview">
                    <img
                      key={imageVersion[slot] || 'initial'}
                      src={`${API_URL}/api/site-images/${slot}/file${imageVersion[slot] ? `?v=${imageVersion[slot]}` : ''}`}
                      alt={r.title}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                    />
                  </div>
                  <div className="admin-image-body admin-realisation-body">
                    <div className="admin-image-actions">
                      <label className="btn btn-secondary admin-image-upload">
                        {imageStatus[slot] === 'uploading' ? 'Envoi…' : 'Changer la photo'}
                        <input type="file" accept={IMAGE_ACCEPT} hidden disabled={busy} onChange={(e) => uploadSiteImage(slot, e.target.files?.[0])} />
                      </label>
                    </div>
                    {imageStatus[slot] === 'error' && <p className="admin-error">{imageError[slot]}</p>}

                    <label className="admin-realisation-field">
                      Titre du projet
                      <input value={r.title} onChange={(e) => updateRealisationField(r.id, 'title', e.target.value)} />
                    </label>
                    <label className="admin-realisation-field">
                      Lieu
                      <input value={r.lieu || ''} onChange={(e) => updateRealisationField(r.id, 'lieu', e.target.value)} placeholder="ex. Abidjan, CI" />
                    </label>
                    <label className="admin-realisation-field">
                      Description
                      <textarea rows={3} value={r.description || ''} onChange={(e) => updateRealisationField(r.id, 'description', e.target.value)} />
                    </label>

                    <div className="admin-image-actions">
                      <button
                        type="button"
                        className="btn btn-primary admin-realisation-save"
                        onClick={() => saveRealisation(r)}
                        disabled={realisationStatus[r.id] === 'saving'}
                      >
                        {realisationStatus[r.id] === 'saving' ? 'Enregistrement…' : realisationStatus[r.id] === 'saved' ? 'Enregistré ✓' : 'Enregistrer'}
                      </button>
                      {!confirmingDelete[`real:${r.id}`] ? (
                        <button
                          type="button"
                          className="btn btn-secondary admin-image-delete"
                          disabled={realisationStatus[r.id] === 'deleting'}
                          onClick={() => setConfirmingDelete((prev) => ({ ...prev, [`real:${r.id}`]: true }))}
                        >
                          {realisationStatus[r.id] === 'deleting' ? 'Suppression…' : 'Supprimer'}
                        </button>
                      ) : (
                        <span className="admin-image-confirm">
                          Supprimer cette réalisation ?
                          <button type="button" className="btn btn-danger" onClick={() => deleteRealisation(r.id)}>Oui</button>
                          <button type="button" className="btn btn-secondary" onClick={() => setConfirmingDelete((prev) => ({ ...prev, [`real:${r.id}`]: false }))}>Annuler</button>
                        </span>
                      )}
                    </div>
                    {realisationStatus[r.id] === 'error' && <p className="admin-error">{realisationError[r.id]}</p>}
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
