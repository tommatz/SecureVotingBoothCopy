from typing import List, Union
from pydantic import BaseModel, ValidationError, root_validator, validator
from i18naddress import InvalidAddress, normalize_address 
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


class Address(BaseModel):
    country_code : str = "US"
    country_area : str
    city : str
    postal_code : str
    street_address : str

class UserName(BaseModel):
    first : str
    middle : str
    last : str
    suffix : Union[str, None] = ""
    
 
class LoginInfo(BaseModel):
    username : UserName
    address : Address
    
    @validator("username")
    def check_username(cls, v : UserName):
        valid_spc_chars = ("'", "-", ",", ".")
        full_name = v.first + v.middle + v.last
        
        if v.suffix:
            full_name += v.suffix

        full_name = full_name.strip()

        if (not full_name.isalpha()) and (not any(char in valid_spc_chars for char in full_name)):
            raise ValueError("Malformed Name: Please confirm your first, last, middle, and suffix are correct.")
        
        return v
 
    @validator("address")
    def check_address(cls, v : Address):
        try:
            normalize_address(v.dict())
        except InvalidAddress as e:
            raise ValueError("Malformed Address: Please confirm your address is typed correctly and try again", e.errors)

        return v

class TallyRetrival(BaseModel):
    contests : Union[List[str], None] 
    candidates : Union[List[str], None]
    retrieve_all : bool = False