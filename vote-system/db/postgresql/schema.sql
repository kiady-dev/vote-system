-- PostgreSQL schema for the vote system.
-- The elector and candidate lists can be inserted later.

CREATE TABLE IF NOT EXISTS elections (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_elections_status CHECK (status IN ('DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED'))
);

CREATE TABLE IF NOT EXISTS electors (
    id BIGSERIAL PRIMARY KEY,
    voter_code VARCHAR(50) NOT NULL UNIQUE,
    national_id VARCHAR(100) UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    promotion_label VARCHAR(50) NOT NULL,
    voting_password_hash VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(255),
    date_of_birth DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    has_voted BOOLEAN NOT NULL DEFAULT FALSE,
    voted_at TIMESTAMPTZ,
    voting_channel VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_electors_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
    CONSTRAINT chk_electors_voting_channel CHECK (
        voting_channel IS NULL OR voting_channel IN ('ONLINE', 'PRESENTIEL')
    )
);

CREATE TABLE IF NOT EXISTS candidates (
    id BIGSERIAL PRIMARY KEY,
    election_id BIGINT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    candidate_number INT NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    display_name VARCHAR(200),
    biography TEXT,
    photo_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_candidates_status CHECK (status IN ('ACTIVE', 'WITHDRAWN')),
    CONSTRAINT uq_candidates_election_number UNIQUE (election_id, candidate_number),
    CONSTRAINT uq_candidates_election_name UNIQUE (election_id, full_name)
);

CREATE TABLE IF NOT EXISTS votes (
    id BIGSERIAL PRIMARY KEY,
    election_id BIGINT NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    elector_id BIGINT NOT NULL REFERENCES electors(id) ON DELETE RESTRICT,
    candidate_id BIGINT NOT NULL REFERENCES candidates(id) ON DELETE RESTRICT,
    voting_channel VARCHAR(20) NOT NULL,
    cast_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recorded_by VARCHAR(200),
    receipt_code VARCHAR(64) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    CONSTRAINT chk_votes_channel CHECK (voting_channel IN ('ONLINE', 'PRESENTIEL')),
    CONSTRAINT uq_votes_one_per_elector UNIQUE (election_id, elector_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_type VARCHAR(50) NOT NULL,
    actor_id VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidates_election_id ON candidates (election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election_id ON votes (election_id);
CREATE INDEX IF NOT EXISTS idx_votes_candidate_id ON votes (candidate_id);
CREATE INDEX IF NOT EXISTS idx_votes_elector_id ON votes (elector_id);
CREATE INDEX IF NOT EXISTS idx_electors_has_voted ON electors (has_voted);

-- Insert the election first, then the candidates, then the electors.
-- Later, I can generate the INSERT script once you send the two lists.