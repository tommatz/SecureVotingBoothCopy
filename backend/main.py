from typing import List, Union
from fastapi import FastAPI
from pydantic import BaseModel
from schemas import Ballot
import uvicorn
import sqlalchemy

app = FastAPI()
db = {}

@app.post("/voter/send_vote")
def recieve_ballot(ballot : Ballot):
    print("test")
    for contest in ballot.contests:
        contest_type = contest.object_id
        db.setdefault(contest_type, {})
        
        for ballot_selection in contest.ballot_selections:
            candidate = ballot_selection.object_id
            db[contest_type].setdefault(candidate, 0)
            db[contest_type][candidate] += ballot_selection.vote
            
    return db


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8002, reload=True, log_level="info")