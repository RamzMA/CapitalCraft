from pydantic import BaseModel
from sqlalchemy.sql.sqltypes import DateTime
from datetime import datetime

#Schemas for user creation
class UserCreate(BaseModel):
    email: str
    password: str

#Schemas for user login
class UserLogin(BaseModel):
    email: str
    password: str

