import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const ELECTION_CODE = import.meta.env.VITE_ELECTION_CODE || 'election-president-tresorier-2026';

async function verifyAdminToken(adminToken) {
  const response = await fetch(`${API_BASE_URL}/api/elections/${ELECTION_CODE}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adminToken }),
  });

  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
  }

  if (!response.ok) {
    const message = body?.message || body?.error || 'Token admin invalide';
    throw new Error(message);
  }
}

function AdminLock({ adminToken, setAdminToken, setAdminUnlocked, navigateToPage }) {
  const [inputToken, setInputToken] = useState(adminToken || '');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputToken.trim()) {
      const trimmedToken = inputToken.trim();
      try {
        await verifyAdminToken(trimmedToken);
        setAdminToken(trimmedToken);
        localStorage.setItem('adminToken', trimmedToken);
        setAdminUnlocked(true);
        setError('');
      } catch (cause) {
        setAdminUnlocked(false);
        setError(cause.message || 'Token admin invalide.');
      }
      return;
    }

    setError('Saisis le code admin pour continuer.');
  };

  return (
    <div className="admin-lock">
      <div className="admin-lock-container">
        <div className="admin-lock-header">
          <span className="admin-lock-icon">🔐</span>
          <h2>Connexion admin</h2>
        </div>
        <p className="admin-lock-note">
          Saisis le code admin pour vérifier ton accès avant d’ouvrir l’interface d’administration.
        </p>
        <form onSubmit={handleSubmit} className="admin-lock-form">
          <label>
            <span>Code admin</span>
            <input
              type="password"
              value={inputToken}
              onChange={(event) => {
                setInputToken(event.target.value);
                setError('');
              }}
              placeholder="Entrez le code admin"
              autoComplete="off"
            />
          </label>
          {error && (
            <div className="form-alert error" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="primary-action">
            Déverrouiller
          </button>
        </form>
        <button
          type="button"
          className="ghost-button admin-lock-back"
          onClick={() => navigateToPage('vote')}
        >
          Retour à l'espace élection
        </button>
      </div>
    </div>
  );
}

export default AdminLock;
