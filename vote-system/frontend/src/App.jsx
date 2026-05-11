import { useEffect, useMemo, useState, Suspense, lazy } from 'react';
const AdminPage = lazy(() => import('./pages/AdminPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const VotePage = lazy(() => import('./pages/VotePage'));
const ElectorsPage = lazy(() => import('./pages/ElectorsPage'));
const AdminLock = lazy(() => import('./components/AdminLock'));
import Header from './components/Header';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const ELECTION_CODE = import.meta.env.VITE_ELECTION_CODE || 'election-president-tresorier-2026';

function buildImageUrl(photoUrl) {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) return photoUrl;
  return `${API_BASE_URL}${photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`}`;
}

async function requestJson(path, options = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    ...options,
    headers: finalHeaders,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);

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
    const message = body?.message || body?.error || 'Une erreur est survenue';
    throw new Error(message);
  }

  return body;
}

function mapLoginError(message = '') {
  if (message.includes('Elector not found')) {
    return 'Identifiant incorrect.';
  }
  if (message.includes('Invalid voting password')) {
    return 'Mot de passe incorrect.';
  }
  if (message.includes('Voting password is not configured')) {
    return 'Mot de passe non configure pour cet electeur.';
  }
  if (message.includes('Election not found')) {
    return 'Election introuvable.';
  }

  return message || 'Impossible de verifier les identifiants.';
}

function mapVoteError(message = '') {
  if (message.includes('Elector has already voted')) {
    return 'Vote deja enregistre pour cet electeur.';
  }
  if (message.includes('Candidate not found')) {
    return 'Candidat introuvable.';
  }
  if (message.includes('Invalid IP address')) {
    return 'Adresse IP invalide.';
  }
  if (message.includes('Election is not open')) {
    return 'Election fermee. Le vote est bloque.';
  }

  return message || 'Impossible de valider le vote.';
}

function getPageFromPath() {
  if (typeof window === 'undefined') return 'vote';

  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  if (path.endsWith('/admin/electors') || path.endsWith('/electors')) return 'admin-electors';
  if (path.endsWith('/admin')) return 'admin';
  if (path.endsWith('/results')) return 'results';
  return 'vote';
}

function navigateToPage(page) {
  if (typeof window === 'undefined') return;

  let nextPath = '/vote';
  if (page === 'admin') nextPath = '/admin';
  else if (page === 'admin-electors' || page === 'electors') nextPath = '/admin/electors';
  else if (page === 'results') nextPath = '/results';

  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

function App() {
  const [voterCode, setVoterCode] = useState('');
  const [votingPassword, setVotingPassword] = useState('');
  const [candidateNumber, setCandidateNumber] = useState(null);
  const [elector, setElector] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [electionStatus, setElectionStatus] = useState(null);
  const [results, setResults] = useState(null);
  const [resultsUpdatedAt, setResultsUpdatedAt] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState('');
  const [electors, setElectors] = useState([]);
  const [electorsUpdatedAt, setElectorsUpdatedAt] = useState(null);
  const [electorsLoading, setElectorsLoading] = useState(false);
  const [electorsError, setElectorsError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [loginLoading, setLoginLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [systemError, setSystemError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [voteError, setVoteError] = useState('');
  const [info, setInfo] = useState('');
  const [activePage, setActivePage] = useState(() => getPageFromPath());
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  useEffect(() => {
    const syncPage = () => setActivePage(getPageFromPath());
    window.addEventListener('popstate', syncPage);

    if (window.location.pathname.toLowerCase().endsWith('/electors')
      && !window.location.pathname.toLowerCase().endsWith('/admin/electors')) {
      window.history.replaceState({}, '', '/admin/electors');
    } else if (!window.location.pathname.endsWith('/vote')
      && !window.location.pathname.endsWith('/admin')
      && !window.location.pathname.endsWith('/results')
      && !window.location.pathname.endsWith('/admin/electors')) {
      window.history.replaceState({}, '', '/vote');
    }

    syncPage();

    if (getPageFromPath() === 'admin') {
      setAdminUnlocked(false);
    }

    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  useEffect(() => {
    if (activePage === 'admin') {
      setAdminUnlocked(false);
    }
  }, [activePage]);

  useEffect(() => {
    requestJson(`/api/elections/${ELECTION_CODE}/candidates`)
      .then(setCandidates)
      .catch((cause) => setSystemError(cause.message));

    requestJson(`/api/elections/${ELECTION_CODE}`)
      .then(setElectionStatus)
      .catch((cause) => setSystemError(cause.message));
  }, []);

  useEffect(() => {
    if (activePage !== 'admin') return;
    if (results || resultsLoading) return;
    fetchResults();
  }, [activePage, results, resultsLoading]);

  useEffect(() => {
    if (activePage !== 'results') return;

    fetchResults({ silent: !results });

    const intervalId = window.setInterval(() => {
      fetchResults({ silent: true });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [activePage, results]);

  useEffect(() => {
    if (activePage !== 'admin-electors') return;
    if (!adminUnlocked) return;
    if (electors.length || electorsLoading) return;
    fetchElectors();
  }, [activePage, adminUnlocked, electors, electorsLoading]);

  const selectedCandidate = useMemo(
    () => candidates.find((candidate) => candidate.candidateNumber === candidateNumber),
    [candidates, candidateNumber],
  );

  const isElectionOpen = electionStatus?.status === 'OPEN';
  const chartData = useMemo(() => {
    if (!results?.candidates?.length) return [];
    const totalVotes = results.totalVotes || 0;

    return results.candidates.map((candidate) => {
      const share = totalVotes ? Math.round((candidate.voteCount / totalVotes) * 100) : 0;
      return { ...candidate, share };
    });
  }, [results]);
  const voteButtonLabel = voteLoading
    ? 'Enregistrement...'
    : elector?.hasVoted
      ? 'Vote déjà effectué'
      : !isElectionOpen
        ? 'Élection fermée'
        : 'Confirmer mon vote';
  const statusLabel = electionStatus?.status || 'UNKNOWN';
  const statusClass = statusLabel.toLowerCase();
  const statusText = electionStatus?.status === 'OPEN'
    ? 'ouverte'
    : electionStatus?.status === 'CLOSED'
      ? 'fermée'
      : 'inconnue';

  async function handleLogin(event) {
    event.preventDefault();
    setSystemError('');
    setInfo('');
    setReceipt(null);
    setLoginError('');
    setLoginLoading(true);

    try {
      const loginResult = await requestJson(`/api/elections/${ELECTION_CODE}/login`, {
        method: 'POST',
        body: JSON.stringify({
          voterCode: voterCode.trim(),
          votingPassword,
        }),
      });

      setElector(loginResult);
      setLoginError('');
      if (loginResult.hasVoted) {
        setInfo('Cet électeur a déjà voté.');
      } else if (!isElectionOpen) {
        setInfo('Election fermee. Le vote est bloque.');
      } else {
        setInfo(`Bienvenue ${loginResult.fullName}. Vous pouvez choisir un candidat.`);
      }
    } catch (cause) {
      setLoginError(mapLoginError(cause.message));
      setElector(null);
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleVote() {
    if (!elector) return;
    if (!isElectionOpen) {
      setVoteError('Election fermee. Le vote est bloque.');
      return;
    }
    if (!candidateNumber) {
      setVoteError('Choisis un candidat avant de valider.');
      return;
    }

    setSystemError('');
    setInfo('');
    setVoteError('');
    setVoteLoading(true);

    try {
      const voteResult = await requestJson(`/api/elections/${ELECTION_CODE}/votes`, {
        method: 'POST',
        body: JSON.stringify({
          voterCode: voterCode.trim(),
          votingPassword,
          candidateNumber,
          votingChannel: 'ONLINE',
          recordedBy: 'frontend-web',
          userAgent: navigator.userAgent,
        }),
      });

      setReceipt(voteResult);
      setInfo('Votre vote a bien été enregistré.');
      setElector((current) => (current ? { ...current, hasVoted: true } : current));
      await fetchResults();
    } catch (cause) {
      setVoteError(mapVoteError(cause.message));
    } finally {
      setVoteLoading(false);
    }
  }

  async function fetchResults(options = {}) {
    const { silent = false } = options;
    setResultsError('');
    if (!silent) {
      setResultsLoading(true);
    }

    try {
      const resultsPayload = await requestJson(`/api/elections/${ELECTION_CODE}/results`);
      setResults(resultsPayload);
      setResultsUpdatedAt(new Date());
    } catch (cause) {
      setResultsError(cause.message);
    } finally {
      if (!silent) {
        setResultsLoading(false);
      }
    }
  }

  async function fetchElectors() {
    setElectorsError('');
    setElectorsLoading(true);

    try {
      const electorsPayload = await requestJson(`/api/elections/${ELECTION_CODE}/electors`, {
        headers: {
          'X-Admin-Token': adminToken,
        },
      });
      setElectors(electorsPayload);
      setElectorsUpdatedAt(new Date());
    } catch (cause) {
      setElectorsError(cause.message || 'Impossible de charger la liste des électeurs.');
    } finally {
      setElectorsLoading(false);
    }
  }

  async function updateElectionStatus(status) {
    setStatusError('');
    setStatusUpdating(true);

    try {
      const updatedStatus = await requestJson(`/api/elections/${ELECTION_CODE}/status`, {
        method: 'PATCH',
        headers: {
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ status }),
      });
      setElectionStatus(updatedStatus);
      setInfo(`Statut mis a jour: ${updatedStatus.status}`);
    } catch (cause) {
      setStatusError(cause.message || 'Impossible de modifier le statut.');
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleReset() {
    setElector(null);
    setCandidateNumber(null);
    setReceipt(null);
    setInfo('');
    setSystemError('');
    setLoginError('');
    setVoteError('');
    setResults(null);
    setResultsError('');
    setElectors([]);
    setElectorsError('');
    setStatusError('');
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <Header activePage={activePage} navigateToPage={navigateToPage} />

      <main className="page">
        <Suspense fallback={<div className="loading">Chargement…</div>}>
          {activePage === 'admin' && (
            !adminUnlocked ? (
              <AdminLock
                adminToken={adminToken}
                setAdminToken={setAdminToken}
                setAdminUnlocked={setAdminUnlocked}
                navigateToPage={navigateToPage}
              />
            ) : (
              <AdminPage
                candidates={candidates}
                elector={elector}
                electionStatus={electionStatus}
                statusLabel={statusLabel}
                statusClass={statusClass}
                results={results}
                chartData={chartData}
                resultsLoading={resultsLoading}
                resultsError={resultsError}
                statusError={statusError}
                statusUpdating={statusUpdating}
                adminToken={adminToken}
                setAdminToken={setAdminToken}
                updateElectionStatus={updateElectionStatus}
                fetchResults={fetchResults}
                navigateToPage={navigateToPage}
              />
            )
          )}

          {activePage === 'vote' && (
            <VotePage
              buildImageUrl={buildImageUrl}
              candidates={candidates}
              candidateNumber={candidateNumber}
              setCandidateNumber={setCandidateNumber}
              setVoteError={setVoteError}
              elector={elector}
              selectedCandidate={selectedCandidate}
              isElectionOpen={isElectionOpen}
              statusText={statusText}
              voteButtonLabel={voteButtonLabel}
              voteLoading={voteLoading}
              voteError={voteError}
              handleVote={handleVote}
              receipt={receipt}
              loginLoading={loginLoading}
              voterCode={voterCode}
              setVoterCode={setVoterCode}
              setLoginError={setLoginError}
              votingPassword={votingPassword}
              setVotingPassword={setVotingPassword}
              loginError={loginError}
              handleLogin={handleLogin}
              electionStatus={electionStatus}
              navigateToPage={navigateToPage}
              handleReset={handleReset}
              info={info}
            />
          )}

          {activePage === 'results' && (
            <ResultsPage
              candidates={candidates}
              electionStatus={electionStatus}
              results={results}
              chartData={chartData}
              resultsLoading={resultsLoading}
              resultsError={resultsError}
              resultsUpdatedAt={resultsUpdatedAt}
              fetchResults={fetchResults}
              navigateToPage={navigateToPage}
            />
          )}

          {activePage === 'admin-electors' && (
            !adminUnlocked ? (
              <AdminLock
                adminToken={adminToken}
                setAdminToken={setAdminToken}
                setAdminUnlocked={setAdminUnlocked}
                navigateToPage={navigateToPage}
              />
            ) : (
              <ElectorsPage
                electors={electors}
                electorsLoading={electorsLoading}
                electorsError={electorsError}
                electorsUpdatedAt={electorsUpdatedAt}
                fetchElectors={fetchElectors}
                navigateToPage={navigateToPage}
              />
            )
          )}
        </Suspense>

        {(systemError || info) && (
          <section className={`toast-card ${systemError ? 'error' : 'info'}`}>
            <strong>{systemError ? 'Erreur' : 'Information'}</strong>
            <p>{systemError || info}</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;