
from typing import List, Union
from pydantic import BaseModel
from enum import Enum


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

class Ballot(Contest):
    object_id : str
    style_id: str
    contests : List[Contest]