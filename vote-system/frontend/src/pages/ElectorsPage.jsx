import { useMemo, useState } from 'react';

function ElectorsPage({
  electors,
  electorsLoading,
  electorsError,
  electorsUpdatedAt,
  fetchElectors,
  navigateToPage,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [voteFilter, setVoteFilter] = useState('ALL');

  const filteredElectors = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return electors.filter((elector) => {
      const matchesSearch = !normalizedSearch
        || [elector.voterCode, elector.fullName, elector.promotionLabel, elector.status, elector.votingChannel]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));

      const matchesStatus = statusFilter === 'ALL' || elector.status === statusFilter;
      const matchesVote = voteFilter === 'ALL'
        || (voteFilter === 'VOTED' && elector.hasVoted)
        || (voteFilter === 'PENDING' && !elector.hasVoted);

      return matchesSearch && matchesStatus && matchesVote;
    });
  }, [electors, searchTerm, statusFilter, voteFilter]);

  return (
    <>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">ESPACE ADMIN</div>
          <h1>Liste des électeurs</h1>
          <p>
            Consultation et suivi de tous les électeurs enregistrés, avec recherche et filtres.
          </p>
          <div className="hero-nav">
            <button type="button" className="page-link-button" onClick={() => navigateToPage('admin')}>
              Tableau de bord
            </button>
            <button type="button" className="page-link-button active" onClick={() => navigateToPage('admin-electors')}>
              Électeurs
            </button>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-summary">
            <div className="summary-header">
              <div>
                <span className="status-dot" />
                <strong>Administration</strong>
              </div>
              <button className="ghost-button" onClick={() => navigateToPage('vote')} type="button">
                Retour au vote
              </button>
            </div>
            <p>Cette section est dédiée à l'administration des électeurs.</p>
            <div className="vote-state">{filteredElectors.length}/{electors.length} affichés</div>
          </div>
        </div>
      </section>

      <section className="section-card electors-card">
        <div className="section-header">
          <div>
            <span className="section-kicker">Électeurs</span>
            <h2>Annuaire complet</h2>
          </div>
          <button className="ghost-button" type="button" onClick={fetchElectors} disabled={electorsLoading}>
            {electorsLoading ? 'Chargement...' : 'Actualiser'}
          </button>
        </div>

        <div className="electors-toolbar">
          <label>
            <span>Recherche</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Code, nom, promotion, statut..."
            />
          </label>

          <label>
            <span>Statut</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">Tous</option>
              <option value="ACTIVE">Actifs</option>
              <option value="INACTIVE">Inactifs</option>
              <option value="SUSPENDED">Suspendus</option>
            </select>
          </label>

          <label>
            <span>Vote</span>
            <select value={voteFilter} onChange={(event) => setVoteFilter(event.target.value)}>
              <option value="ALL">Tous</option>
              <option value="VOTED">Déjà voté</option>
              <option value="PENDING">En attente</option>
            </select>
          </label>
        </div>

        {electorsUpdatedAt && !electorsLoading && (
          <p className="results-updated-at">Dernière mise à jour: {electorsUpdatedAt.toLocaleTimeString('fr-FR')}</p>
        )}

        {electorsError && <p className="results-error">{electorsError}</p>}

        {filteredElectors.length ? (
          <div className="electors-grid">
            {filteredElectors.map((elector) => (
              <article key={elector.voterCode} className="elector-card">
                <div className="elector-card-header">
                  <div>
                    <span className="elector-code">{elector.voterCode}</span>
                    <strong>{elector.fullName}</strong>
                  </div>
                  <span className={`status-pill status-${elector.status.toLowerCase()}`}>{elector.status}</span>
                </div>

                <p className="elector-promotion">{elector.promotionLabel}</p>

                <div className="elector-meta">
                  <div>
                    <span>Vote</span>
                    <strong>{elector.hasVoted ? 'Déjà voté' : 'En attente'}</strong>
                  </div>
                  <div>
                    <span>Canal</span>
                    <strong>{elector.votingChannel || 'N/A'}</strong>
                  </div>
                </div>

                {elector.votedAt && (
                  <p className="elector-time">Voté le {new Date(elector.votedAt).toLocaleString('fr-FR')}</p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="results-muted">
            {electorsLoading ? 'Chargement des électeurs...' : 'Aucun électeur trouvé.'}
          </p>
        )}
      </section>
    </>
  );
}

export default ElectorsPage;
