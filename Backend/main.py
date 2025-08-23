from fastapi import FastAPI, HTTPException, Depends
from schemas import ScrapeRequest, UserResponse, UserCreate, UserLogin, HistoryResponse, HistoryCreate
from fastapi.middleware.cors import CORSMiddleware
from scraper import extract_data
import requests
import time
from sqlalchemy.orm import Session
from database import get_db
from models import User, ScrapeHistory
from database import engine
from models import Base
from passlib.context import CryptContext
from typing import Optional, List
from fastapi.security import OAuth2PasswordBearer

import jwt
import os
from dotenv import load_dotenv
from datetime import datetime,timedelta

load_dotenv()
JWT_SECRET=os.getenv("JWT_SECRET")
JWT_ALGORITHM="HS256"


oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/login")

pwd_context=CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI()
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password:str)->str:
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str)->bool:
    return pwd_context.verify(plain_password,hashed_password)

def create_access_token(data:dict, expires_delta: Optional[timedelta]=None):
    to_encode=data.copy();
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

@app.post("/scrape")
def scrape(data: ScrapeRequest):
    try:
        start_time=time.time()
        result = extract_data(data.url, data.selectors)
        end_time=time.time()
        duration_ms = round((end_time - start_time) * 1000)
        if not result:
            raise HTTPException(status_code=204, detail="No content extracted with the provided selectors.")
        return {"output": result,"duration":duration_ms}
    except requests.exceptions.MissingSchema:
        raise HTTPException(status_code=400, detail="Invalid URL format.")
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=404, detail="URL is unreachable.")
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
    
    
@app.post("/signup",response_model=UserResponse)
def signup(user:UserCreate,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.email==user.email).first()
    if(existing_user):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw=hash_password(user.password)
    
    new_user=User(email=user.email,hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Fetch user from DB
    existing_user = db.query(User).filter(User.email == user.email).first()
    
    if existing_user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, str(existing_user.hashed_password)):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token=create_access_token(data={"user_id":existing_user.id})

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
        "access_token":access_token,
        "token_type":"Bearer"
    }
    
# Helper function to get the user id from the token of the request

def get_current_user(token: str=Depends(oauth2_scheme),db:Session=Depends(get_db))->str:
    try:
        payload=jwt.decode(token,JWT_SECRET,algorithms=[JWT_ALGORITHM])
        user_id=payload.get("user_id")
        
        if user_id is None:
            raise HTTPException(status_code=401,detail="Invalid Authentication credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401,detail="Invalid Authentication credentials")

@app.post("/history",response_model=HistoryResponse)
def save_history(history:HistoryCreate,db:Session=Depends(get_db),user_id:str=Depends(get_current_user)):
    new_history=ScrapeHistory(
        user_id=user_id,
        url=history.url,
        selectors=history.selectors,
        duration=history.duration   
    )
    
    db.add(new_history)
    db.commit()
    db.refresh(new_history)
    return new_history

@app.get("/history",response_model=List[HistoryResponse])
def fetch_history(db:Session=Depends(get_db),user_id:str=Depends(get_current_user)):
    histories=db.query(ScrapeHistory).filter(ScrapeHistory.user_id==user_id).all()
    return histories

@app.delete("/history/{history_id}")
def delete_history(history_id:str,db:Session=Depends(get_db),user_id:str=Depends(get_current_user)):
    history=db.query(ScrapeHistory).filter(ScrapeHistory.id==history_id,ScrapeHistory.user_id==user_id).first()
    if not history:
        raise HTTPException(status_code=404,detail="History Not found")
    db.delete(history)
    db.commit()
    return {"detail":"History Deleted SuccessFully"}

@app.delete("/history")
def delete_allhistory(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    deleted_count = db.query(ScrapeHistory).filter(ScrapeHistory.user_id == user_id).delete()
    db.commit()

    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="No history Found")
    
    return {"detail": "History deleted successfully"}

    

