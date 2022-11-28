import uvicorn
import json
from typing import List, Union, Dict
from fastapi import FastAPI, HTTPException, status, Query, UploadFile, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from schemas import *
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from models import Base
from models import User
from database import SessionLocal, engine
from typing import Optional
from sqlalchemy.orm import Session
import uuid

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Just Bobcats")


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

@app.get("/voter/get_setup", tags=["Contest Setup"])
def get_setup():
    with open("data/contest.json") as data:
        d = json.load(data)
  
    return d

@app.post("/guardian/setup_election", tags=["Contest Setup"])
def setup_election(manifest : UploadFile):
    file_location = "data/contest.json"
    print(file_location)
    with open(file_location, "wb") as file:
        file.write(manifest.file.read())
        
    return {"info" : "file sucessfully saved"}

@app.get("/tally/election", tags=["Results"])
def get_election_tally():
    return db

@app.get("/tally/contest/{contest}", tags=["Results"])
def get_tally(contest : str, candidate : Optional[str] = None):
    requested_contest = db.get(contest)
    if not requested_contest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contest not found")
    if candidate:
        requested_candidate = requested_contest.get(candidate)
        if requested_candidate:
            return {candidate : requested_candidate}
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found in specified contest")
        
    return requested_contest
    


@app.post("/voter/login", tags=["Authentication"])
def receive_login(login_info : LoginInfo, database: Session = Depends(get_db)):

    username = login_info.username
    address = login_info.address

    new_user = User(
        id = "holder", #This value is not used for query
        first = username.first,
        middle = username.middle,
        last = username.last,
        suffix = username.suffix,

        country_code = address.country_code,
        country_area = address.country_area,
        city = address.city,
        postal_code = address.postal_code,
        street_address = address.street_address
    )

    results : List[User] = database.query(User).filter(User.first == username.first).filter(User.last == username.last).all()

    for result in results:
        if new_user.fullname == result.fullname and new_user.address == result.address:
            return login_info.dict()
        
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User is not registered to vote.")


@app.post("/voter/register", tags=["Authentication"])
def register(login_info : LoginInfo, database: Session = Depends(get_db)):
    username = login_info.username
    address = login_info.address

    new_user = User(
        id = str(uuid.uuid4()),
        first = username.first,
        middle = username.middle,
        last = username.last,
        suffix = username.suffix,

        country_code = address.country_code,
        country_area = address.country_area,
        city = address.city,
        postal_code = address.postal_code,
        street_address = address.street_address
    )

    results : List[User] = database.query(User).filter(User.first == username.first).filter(User.last == username.last).all()

    for result in results:
        if new_user.fullname == result.fullname and new_user.address == result.address:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User Already Exists. Did you mean to login?")
            
    database.add(new_user)
    database.commit()
    database.refresh(new_user)
    return login_info.dict()
    


# Sample for test - https://github.com/microsoft/electionguard/blob/main/data/1.0.0-preview-1/sample/hamilton-general/election_private_data/plaintext_ballots/plaintext_ballot_5a150c74-a2cb-47f6-b575-165ba8a4ce53.json

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8006, reload=True, log_level="debug")