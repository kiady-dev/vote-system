# Vote System Frontend

## Run locally

1. Go to the frontend folder.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

By default, the frontend talks to the Spring Boot API at `http://localhost:8080` and uses the election code `election-president-tresorier-2026`.

## Environment variables

- `VITE_API_BASE_URL`: backend URL, if different from `http://localhost:8080`
- `VITE_ELECTION_CODE`: election code to load in the UI

## Notes

Candidate photos are loaded from the backend as `/images/candidat1.png`, `/images/candidat2.png`, and `/images/candidat3.png`.