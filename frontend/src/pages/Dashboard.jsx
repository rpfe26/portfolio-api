import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  const [fdaps, setFdaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFdaps();
  }, []);

  const loadFdaps = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.10.224:3001/api/fdap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFdaps(data.fdaps || []);
    } catch (err) {
      console.error('Erreur chargement FDAP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fdap-form-container">
      <header className="fdap-header">
        <div>
          <h1>📁 Mon Portfolio</h1>
          <p>Bienvenue, {user.prenom} {user.nom} ({user.role})</p>
        </div>
        <div className="fdap-header-actions">
          {user.role === 'ADMIN' && (
            <Link to="/admin" className="fdap-btn fdap-btn-secondary">
              👨‍💼 Admin
            </Link>
          )}
          <button onClick={onLogout} className="fdap-btn fdap-btn-outline">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="fdap-actions">
        <Link to="/fdap/new" className="fdap-btn fdap-btn-primary">
          + Nouvelle fiche
        </Link>
      </div>

      {loading ? (
        <div className="fdap-loading">Chargement...</div>
      ) : fdaps.length === 0 ? (
        <div className="fdap-empty">
          <p>Aucune fiche pour le moment.</p>
          <Link to="/fdap/new" className="fdap-btn fdap-btn-primary">
            Créer ma première fiche
          </Link>
        </div>
      ) : (
        <div className="fdap-grid">
          {fdaps.map((fdap, index) => (
            <div key={fdap.id} className="fdap-card">
              <div className="fdap-card-number">#{index + 1}</div>
              <h3>{fdap.titre}</h3>
              <p className="fdap-card-date">
                {new Date(fdap.dateSaisie).toLocaleDateString('fr-FR')}
              </p>
              <p className="fdap-card-lieu">{fdap.lieu}</p>
              <Link to={`/fdap/${fdap.id}`} className="fdap-btn fdap-btn-sm">
                Voir / Modifier
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}