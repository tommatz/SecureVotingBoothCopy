
from typing import List, Union
from pydantic import BaseModel
from enum import Enum

class ElectionType(str, Enum):
    candidate = "candidate"
    yesno = "yesno"
class Candidate(BaseModel):
    id: str
    name: str
    partyId: int
    
class CandidateContest(BaseModel):
    id: str
    districtId: str
    type: ElectionType
    section: str
    title: str
    seats: str
    candidates: List[Candidate]
    allowWriteIns: bool
    
class OptionContest(BaseModel):
    id: str
    districtId: str
    type: str
    section: str
    title: str
    description: str

class Contests(BaseModel):
    contests: List[Union[CandidateContest, OptionContest]]
    
    
class BallotSelection(BaseModel):
    object_id: str
    sequence_order: int
    vote: int
    is_placeholder_selection: bool
    extended_data : Union[str, None]

class Contest(BaseModel):
    object_id: str
    sequence_order: int
    ballot_selections: List[BallotSelection]

class Ballot(BaseModel):
    object_id : str
    style_id: str
    contests : List[Contest]