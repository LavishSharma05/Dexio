from pydantic import BaseModel,EmailStr
from typing import List
from datetime import datetime

class ScrapeRequest(BaseModel):
    url:str
    selectors:list[str]
    

class UserResponse(BaseModel):
    id:str
    email:EmailStr
    
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email:EmailStr
    password:str
    
class UserLogin(BaseModel):
    email:EmailStr
    password:str
    
class HistoryResponse(BaseModel):
    id:str
    user_id:str
    url:str
    selectors:List[str]
    duration:str
    timestamp:datetime    
    
    class Config:
        orm_mode=True
        
class HistoryCreate(BaseModel):
    url:str
    selectors:List[str]
    duration:str