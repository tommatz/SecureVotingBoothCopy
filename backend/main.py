import uvicorn
import json
from typing import List, Union, Dict
from fastapi import FastAPI, HTTPException, status, Query, UploadFile, File, Form, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from schemas import *
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from models import Base, BallotSelection, Contest 
from database import SessionLocal, engine
from typing import Optional
from sqlalchemy.orm import Session



Base.metadata.create_all(bind=engine)

app = FastAPI(title="Just Bobcats", debug=True)


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
        
@app.post("/voter/send_vote", tags=["Voting"])
def recieve_ballot(ballot : Ballot, database : Session = Depends(get_db)):

    for contest in ballot.contests:
        for selection in contest.ballot_selections:
            candidate = database.query(BallotSelection).filter(BallotSelection.owner_type == contest.type).filter(BallotSelection.id == selection.id).one()
            candidate.votes = candidate.votes + int(selection.vote)
    database.commit()
    
    return {"info" : "Ballot Succesfully Recieved"}

@app.get("/voter/get_setup", response_model=DBContests, tags=["Contest Setup"])
def get_setup(database : Session = Depends(get_db)):
    return DBContests(contests=database.query(Contest).all())



@app.post("/guardian/setup_election", tags=["Contest Setup"])
def setup_election(manifest : UploadFile = File(...), database : Session = Depends(get_db)):
    
    
    manifest = json.load(manifest.file)
    
    contests = manifest["contests"]
    
    for contest in contests:
        ballot_selections = []
        db_contest = Contest(type=contest["type"])
        
        for selections in contest["ballot_selections"]:
            ballot_selections.append(BallotSelection(id=selections["id"], name=selections["name"], party=selections["party"], image_uri=selections["image_uri"]))
        database.add_all(ballot_selections)
        db_contest.ballot_selections.extend(ballot_selections)
        database.add(db_contest)
        database.commit()
        database.refresh(db_contest)
        ballot_selections = []
            
        
        
    return {"info" : "file sucessfully saved"}

@app.get("/tally/election", response_model=DBTallyContests, tags=["Results"])
def get_election_tally(database : Session = Depends(get_db)):
    return DBTallyContests(contests=database.query(Contest).all())

@app.get("/tally/contest/{contest}", response_model=Union[DBTally, DBTallySelection], tags=["Results"])
def get_tally(contest : str, candidate : Optional[str] = None, database : Session = Depends(get_db)):
    requested_contest = database.query(Contest).get(contest)
    if not requested_contest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contest not found")
    if candidate:
        requested_candidate = database.query(BallotSelection).filter(BallotSelection.owner_type == requested_contest.type).filter(BallotSelection.name == candidate).one()
        if requested_contest:
            return requested_candidate
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found in specified contest")
    return requested_contest
    



@app.post("/voter/login", tags=["Authentication"])
def receive_login(login_info : LoginInfo):
    return login_info.dict()


# Sample for test - https://github.com/microsoft/electionguard/blob/main/data/1.0.0-preview-1/sample/hamilton-general/election_private_data/plaintext_ballots/plaintext_ballot_5a150c74-a2cb-47f6-b575-165ba8a4ce53.json

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8006, reload=True, log_level="debug")