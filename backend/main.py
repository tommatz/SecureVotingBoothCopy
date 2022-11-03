import uvicorn
import json
from typing import List, Union, Dict
from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from schemas import Ballot
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from models import Base
from database import SessionLocal, engine


Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


db : Dict[str, Dict[str, int]] = {}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        
        
@app.post("/voter/send_vote")
def recieve_ballot(ballot : Ballot):
    for contest in ballot.contests:
        contest_type : str = contest.object_id
        db.setdefault(contest_type, {})
        
        for ballot_selection in contest.ballot_selections:
            candidate : str = ballot_selection.object_id
            db[contest_type].setdefault(candidate, 0)
            db[contest_type][candidate] += ballot_selection.vote
    print(db)
    return db

@app.get("/voter/get_setup")
def get_setup():
    with open("data/contest.json") as data:
        d = json.load(data)
  
    return d

@app.post("/voter/setup_contest")
def setup_contest():
    with open("data/contest.json") as data:
        d = json.load(data)
  
    return d

@app.get("/voter/get_tally")
def get_tally(contest : str, candidate : str):
    if contest not in db:
        raise HTTPException(status_code=404, detail="Contest not found")
    if candidate not in db[contest]:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db[contest][candidate]


# Sample for test - https://github.com/microsoft/electionguard/blob/main/data/1.0.0-preview-1/sample/hamilton-general/election_private_data/plaintext_ballots/plaintext_ballot_5a150c74-a2cb-47f6-b575-165ba8a4ce53.json

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8002, reload=True, log_level="debug")