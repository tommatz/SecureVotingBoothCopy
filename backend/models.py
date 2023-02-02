from mimetypes import suffix_map
from sqlalchemy import Column, ForeignKey, String, Integer, Identity
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from database import Base


class Contest(Base):
    __tablename__ = "candidates"
    type = Column(String, primary_key=True, index=True)
    ballot_selections = relationship("BallotSelection", back_populates="owner", cascade="all, delete, delete-orphan")

class BallotSelection(Base):
    __tablename__ = "ballot_selections"
    order = Column(Integer, primary_key=True)
    id = Column(Integer, index=True)
    name = Column(String, index=True)
    party=Column(String, index=True)
    votes = Column(Integer, default=0)
    image_uri = Column(String)
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
    
    @hybrid_property
    def fullname(self):
        return self.first + self.middle + self.last + self.suffix
    
    @hybrid_property
    def address(self):
        return self.country_code + self.country_area + self.city + self.postal_code + self.street_address

class ElectionInfo(Base):
    __tablename__ = "election_info"
    ceremony_name = Column(String, primary_key=True, index=True)