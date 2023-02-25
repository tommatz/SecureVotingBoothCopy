from enum import Enum
from typing import List, Optional
from pydantic import BaseModel




class ContactItem(BaseModel):
    annotation : str
    value : str

class ContactInformation(BaseModel):
    address_line : Optional[List[str]]
    email: Optional[List[ContactItem]]
    phone: Optional[List[ContactItem]]
    name : Optional[str]


class GeopoliticalUnit(BaseModel):
    object_id : str
    name : str
    type : str
    contact_information: Optional[ContactInformation]

class TextItem(BaseModel):
    value : Optional[str]
    language : Optional[str]

class Party(BaseModel):
    object_id: str
    ballot_name: Optional[List[TextItem]]
    abbreviation: Optional[str]
    color: Optional[str]
    logo_uri: Optional[str]

class Candidate(BaseModel):
    object_id : str 
    name : TextItem
    party_id: Optional[str]
    image_uri: Optional[str]
    is_write_in: Optional[bool]

class BallotSelection(BaseModel):
    object_id : str
    sequence_order : int
    candidate_id : str

class Contest(BaseModel):
    object_id : str
    sequence_order : int
    electoral_district_id : str
    vote_variation : str
    number_elected : int
    votes_allowed : int
    name : str
    ballot_selections : List[BallotSelection]
    ballot_title: Optional[List[TextItem]]
    ballot_subtitle: Optional[List[TextItem]]

class BallotStyle(BaseModel):
    object_id : str
    geopolitical_unit_ids : Optional[List[str]]
    party_ids : Optional[List[str]]
    image_uri : Optional[str]

class Manifest(BaseModel):
    election_scope_id : str
    spec_version : str
    type : str
    start_date : str
    end_date : str
    geopolitical_units: List[GeopoliticalUnit]
    parties: List[Party]
    candidates: List[Candidate]
    contests : List[Contest] 
    ballot_styles: Optional[List[BallotStyle]]
    name : ContactInformation

