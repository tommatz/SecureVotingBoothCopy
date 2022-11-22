from mimetypes import suffix_map
from sqlalchemy import Column, ForeignKey, String, Integer
from sqlalchemy.orm import relationship
from database import Base


class Contest(Base):
    __tablename__ = "candidates"
    type = Column(String, primary_key=True, index=True)
    ballot_selections = relationship("BallotSelection", back_populates="owner")

class BallotSelection(Base):
    __tablename__ = "ballot_selections"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_type = Column(String, ForeignKey("candidates.type"))

    owner = relationship("Contest", back_populates="ballot_selections")
    

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    first = Column(String, index=True)
    middle = Column(String, index=True)
    last = Column(String, index=True)
    suffix = Column(String)

    country_code = Column(String, index=True)
    country_area = Column(String, index=True)
    city = Column(String, index=True)
    postal_code = Column(String, index=True)
    street_address = Column(String, index=True)