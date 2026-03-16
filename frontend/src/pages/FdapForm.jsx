import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://192.168.10.224:3001/api';

export default function FdapForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [fdap, setFdap] = useState({
    titre: '',
    nomPrenom: `${user.prenom} ${user.nom}`,
    dateSaisie: new Date().toISOString().split('T')[0],
    lieu: 'lycee',
    enseigne: '',
    lieuSpecifique: '',
    domaine: '',
    competences: '',
    autonomie: 3,
    materiels: '',
    commanditaire: '',
    contraintes: '',
    consignes: '',
    avecQui: '',
    deroulement: '',
    resultats: '',
    difficulte: 3,
    plaisir: 3,
    ameliorations: ''
  });

  // IDs des médias uploadés
  const [mediaIds, setMediaIds] = useState({
    audio: null,
    video: null,
    document: null,
    photos: []
  });

  // Noms des fichiers pour affichage
  const [fileNames, setFileNames] = useState({
    audio: null,
    video: null,
    document: null,
    photos: [null, null, null, null, null, null]
  });

  useEffect(() => {
    if (!isNew) {
      loadFdap();
    }
  }, [id]);

  const loadFdap = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/fdap/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFdap({ ...fdap, ...data.fdap });
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload un fichier
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    return await res.json();
  };

  // Upload plusieurs fichiers
  const uploadFiles = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/media/upload-multiple`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    return await res.json();
  };

  // Gérer l'upload d'un fichier
  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadFile(file, field);
      if (result.media) {
        setMediaIds(prev => ({ ...prev, [field]: result.media.id }));
        setFileNames(prev => ({ ...prev, [field]: file.name }));
      } else {
        alert(result.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  // Gérer l'upload des photos
  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const result = await uploadFiles(files);
      if (result.medias) {
        const newIds = result.medias.map(m => m.id);
        const newNames = files.map(f => f.name);
        
        setMediaIds(prev => ({
          ...prev,
          photos: [...prev.photos.slice(0, 6 - newIds.length), ...newIds]
        }));
        setFileNames(prev => ({
          ...prev,
          photos: [...prev.photos.slice(0, 6 - newNames.length), ...newNames]
        }));
      } else {
        alert(result.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Erreur lors de l\'upload des photos');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFdap({ ...fdap, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const url = isNew
        ? `${API_URL}/fdap`
        : `${API_URL}/fdap/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(fdap)
      });

      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      alert('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="fdap-loading">Chargement...</div>;
  }

  return (
    <div className="fdap-form-container">
      <form onSubmit={handleSubmit} className="fdap-form">
        {/* Titre */}
        <div className="fdap-title-field">
          <label>Titre de la fiche <span className="required">*</span></label>
          <input
            type="text"
            name="titre"
            value={fdap.titre}
            onChange={handleChange}
            required
            placeholder="Ex: Montage d'une installation électrique"
          />
        </div>

        {/* Identité de l'élève */}
        <div className="fdap-section">
          <h3>👤 Identité de l'élève</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Nom / Prénom <span className="required">*</span></label>
              <input
                type="text"
                name="nomPrenom"
                value={fdap.nomPrenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="fdap-field">
              <label>Date de saisie <span className="required">*</span></label>
              <input
                type="date"
                name="dateSaisie"
                value={fdap.dateSaisie}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Contexte de réalisation */}
        <div className="fdap-section">
          <h3>📍 Contexte de réalisation</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Lieu <span className="required">*</span></label>
              <div className="fdap-radio-group">
                <label className="fdap-radio-label">
                  <input
                    type="radio"
                    name="lieu"
                    value="lycee"
                    checked={fdap.lieu === 'lycee'}
                    onChange={handleChange}
                  />
                  <span className="fdap-radio-text">Au Lycée (Plateau technique)</span>
                </label>
                <label className="fdap-radio-label">
                  <input
                    type="radio"
                    name="lieu"
                    value="pfmp"
                    checked={fdap.lieu === 'pfmp'}
                    onChange={handleChange}
                  />
                  <span className="fdap-radio-text">En Entreprise (PFMP)</span>
                </label>
              </div>
            </div>
            <div className="fdap-field">
              <label>Enseigne / Entreprise</label>
              <input
                type="text"
                name="enseigne"
                value={fdap.enseigne}
                onChange={handleChange}
                placeholder="Nom de l'entreprise"
              />
            </div>
          </div>
        </div>

        {/* Domaine / Compétences */}
        <div className="fdap-section">
          <h3>🎯 Domaine / Compétences</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Domaine</label>
              <input
                type="text"
                name="domaine"
                value={fdap.domaine}
                onChange={handleChange}
                placeholder="Ex: Électrotechnique"
              />
            </div>
            <div className="fdap-field">
              <label>Compétences mobilisées</label>
              <textarea
                name="competences"
                value={fdap.competences}
                onChange={handleChange}
                rows={3}
                placeholder="Listez les compétences..."
              />
            </div>
          </div>
        </div>

        {/* Conditions et ressources */}
        <div className="fdap-section">
          <h3>⚙️ Conditions et ressources</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Autonomie</label>
              <select name="autonomie" value={fdap.autonomie} onChange={handleChange} className="fdap-select">
                <option value="">-- Sélectionner --</option>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>
                ))}
              </select>
            </div>
            <div className="fdap-field">
              <label>Matériels / Logiciels</label>
              <textarea
                name="materiels"
                value={fdap.materiels}
                onChange={handleChange}
                rows={2}
                placeholder="Outils, logiciels utilisés..."
              />
            </div>
          </div>
        </div>

        {/* Descriptif Détaillé */}
        <div className="fdap-section">
          <h3>📋 Descriptif Détaillé</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Avec qui ?</label>
              <input
                type="text"
                name="avecQui"
                value={fdap.avecQui}
                onChange={handleChange}
                placeholder="Équipe, tuteur..."
              />
            </div>
            <div className="fdap-field">
              <label>Déroulement</label>
              <textarea
                name="deroulement"
                value={fdap.deroulement}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez les étapes..."
              />
            </div>
            <div className="fdap-field">
              <label>Résultats obtenus</label>
              <textarea
                name="resultats"
                value={fdap.resultats}
                onChange={handleChange}
                rows={3}
                placeholder="Ce qui a été réalisé..."
              />
            </div>
          </div>
        </div>

        {/* Bilan Personnel */}
        <div className="fdap-section">
          <h3>💡 Bilan Personnel</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Difficulté rencontrée</label>
              <select name="difficulte" value={fdap.difficulte} onChange={handleChange} className="fdap-select">
                <option value="">-- Sélectionner --</option>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>
                ))}
              </select>
            </div>
            <div className="fdap-field">
              <label>Plaisir ressenti</label>
              <select name="plaisir" value={fdap.plaisir} onChange={handleChange} className="fdap-select">
                <option value="">-- Sélectionner --</option>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>
                ))}
              </select>
            </div>
            <div className="fdap-field">
              <label>Améliorations possibles</label>
              <textarea
                name="ameliorations"
                value={fdap.ameliorations}
                onChange={handleChange}
                rows={3}
                placeholder="Ce que vous feriez différemment..."
              />
            </div>
          </div>
        </div>

        {/* Multimédia */}
        <div className="fdap-section">
          <h3>🎤 Multimédia / Entretien</h3>
          <div className="fdap-section-body">
            <div className="fdap-media-grid">
              <div className="fdap-media-item">
                <label>Audio</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, 'audio')}
                    className="fdap-hidden-input"
                    disabled={uploading}
                  />
                  <span className="fdap-upload-icon">🎤</span>
                  <span className="fdap-upload-text">
                    {fileNames.audio || 'Ajouter un audio'}
                  </span>
                  <span className="fdap-upload-hint">MP3, WAV, OGG...</span>
                </label>
              </div>

              <div className="fdap-media-item">
                <label>Vidéo</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="fdap-hidden-input"
                    disabled={uploading}
                  />
                  <span className="fdap-upload-icon">📹</span>
                  <span className="fdap-upload-text">
                    {fileNames.video || 'Ajouter une vidéo'}
                  </span>
                  <span className="fdap-upload-hint">MP4, WebM, MOV...</span>
                </label>
              </div>

              <div className="fdap-media-item">
                <label>Document</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'document')}
                    className="fdap-hidden-input"
                    disabled={uploading}
                  />
                  <span className="fdap-upload-icon">📄</span>
                  <span className="fdap-upload-text">
                    {fileNames.document || 'Ajouter un document'}
                  </span>
                  <span className="fdap-upload-hint">PDF, Word...</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="fdap-section">
          <h3>📷 Photos (jusqu'à 6)</h3>
          <div className="fdap-section-body">
            <label className="fdap-upload-box">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosUpload}
                className="fdap-hidden-input"
                disabled={uploading}
              />
              <span className="fdap-upload-icon">📷</span>
              <span className="fdap-upload-text">
                {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
              </span>
              <span className="fdap-upload-hint">
                {fileNames.photos.filter(Boolean).length > 0 
                  ? fileNames.photos.filter(Boolean).join(', ')
                  : 'JPG, PNG, WebP...'
                }
              </span>
            </label>
          </div>
        </div>

        {/* Boutons */}
        <div className="fdap-submit-wrap">
          <button type="submit" className="fdap-submit-btn" disabled={saving || uploading}>
            {uploading ? 'Upload en cours...' : saving ? 'Enregistrement...' : isNew ? 'Enregistrer la fiche' : 'Mettre à jour'}
          </button>
        </div>

        <div className="fdap-actions" style={{ justifyContent: 'center', marginTop: '16px' }}>
          <Link to="/" className="fdap-btn fdap-btn-outline" style={{ background: 'transparent', color: '#64748b' }}>
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}