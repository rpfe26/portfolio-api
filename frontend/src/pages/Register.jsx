import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    niveau: 'CAP'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://192.168.10.224:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de l\'inscription');
      } else {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fdap-login-wrap">
      <div className="fdap-login-card">
        <h1 className="fdap-login-title">📁 Créer un compte</h1>
        <p className="fdap-login-subtitle">Portfolio Élève</p>

        {error && <div className="fdap-error-box">{error}</div>}

        <form className="fdap-login-form" onSubmit={handleSubmit}>
          <div className="fdap-field-wrap">
            <label>Nom *</label>
            <input
              type="text"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>

          <div className="fdap-field-wrap">
            <label>Prénom *</label>
            <input
              type="text"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              required
            />
          </div>

          <div className="fdap-field-wrap">
            <label>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="fdap-field-wrap">
            <label>Mot de passe *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="fdap-field-wrap">
            <label>Niveau</label>
            <select
              value={form.niveau}
              onChange={(e) => setForm({ ...form, niveau: e.target.value })}
            >
              <option value="CAP">CAP</option>
              <option value="Bac Pro">Bac Pro</option>
              <option value="BTS">BTS</option>
            </select>
          </div>

          <button type="submit" className="fdap-login-btn" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="fdap-login-links">
          <Link to="/login">Déjà un compte ? Se connecter</Link>
        </div>
      </div>
    </div>
  );
}