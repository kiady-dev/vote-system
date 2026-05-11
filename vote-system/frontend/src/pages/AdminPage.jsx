function AdminPage({
  candidates,
  elector,
  electionStatus,
  statusLabel,
  statusClass,
  results,
  chartData,
  resultsLoading,
  resultsError,
  statusError,
  statusUpdating,
  adminToken,
  setAdminToken,
  updateElectionStatus,
  fetchResults,
  navigateToPage,
}) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">ESPACE ADMIN</div>
          <h1>Pilotage de l’élection</h1>
          <p>
            Ouvre ou ferme le scrutin, puis consulte les résultats sous forme de graphique.
          </p>
          <div className="hero-nav">
            <button
              type="button"
              className="page-link-button"
              onClick={() => navigateToPage('vote')}
            >
              Page élection
            </button>
            <button
              type="button"
              className="page-link-button active"
              onClick={() => navigateToPage('admin')}
            >
              Page admin
            </button>
            <button
              type="button"
              className="page-link-button"
              onClick={() => navigateToPage('admin-electors')}
            >
              Électeurs
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{candidates.length}</strong>
              <span>Candidats</span>
            </div>
            <div>
              <strong>{elector?.hasVoted ? '1' : '0'}</strong>
              <span>Vote enregistré</span>
            </div>
            <div>
              <strong>{electionStatus?.status || '...'}</strong>
              <span>Statut</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-summary">
            <div className="summary-header">
              <div>
                <span className={`status-pill status-${statusClass}`}>{statusLabel}</span>
                <strong>Accès admin</strong>
              </div>
              <button className="ghost-button" onClick={() => navigateToPage('vote')} type="button">
                Aller au vote
              </button>
            </div>
            <p>Les commandes d’administration sont disponibles dans la page dédiée.</p>
            <div className="vote-state">{results?.totalVotes ?? 0} voix comptabilisées</div>
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="section-card admin-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">Administration</span>
              <h2>Piloter l'élection</h2>
            </div>
            <span className={`status-pill status-${statusClass}`}>{statusLabel}</span>
          </div>
          <p className="admin-note">
            Utilise le code admin pour ouvrir ou clore l'élection et rafraîchir les chiffres.
          </p>

          <button className="ghost-button admin-back" type="button" onClick={() => navigateToPage('vote')}>
            Retour à la page élection
          </button>

          <div className="admin-token">
            <label>
              <span>Code admin</span>
              <input
                type="password"
                value={adminToken}
                placeholder="Code admin"
                onChange={(event) => {
                  const value = event.target.value;
                  setAdminToken(value);
                  localStorage.setItem('adminToken', value);
                }}
              />
            </label>
          </div>

          <div className="admin-actions">
            <button
              className="ghost-button admin-button"
              type="button"
              onClick={fetchResults}
              disabled={resultsLoading}
            >
              {resultsLoading ? 'Chargement...' : 'Actualiser'}
            </button>
            <button
              className="ghost-button admin-button success"
              type="button"
              onClick={() => updateElectionStatus('OPEN')}
              disabled={statusUpdating || electionStatus?.status === 'OPEN' || !adminToken}
            >
              Ouvrir
            </button>
            <button
              className="ghost-button admin-button danger"
              type="button"
              onClick={() => updateElectionStatus('CLOSED')}
              disabled={statusUpdating || electionStatus?.status === 'CLOSED' || !adminToken}
            >
              Clore
            </button>
          </div>

          {statusError && <p className="results-error">{statusError}</p>}
        </div>

        <div className="section-card admin-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">Résultats</span>
              <h2>Graphique des voix</h2>
            </div>
            <span className="section-badge">{results?.totalVotes ?? 0} votes</span>
          </div>

          {resultsError && <p className="results-error">{resultsError}</p>}

          {results?.candidates?.length ? (
            <>
              <div className="results-chart">
                {chartData.map((candidate) => (
                  <div key={candidate.candidateId} className="chart-row">
                    <div className="chart-meta">
                      <span>#{candidate.candidateNumber} {candidate.fullName}</span>
                      <span>{candidate.voteCount} voix ({candidate.share}%)</span>
                    </div>
                    <div className="chart-bar" style={{ '--bar-width': `${candidate.share}%` }}>
                      <span />
                    </div>
                  </div>
                ))}
              </div>
              <div className="results-list">
                {results.candidates.map((candidate) => (
                  <div key={candidate.candidateId} className="results-row">
                    <div>
                      <span>#{candidate.candidateNumber}</span>
                      <strong>{candidate.fullName}</strong>
                    </div>
                    <span className="results-count">{candidate.voteCount}</span>
                  </div>
                ))}
                <div className="results-total">
                  <span>Total</span>
                  <strong>{results.totalVotes}</strong>
                </div>
              </div>
            </>
          ) : (
            <p className="results-muted">
              {resultsLoading ? 'Chargement des résultats...' : 'Aucun résultat pour le moment.'}
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminPage;
