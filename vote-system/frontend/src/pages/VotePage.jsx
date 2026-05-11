function VotePage({
  buildImageUrl,
  candidates,
  candidateNumber,
  setCandidateNumber,
  setVoteError,
  elector,
  selectedCandidate,
  isElectionOpen,
  statusText,
  voteButtonLabel,
  voteLoading,
  voteError,
  handleVote,
  receipt,
  loginLoading,
  voterCode,
  setVoterCode,
  setLoginError,
  votingPassword,
  setVotingPassword,
  loginError,
  handleLogin,
  electionStatus,
  navigateToPage,
  handleReset,
  info,
}) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">ESPACE ELECTION</div>
          <h1>Plateforme de vote hybride</h1>
          <p>
            Connexion par IM et mot de passe individuel, puis vote unique pour l'élection 2026.
          </p>
          <div className="hero-nav">
            <button
              type="button"
              className="page-link-button active"
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
              className="page-link-button"
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
          {!elector ? (
            <form className="panel-form" onSubmit={handleLogin}>
              <h2>Accès électeur</h2>
              <label>
                <span>Code électeur / IM</span>
                <input
                  value={voterCode}
                  onChange={(event) => {
                    setVoterCode(event.target.value);
                    setLoginError('');
                  }}
                  placeholder="Ex: 276210"
                  autoComplete="off"
                  className={loginError ? 'input-error' : ''}
                  aria-invalid={loginError ? 'true' : 'false'}
                  disabled={loginLoading}
                />
              </label>
              <label>
                <span>Mot de passe de vote</span>
                <input
                  value={votingPassword}
                  onChange={(event) => {
                    setVotingPassword(event.target.value);
                    setLoginError('');
                  }}
                  placeholder="Mot de passe reçu"
                  type="password"
                  autoComplete="one-time-code"
                  className={loginError ? 'input-error' : ''}
                  aria-invalid={loginError ? 'true' : 'false'}
                  disabled={loginLoading}
                />
              </label>
              {loginError && (
                <div className="form-alert error" role="alert">
                  {loginError}
                </div>
              )}
              {!isElectionOpen && electionStatus && (
                <div className="form-alert info" role="status">
                  Élection {statusText}. Le vote en ligne est bloqué.
                </div>
              )}
              <button type="submit" disabled={loginLoading}>
                {loginLoading ? 'Vérification...' : 'Vérifier mon accès'}
              </button>
              <p className="helper-text">
                Le système vérifie ton identité, puis débloque le bulletin si tu n’as pas encore voté.
              </p>
            </form>
          ) : (
            <div className="panel-summary">
              <div className="summary-header">
                <div>
                  <span className="status-dot" />
                  <strong>{elector.fullName}</strong>
                </div>
                <button className="ghost-button" onClick={handleReset} type="button">
                  Changer d’électeur
                </button>
              </div>
              <p>{elector.promotionLabel}</p>
              <div className="vote-state">
                {elector.hasVoted ? 'Vote déjà déposé' : 'Prêt à voter'}
              </div>
              {info && <p className="panel-note">{info}</p>}
            </div>
          )}
        </div>
      </section>

      <section className="content-grid">
        <div className="section-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">Candidats</span>
              <h2>Choisis une personne</h2>
            </div>
            <span className="section-badge">Session 2026</span>
          </div>

          <div className="candidate-grid">
            {candidates.map((candidate) => {
              const isSelected = candidate.candidateNumber === candidateNumber;
              return (
                <button
                  key={candidate.id}
                  type="button"
                  className={`candidate-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setCandidateNumber(candidate.candidateNumber);
                    setVoteError('');
                  }}
                  disabled={!elector || elector.hasVoted || !isElectionOpen}
                  style={{ animationDelay: `${candidate.candidateNumber * 80}ms` }}
                >
                  <img loading="lazy" decoding="async" width="400" height="240" src={buildImageUrl(candidate.photoUrl)} alt={candidate.fullName} />
                  <div className="candidate-body">
                    <div className="candidate-meta">
                      <span className="candidate-number">#{candidate.candidateNumber}</span>
                      <span className="candidate-name">{candidate.displayName || candidate.fullName}</span>
                    </div>
                    <p>{candidate.biography}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="section-card sticky-card">
          <div className="section-header">
            <div>
              <span className="section-kicker">Bulletin</span>
              <h2>Validation finale</h2>
            </div>
          </div>

          <div className="bullet-summary">
            <div>
              <span>Électeur</span>
              <strong>{elector?.fullName || 'En attente de connexion'}</strong>
            </div>
            <div>
              <span>Candidat</span>
              <strong>{selectedCandidate?.displayName || 'Aucun choix'}</strong>
            </div>
            <div>
              <span>Canal</span>
              <strong>ONLINE</strong>
            </div>
          </div>

          {!isElectionOpen && electionStatus && (
            <div className="form-alert info" role="status">
              Élection {statusText}. Le vote en ligne est bloqué.
            </div>
          )}

          <button
            className="primary-action"
            type="button"
            onClick={handleVote}
            disabled={!elector || elector.hasVoted || voteLoading || !isElectionOpen}
          >
            {voteButtonLabel}
          </button>

          {voteError && (
            <div className="form-alert error" role="alert">
              {voteError}
            </div>
          )}

          {receipt && (
            <div className="receipt-card">
              <span>Reçu</span>
              <strong>{receipt.receiptCode}</strong>
              <p>
                Vote enregistré le {new Date(receipt.castAt).toLocaleString('fr-FR')}.
              </p>
            </div>
          )}

        </aside>
      </section>
    </>
  );
}

export default VotePage;
