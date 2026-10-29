from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DATA_FILE = Path(__file__).parent / "registrations.json"
DATA_LOCK = Lock()
REFERRAL_CODES = {
    "BUILD-PESU": "PES University",
    "BUILD-VIT": "VIT",
    "BUILD-SRM": "SRM Institute",
    "BUILD-OTHER": "Other campus / community",
}


def load_registrations() -> list[dict]:
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def save_registrations(registrations: list[dict]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps(registrations, indent=2), encoding="utf-8")


app = FastAPI(title="Build in 60 Growth Demo API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class RegistrationInput(BaseModel):
    first_name: str = Field(min_length=2, max_length=32)
    referral_code: str = Field(min_length=1, max_length=24)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "mode": "simulation"}


@app.get("/api/stats")
def stats() -> dict:
    with DATA_LOCK:
        registrations = load_registrations()
    counts = {code: 0 for code in REFERRAL_CODES}
    for registration in registrations:
        counts[registration["referral_code"]] += 1
    leaderboard = [
        {"code": code, "campus": campus, "registrations": counts[code]}
        for code, campus in REFERRAL_CODES.items()
    ]
    leaderboard.sort(key=lambda row: (-row["registrations"], row["campus"]))
    return {"registrations": len(registrations), "target": 500, "leaderboard": leaderboard}


@app.post("/api/registrations", status_code=201)
def register(payload: RegistrationInput) -> dict:
    first_name = re.sub(r"\s+", " ", payload.first_name).strip()
    if len(first_name) < 2 or not re.fullmatch(r"[A-Za-z][A-Za-z .'-]*", first_name):
        raise HTTPException(status_code=422, detail="Enter a first name using letters only.")
    if payload.referral_code not in REFERRAL_CODES:
        raise HTTPException(status_code=422, detail="Choose a valid campus referral code.")

    registration = {
        "id": str(uuid4()),
        "first_name": first_name,
        "referral_code": payload.referral_code,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    with DATA_LOCK:
        registrations = load_registrations()
        registrations.append(registration)
        save_registrations(registrations)
    return {"message": "Simulation registration recorded.", "registration": registration}