from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint, DateTime
from datetime import datetime
from database import Base
from sqlalchemy.orm import relationship

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

