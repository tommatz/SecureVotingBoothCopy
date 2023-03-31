from typing import List, Union, Optional
from pydantic import BaseModel, ValidationError, root_validator, validator
from i18naddress import InvalidAddress, normalize_address 
from enum import Enum


class BallotSelection(BaseModel):
    id : int
    vote : bool = False

class Contest(BaseModel):
    type: str
    ballot_selections: List[BallotSelection]

class Ballot(BaseModel):
    contests : List[Contest]
    spoiled : bool = False
    

class DBBallotSelection(BaseModel):
    id : int
    name : str
    party : Optional[str]
    image_uri : Optional[str]
    
    class Config:
        orm_mode = True
    
class DBContest(BaseModel):
    type : str
    ballot_selections : List[DBBallotSelection]
    
    class Config:
        orm_mode = True 
class DBContests(BaseModel):
    contests : List[DBContest]
    
    class Config:
        orm_mode=True

class DBTallySelection(BaseModel):
    name : str
    party : str
    votes: int
    
    class Config:
        orm_mode = True
        
class DBTally(BaseModel):
    type : str
    ballot_selections : List[DBTallySelection]
    
    class Config:
        orm_mode = True 
                
class DBTallyContests(BaseModel):
    contests : List[DBTally]
    
    class Config:
        orm_mode = True
        
class Address(BaseModel):
    country_code : str = "US"
    country_area : str
    city : str
    postal_code : str
    street_address : str

    def __str__(self):
        return self.country_code + self.country_area + self.city + self.postal_code + self.street_address



class UserName(BaseModel):
    first : str
    middle : str
    last : str
    suffix : Optional[str] = ""

    def __str__(self):
        return self.first + self.middle + self.last + self.suffix
    
 
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
    contests : Optional[List[str]]
    candidates : Optional[List[str]]
    retrieve_all : bool = False

class KeyCeremonyInfo(BaseModel):
    name : str
    guardians : int
    quorum : int

    @validator("quorum")
    def check_guardians(cls, v : int, values : dict):
        quorum : int = v
        guardians = values["guardians"]
    
        if guardians < quorum:
            raise ValueError("Illegal Quorum/Guardian setup. Guardians must be greater or equal to the Quorum")

        
        return quorum

class VerifierInfo(BaseModel):
    linked_vote : str
    verify_code : str
    vote_time : str
    location : str
    spoiled : str = False