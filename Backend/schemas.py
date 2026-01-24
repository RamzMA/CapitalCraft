#imports
from pydantic import BaseModel
from sqlalchemy.sql.sqltypes import DateTime
from datetime import datetime
from typing import List, Optional

#Schemas for user creation
class UserCreate(BaseModel):
    email: str
    password: str

#Schemas for user login
class UserLogin(BaseModel):
    email: str
    password: str

#Schema for post creation
class PostBase(BaseModel):
    title: str
    content: str
    author: str
    image_url: Optional[str] = None

#Schema for post create using inheritance from postbase
class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    

class PublicPost(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    author: str

    class Config:
        from_attributes = True

#schema for postresponse using inheritance from postbase and adding id and created_at
class PostResponse(PostBase):
    id: int
    created_at: datetime

    #orm mode to work with sqlalchemy models
    class Config:
        from_attributes = True