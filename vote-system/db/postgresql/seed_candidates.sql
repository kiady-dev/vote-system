BEGIN;

-- Election for the 2026 president and treasurer vote.
WITH election_row AS (
    INSERT INTO elections (code, title, description, status)
    VALUES (
        'election-president-tresorier-2026',
        'Election President et Tresorier - Session 2026',
        'Syndicat du Corps des Commissaires du Commerce et de la Concurrence - Comite Ad Hoc',
        'DRAFT'
    )
    ON CONFLICT (code) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description,
            status = EXCLUDED.status
    RETURNING id
)
INSERT INTO candidates (
    election_id,
    candidate_number,
    full_name,
    display_name,
    biography,
    photo_url,
    status
)
SELECT
    election_row.id,
    candidate_data.candidate_number,
    candidate_data.full_name,
    candidate_data.display_name,
    candidate_data.biography,
    candidate_data.photo_url,
    'ACTIVE'
FROM election_row
CROSS JOIN (
    VALUES
        (1, 'RAKOTOSOLOFO Heriniaina Roland', 'Heriniaina Roland RAKOTOSOLOFO', 'Candidat à la présidence et trésorerie - 7ème PROMOTION', '/images/candidat1.png'),
        (2, 'RAKOTOARIMANANA Nantenaina Fabien', 'Nantenaina Fabien RAKOTOARIMANANA', 'Candidat à la présidence et trésorerie - 5ème PROMOTION', '/images/candidat2.png'),
        (3, 'RAHARIMALALA Vololonjanahary Anicette', 'Vololonjanahary Anicette RAHARIMALALA', 'Candidat à la présidence et trésorerie - 3ème PROMOTION', '/images/candidat3.png')
) AS candidate_data(candidate_number, full_name, display_name, biography, photo_url)
ON CONFLICT (election_id, candidate_number) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        display_name = EXCLUDED.display_name,
        biography = EXCLUDED.biography,
        photo_url = EXCLUDED.photo_url,
        status = EXCLUDED.status;

COMMIT;