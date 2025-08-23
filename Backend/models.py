from sqlalchemy import Column, String, Integer, DateTime, ForeignKey,JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime
import uuid

Base=declarative_base()

class User(Base):
    __tablename__="users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    histories = relationship("ScrapeHistory", back_populates="user", cascade="all, delete-orphan")
    
class ScrapeHistory(Base):
    __tablename__ = "scrape_histories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    url = Column(String, nullable=False)
    selectors = Column(JSON, nullable=False)
    duration = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="histories")
    