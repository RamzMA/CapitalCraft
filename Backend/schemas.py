from pydantic import BaseModel

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
        orm_mode = True

#Schemas for comment creation
class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    content: str
    user_id: int
    post_id: int

    #Easy conversion from ORM objects for sqlalchemy as post creation
    class Config:
        orm_mode = True