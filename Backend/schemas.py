from pydantic import BaseModel
from sqlalchemy.sql.sqltypes import DateTime
from datetime import datetime

#Schemas for User creation and login
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

#Schemas for Post creation and output
class PostCreate(BaseModel):
    content: str

class PostOut(BaseModel):
    id: int
    content: str
    user_id: int

    #Easy conversion from ORM objects for sqlalchemy
    class Config:
       from_attributes =  True

#Schemas for comment creation
class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    content: str
    user_id: int
    post_id: int

    #Easy conversion from ORM objects for sqlalchemy
    class Config:
        from_attributes = True


#Schema for Post feed output with author email and timestamp
class PostFeedOut(BaseModel):
    id: int
    content: str
    author_email: str
    created_at: datetime

    class Config:
        from_attributes = True
        
