from fastapi import FastAPI, Depends, HTTPException
from database import engine, SessionLocal
from models import User, Post
import models
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin, PostCreate, PostResponse, PublicPost, PostUpdate, PostCountResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import DateTime
from datetime import datetime
from starlette import status
from dotenv import load_dotenv
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Get all users in swagger for temp testing
@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

#register endpoint
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email
    }

#login endpoint
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Generate JWT token for authenticated user
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer"
        }

#delete user endpoint
@app.delete("/user/{email}")
def delete_user(email: str, db : Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()

    return {"message": "User deleted successfully"}

#protected route example
@app.get("/protected")
def protected(user_id: int = Depends(get_current_user)):
    return {"message": f"Hello user {user_id}"}




################################################################

#Get all posts endpoint
@app.get("/posts", response_model=list[PublicPost])
def get_posts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = (
         db.query(Post)
         .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return posts




#post creation endpoint
@app.post("/posts", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_post = Post(
        **post.dict(),
        user_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post
    


#edit post endpoint
@app.put("/posts/{post_id}", response_model=PublicPost)
def edit_post(
    post_id: int,
    post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .one_or_none()
    )

    if not existing_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
            )
    
    if existing_post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to edit this post"
            )
    
    update_data = post.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(existing_post, field, value)

    db.commit()
    db.refresh(existing_post)
    return existing_post



#Delete post endpoint
@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .one_or_none()
    )

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
            )
    
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
            )
    
    db.delete(post)
    db.commit()
    return {"message": "Post deleted successfully"}


#post count endpoint
@app.get("/posts/count", response_model=PostCountResponse)
def get_post_count(
    db: Session = Depends(get_db)
):
    count = db.query(Post).count()
    return {"post_count": count}