import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://192.168.10.224:3001/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://192.168.10.224:3001/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      loadUsers();
    } catch (err) {
      console.error('Erreur changement rôle:', err);
    }
  };

  return (
    <div className="fdap-form-container">
      <header className="fdap-header">
        <div>
          <h1>👨‍💼 Administration</h1>
          <p>{user.prenom} {user.nom}</p>
        </div>
        <div className="fdap-header-actions">
          <Link to="/" className="fdap-btn fdap-btn-secondary">
            ← Retour
          </Link>
          <button onClick={onLogout} className="fdap-btn fdap-btn-outline">
            Déconnexion
          </button>
        </div>
      </header>

      <h2>👥 Utilisateurs ({users.length})</h2>

      {loading ? (
        <div className="fdap-loading">Chargement...</div>
      ) : (
        <table className="fdap-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Niveau</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.prenom} {u.nom}</td>
                <td>{u.email}</td>
                <td>{u.niveau}</td>
                <td>
                  <span className={`fdap-badge fdap-badge-${u.role.toLowerCase()}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {u.id !== user.id && (
                    <button
                      onClick={() => toggleRole(u.id, u.role)}
                      className="fdap-btn fdap-btn-sm"
                    >
                      {u.role === 'ADMIN' ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}