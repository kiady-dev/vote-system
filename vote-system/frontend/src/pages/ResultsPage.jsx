function ResultsPage({
  candidates,
  electionStatus,
  results,
  chartData,
  resultsLoading,
  resultsError,
  resultsUpdatedAt,
  fetchResults,
  navigateToPage,
}) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">RESULTATS PUBLICS</div>
          <h1>Résultats en temps réel</h1>
          <p>
            Cette page affiche le décompte actif des voix, sans encombrer l'espace de vote.
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
              className="page-link-button"
              onClick={() => navigateToPage('admin')}
            >
              Page admin
            </button>
            <button
              type="button"
              className="page-link-button active"
              onClick={() => navigateToPage('results')}
            >
              Résultats live
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{candidates.length}</strong>
              <span>Candidats</span>
            </div>
            <div>
              <strong>{results?.totalVotes ?? 0}</strong>
              <span>Voix comptabilisées</span>
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
                <span className="status-dot" />
                <strong>Diffusion en direct</strong>
              </div>
              <button className="ghost-button" onClick={() => fetchResults()} type="button">
                {resultsLoading ? 'Actualisation...' : 'Actualiser'}
              </button>
            </div>
            <p>Le tableau se met à jour automatiquement toutes les 5 secondes.</p>
            <div className="vote-state">{results?.totalVotes ?? 0} voix totales</div>
            {resultsUpdatedAt && !resultsLoading && (
              <p className="panel-note">
                Dernière mise à jour: {resultsUpdatedAt.toLocaleTimeString('fr-FR')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section-card results-page-card">
        <div className="section-header">
          <div>
            <span className="section-kicker">Résultats</span>
            <h2>Répartition des voix</h2>
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
      </section>
    </>
  );
}

export default ResultsPage;
