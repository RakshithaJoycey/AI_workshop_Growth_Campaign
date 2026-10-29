# Build in 60 | NxtWave Growth Fieldbook

A full-stack, simulation-only response to the NxtWave Growth Intern challenge. The site combines the growth plan, campaign assumptions, AI learning notes, a three-minute presentation script, and a working campus referral tracker.

## Stack

- Frontend: React 18, Vite, Node.js, lucide-react
- API: Python 3.10+, FastAPI, Pydantic, Uvicorn
- Storage: local JSON file at `backend/registrations.json` (created after the first demo signup)

## Run locally

Use two terminals from this project directory.

Terminal 1, Python API:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

Terminal 2, Node.js frontend:

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

## Demo API

- `GET /api/health` reports whether the local simulation API is running.
- `GET /api/stats` returns the 500-registration target and campus-code leaderboard.
- `POST /api/registrations` records a first name and a campus referral code.

The form deliberately does not collect email addresses or phone numbers. Entries stay on the local machine and are only for demonstrating the workflow. Delete `backend/registrations.json` to reset the demo counts.

## Campaign assumptions

| Channel | Modeled registrations |
| --- | ---: |
| WhatsApp communities | 180 |
| College clubs and class reps | 170 |
| Instagram and LinkedIn | 100 |
| Faculty and placement email | 50 |
| **Total** | **500** |

These are planning estimates, not guarantees. They depend on partner participation and must be checked against tagged registrations during the campaign. Budget allocation: ₹1,200 best-performing demo boost, ₹500 campus QR prints, ₹300 contingency/data.