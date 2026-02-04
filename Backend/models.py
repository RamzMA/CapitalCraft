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
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    posts = relationship("Post", back_populates="user")
    comments = relationship("Comment", back_populates="user")

# Post model
class Post(Base):
    __tablename__ = "posts"

    id= Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    image_url = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="posts")
    comments = relationship(
        "Comment",
        back_populates="post",
        cascade="all, delete-orphan"
    )

# Comment model
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="comments")