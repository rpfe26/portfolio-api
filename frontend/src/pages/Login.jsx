import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://192.168.10.224:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion');
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
        <h1 className="fdap-login-title">📁 Portfolio</h1>
        <p className="fdap-login-subtitle">Fiches d'Activités Pédagogiques</p>

        {error && <div className="fdap-error-box">{error}</div>}

        <form className="fdap-login-form" onSubmit={handleSubmit}>
          <div className="fdap-field-wrap">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="fdap-field-wrap">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" className="fdap-login-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="fdap-login-links">
          <Link to="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}