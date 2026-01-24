from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint, DateTime, func
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

# Post model
class Post(Base):
    __tablename__ = "posts"

    id= Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    image_url = Column(String, nullable=True)
    author = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())