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
    ameliorations: ''
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
        setFdap(data.fdap);
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

  if (loading) {
    return <div className="fdap-loading">Chargement...</div>;
  }

  return (
    <div className="fdap-form-container">
      <form onSubmit={handleSubmit} className="fdap-form">
        {/* Titre */}
        <div className="fdap-title-field">
          <label>Titre de la fiche *</label>
          <input
            type="text"
            name="titre"
            value={fdap.titre}
            onChange={handleChange}
            required
            placeholder="Ex: Montage d'une installation électrique"
          />
        </div>

        {/* Identité */}
        <div className="fdap-section">
          <h3>👤 Identité de l'élève</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Nom / Prénom</label>
              <input
                type="text"
                name="nomPrenom"
                value={fdap.nomPrenom}
                onChange={handleChange}
              />
            </div>
            <div className="fdap-field">
              <label>Date de saisie</label>
              <input
                type="date"
                name="dateSaisie"
                value={fdap.dateSaisie}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Contexte */}
        <div className="fdap-section">
          <h3>📍 Contexte de réalisation</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Lieu *</label>
              <select name="lieu" value={fdap.lieu} onChange={handleChange}>
                <option value="lycee">Au Lycée (Plateau technique)</option>
                <option value="pfmp">En Entreprise (PFMP)</option>
              </select>
            </div>
            <div className="fdap-field">
              <label>Enseigne / Entreprise</label>
              <input
                type="text"
                name="enseigne"
                value={fdap.enseigne}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Domaine */}
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
              />
            </div>
            <div className="fdap-field">
              <label>Compétences mobilisées</label>
              <textarea
                name="competences"
                value={fdap.competences}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="fdap-section">
          <h3>⚙️ Conditions et ressources</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Autonomie</label>
              <select name="autonomie" value={fdap.autonomie} onChange={handleChange}>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>
                ))}
              </select>
            </div>
            <div className="fdap-field">
              <label>Matériels utilisés</label>
              <textarea
                name="materiels"
                value={fdap.materiels}
                onChange={handleChange}
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Descriptif */}
        <div className="fdap-section">
          <h3>📝 Descriptif Détaillé</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Avec qui ?</label>
              <input
                type="text"
                name="avecQui"
                value={fdap.avecQui}
                onChange={handleChange}
              />
            </div>
            <div className="fdap-field">
              <label>Déroulement</label>
              <textarea
                name="deroulement"
                value={fdap.deroulement}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="fdap-field">
              <label>Résultats</label>
              <textarea
                name="resultats"
                value={fdap.resultats}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Bilan */}
        <div className="fdap-section">
          <h3>📊 Bilan Personnel</h3>
          <div className="fdap-section-body">
            <div className="fdap-field">
              <label>Difficulté</label>
              <select name="difficulte" value={fdap.difficulte} onChange={handleChange}>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5-n)}</option>
                ))}
              </select>
            </div>
            <div className="fdap-field">
              <label>Plaisir</label>
              <select name="plaisir" value={fdap.plaisir} onChange={handleChange}>
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
              />
            </div>
          </div>
        </div>

        <div className="fdap-actions">
          <Link to="/" className="fdap-btn fdap-btn-outline">Annuler</Link>
          <button type="submit" className="fdap-btn fdap-btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}