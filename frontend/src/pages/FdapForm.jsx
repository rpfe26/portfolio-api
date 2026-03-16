import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function FdapForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
    ameliorations: '',
    // Médias (files)
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
      const res = await fetch(`http://192.168.10.224:3001/api/fdap/${id}`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const url = isNew
        ? 'http://192.168.10.224:3001/api/fdap'
        : `http://192.168.10.224:3001/api/fdap/${id}`;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFdap({ ...fdap, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFdap({ ...fdap, [field]: file });
  };

  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
    const photos = [...fdap.photos];
    photos[index] = file;
    setFdap({ ...fdap, photos });
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
            <div className="fdap-field">
              <label>Lieu spécifique</label>
              <input
                type="text"
                name="lieuSpecifique"
                value={fdap.lieuSpecifique}
                onChange={handleChange}
                placeholder="Atelier, salle, etc."
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
            <div className="fdap-field">
              <label>Commanditaire</label>
              <input
                type="text"
                name="commanditaire"
                value={fdap.commanditaire}
                onChange={handleChange}
                placeholder="Personne demandeuse"
              />
            </div>
            <div className="fdap-field">
              <label>Contraintes</label>
              <input
                type="text"
                name="contraintes"
                value={fdap.contraintes}
                onChange={handleChange}
                placeholder="Délais, ressources..."
              />
            </div>
            <div className="fdap-field">
              <label>Consignes reçues</label>
              <textarea
                name="consignes"
                value={fdap.consignes}
                onChange={handleChange}
                rows={2}
                placeholder="Instructions données..."
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
              {/* Audio */}
              <div className="fdap-media-item">
                <label>Audio</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange(e, 'audio')}
                    className="fdap-hidden-input"
                  />
                  <span className="fdap-upload-icon">🎤</span>
                  <span className="fdap-upload-text">Ajouter un audio</span>
                  <span className="fdap-upload-hint">
                    {fdap.audio?.name?.substring(0, 25) || 'MP3, WAV, OGG...'}
                  </span>
                </label>
              </div>

              {/* Vidéo */}
              <div className="fdap-media-item">
                <label>Vidéo</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="fdap-hidden-input"
                  />
                  <span className="fdap-upload-icon">📹</span>
                  <span className="fdap-upload-text">Ajouter une vidéo</span>
                  <span className="fdap-upload-hint">
                    {fdap.video?.name?.substring(0, 25) || 'MP4, WebM, MOV...'}
                  </span>
                </label>
              </div>

              {/* Document */}
              <div className="fdap-media-item">
                <label>Document</label>
                <label className="fdap-upload-box">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={(e) => handleFileChange(e, 'document')}
                    className="fdap-hidden-input"
                  />
                  <span className="fdap-upload-icon">📄</span>
                  <span className="fdap-upload-text">Ajouter un document</span>
                  <span className="fdap-upload-hint">
                    {fdap.document?.name?.substring(0, 25) || 'PDF, Word, Excel...'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="fdap-section">
          <h3>📷 Photos</h3>
          <div className="fdap-section-body">
            <div className="fdap-photos-grid">
              {[1,2,3,4,5,6].map((n, index) => (
                <div key={n} className="fdap-photo-item">
                  <label>Photo {n}</label>
                  <label className="fdap-upload-box fdap-upload-box-photo">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, index)}
                      className="fdap-hidden-input"
                    />
                    <span className="fdap-upload-icon">📷</span>
                    <span className="fdap-upload-text">Photo {n}</span>
                    {fdap.photos[index]?.name && (
                      <span className="fdap-upload-hint">{fdap.photos[index].name.substring(0, 20)}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fdap-submit-wrap">
          <button type="submit" className="fdap-submit-btn" disabled={saving}>
            {saving ? 'Enregistrement...' : isNew ? 'Enregistrer la fiche' : 'Mettre à jour'}
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