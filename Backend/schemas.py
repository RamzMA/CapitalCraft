#imports
from pydantic import BaseModel
from sqlalchemy.sql.sqltypes import DateTime
from datetime import datetime
from typing import List, Optional

#Schemas for user creation
class UserCreate(BaseModel):
    author_name: str
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
    image_url: Optional[str] = None

#Schema for post create using inheritance from postbase
class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    


class PublicPost(BaseModel):
    id: int
    title: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime
    author_name: str
    user_id: int

    class Config:
        from_attributes = True

#schema for postresponse using inheritance from postbase and adding id and created_at
class PostResponse(PostBase):
    id: int
    title: str
    content: str
    image_url: Optional[str] = None
    created_at: datetime

    #orm mode to work with sqlalchemy models
    class Config:
        from_attributes = True

#Post count schema
class PostCountResponse(BaseModel):
    post_count: int

#schmema for comments
class CommentCreate(BaseModel):
    post_id: int
    content: str

#schema for comment response
class CommentResponse(BaseModel):
    id: int
    content: str
    created_at: datetime
    author_name: str
    user_id: int

    class Config:
        from_attributes = True

#schema for public comments
class PublicComment(BaseModel):
    id: int
    content: str
    created_at: datetime
    author_name: str
    user_id: int
    class Config:
        from_attributes = True

#scheme for update comment
class CommentUpdate(BaseModel):
    content: Optional[str] = None
