from typing import List, Union
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn


app = FastAPI()


class BallotSelection(BaseModel):
    object_id: str
    sequence_order: int
    vote: int
    is_placeholder_selection: bool
    extended_extended_data : Union[str, None]

class Contest(BaseModel):
    object_id: str
    sequence_order: int
    ballot_selections: List[BallotSelection]

class Ballot(BaseModel):
    object_id : str
    style_id: str
    contests : List[Contest]


@app.post("/voter/send_vote")
def recieve_ballot(ballot : Ballot):
    candidates = {}

    for contests in ballot.contests:
        for ballot_selection in contests.ballot_selections:
            candidate = ballot_selection.object_id
            if candidate in candidates:
                candidates[ballot_selection.object_id] += ballot_selection.vote
            else:
                candidates[ballot_selection.object_id] = ballot_selection.vote
    
    print(candidates)
    return "Recieved selection"


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8002, log_level="info")