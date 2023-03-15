import uvicorn
import json
from typing import List, Union, Dict
from fastapi import FastAPI, HTTPException, status, Query, UploadFile, Depends, File, Form
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from schemas import *
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from models import Base, BallotSelection, Contest
from models import User
from models import ElectionInfo   
from database import SessionLocal, engine
from typing import Optional
from sqlalchemy.orm import Session
import uuid
from electionguard.key_ceremony import CeremonyDetails
from manifest_schema import Manifest
from electionguard.logs import log_info
import copy
import pickle

from electionguard.ballot import PlaintextBallot, PlaintextBallotSelection, PlaintextBallotContest
from electionguard_process import encrypt_ballot, keyCeremony, cast_or_spoil, tally


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



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/voter/send_vote", tags=["Voting"])
def recieve_ballot(ballot : Ballot, login_info : LoginInfo, database : Session = Depends(get_db)):


    username = login_info.username
    address = login_info.address
    login_user = User( #need to create this for the hybrid properties
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
    found = results[0]

    for result in results:
        if login_user.fullname == result.fullname and login_user.address == result.address:
            found = result

    print(found.voted)

    if found.voted == False:
        if ballot.spoiled == False:
            found.voted = True #mark that the user has voted
            database.commit()

        ballot_contests = []
        for contest in ballot.contests:
            ballot_selections = []

            for selection in contest.ballot_selections:
                candidate = database.query(BallotSelection).filter(BallotSelection.owner_type == contest.type).filter(BallotSelection.id == selection.id).one()
                ballot_selections.append(PlaintextBallotSelection(object_id=candidate.name, vote=int(selection.vote), is_placeholder_selection=False, write_in=False))
            
            ballot_contests.append(PlaintextBallotContest(object_id=contest.type, ballot_selections=ballot_selections))
        
        eg_ballot = PlaintextBallot(object_id=uuid.uuid4(), style_id="harrison-township-ballot-style", contests=ballot_contests)


        BALLOT_STORE = "data/electioninfo/ballots"

        with open(f"{BALLOT_STORE}/plaintext_ballots/ballot{eg_ballot.object_id}_plaintext.p", 'wb') as f:
            f.write(pickle.dumps(eg_ballot))
            log_info("Created a PlaintextBallot")


        encrypted_ballot = encrypt_ballot("data/electioninfo/metadata.p", "data/electioninfo/context.p", f"{BALLOT_STORE}/plaintext_ballots/ballot{eg_ballot.object_id}_plaintext.p")

        with open(f"{BALLOT_STORE}/encrypted_ballots/ballot{eg_ballot.object_id}_encrypt.p", 'wb') as f:
            f.write(pickle.dumps(encrypted_ballot))
            log_info("Ballot successfully encrypted and pickled")

        cast_or_spoil("data/electioninfo/metadata.p", "data/electioninfo/context.p", encrypted_ballot, ballot.spoiled)


        for contest in ballot.contests:
           for selection in contest.ballot_selections:
                candidate = database.query(BallotSelection).filter(BallotSelection.owner_type == contest.type).filter(BallotSelection.id == selection.id).one()
                candidate.votes = candidate.votes + int(selection.vote)
        database.commit()
        return {"info" : "Ballot Succesfully Recieved"}

    return {"info" : "Failed. Attempt at double voting"}
    







@app.get("/voter/get_setup", response_model=DBContests, tags=["Contest Setup"])
def get_setup(database : Session = Depends(get_db)):
    return DBContests(contests=database.query(Contest).all())



@app.post("/guardian/setup_election", tags=["Contest Setup"])
def setup_election(manifest : UploadFile = File(...), database : Session = Depends(get_db)):

    with open(f"data/{manifest.filename}", "wb") as wf:
        wf.write(manifest.file.read())
        log_info(f"wrote manifest file into data/{manifest.filename}")   

    # Couldnt get it work without using the written manifest
    # assuming the problem is caused by the byte offset being changed when it is read in
    with open(f"data/{manifest.filename}", "rb") as file:
        manifest : Manifest = Manifest(**json.load(file))
     
    contests = manifest.contests

    for contest in contests:
        ballot_selections = []
        db_contest = Contest(type=contest.object_id)

        for selection in contest.ballot_selections:
            candidate_id = selection.candidate_id
            party : Optional[str] = ""
            image_uri : Optional[str] = ""
            
            for partyl in manifest.candidates:
                if partyl.object_id == candidate_id:
                    party = partyl.party_id
                    image_uri = partyl.image_uri

            ballot_selections.append(BallotSelection(id=selection.sequence_order, name=selection.object_id, party=party, image_uri=image_uri))

        db_contest.ballot_selections.extend(ballot_selections)
        database.add(db_contest)
    database.commit()


    keyCeremony()
        

    return {"info" : "file sucessfully saved"}



@app.get("/tally/election", response_model=DBTallyContests, tags=["Results"])
def get_election_tally(database : Session = Depends(get_db)):
    return DBTallyContests(contests=database.query(Contest).all())

@app.get("/clear/election", tags=["Delete"])
def flush_election(database : Session = Depends(get_db)):
    for contest in database.query(Contest).all():
        database.delete(contest)
    database.commit()
    
@app.get("/clear/user", tags=["Delete"])
def flush_users(database : Session = Depends(get_db)):
    database.query(User).delete()
    database.commit()    
    
    
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
    


@app.post("/voter/login", response_model=LoginInfo, tags=["Authentication"])
def receive_login(login_info : LoginInfo, database: Session = Depends(get_db)):

    username = login_info.username
    address = login_info.address

    login_user = User(
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
        if login_user.fullname == result.fullname and login_user.address == result.address:
            return login_info
        
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User is not registered to vote.")


@app.post("/voter/register", response_model=LoginInfo, response_model_exclude={"id"}, tags=["Authentication"])
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
    
    return login_info

@app.get("/guardian/get_all_ceremonys", tags=["Contest Setup"])
def get_all_ceremonys(database : Session = Depends(get_db)):
    return database.query(ElectionInfo).all()


@app.get("/guardian/get_ceremony_info", tags=["Contest Setup"])
def get_ceremony_info(name : str, database : Session = Depends(get_db)):
    ceremony_info = database.query(ElectionInfo).get(name)
    return ceremony_info


@app.get("/verifer/get_verifier_id", tags=["Verification"])
def get_verifier_id():
    id = uuid.uuid4()
    return id


@app.post("/guardian/set_key_ceremony", tags=["Contest Setup"])
def set_key_ceremony(key_ceremony_info : KeyCeremonyInfo, database: Session = Depends(get_db)):
    ceremony = ElectionInfo(name=key_ceremony_info.name, guardians=key_ceremony_info.guardians, quorum=key_ceremony_info.quorum)
    database.add(ceremony)
    database.commit()

    with open("data/ceremony_info.p", "wb") as file:
        file.write(pickle.dumps({"no_guardians" : key_ceremony_info.guardians, "no_quorum" : key_ceremony_info.quorum}))
    
@app.post("/guardian/tally_decrypt", tags=["Tally Decrypt"])
def tally_decrypt():
    plaintext_tally =  tally("data/electioninfo/metadata.p", "data/electioninfo/context.p")

    tally_dict = {}


    for contest_key, contest in plaintext_tally.contests.items():
        tally_dict[contest_key] = []
        for selection_key, selection in contest.selections.items():
           tally_dict[contest_key].append({selection_key : selection.tally})
    return tally_dict


# Sample for test - https://github.com/microsoft/electionguard/blob/main/data/1.0.0-preview-1/sample/hamilton-general/election_private_data/plaintext_ballots/plaintext_ballot_5a150c74-a2cb-47f6-b575-165ba8a4ce53.json

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8006, reload=True, log_level="debug")