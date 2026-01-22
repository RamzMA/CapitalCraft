from fastapi import FastAPI, Depends, HTTPException
from database import engine, SessionLocal
import models
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin, PostCreate, PostOut, CommentCreate, CommentOut
from auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi.middleware.cors import CORSMiddleware
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
    users = db.query(models.User).all()
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
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

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
    db_user = db.query(models.User).filter(models.User.email == email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()

    return {"message": "User deleted successfully"}

#protected route example
@app.get("/protected")
def protected(user_id: int = Depends(get_current_user)):
    return {"message": f"Hello user {user_id}"}

#Create a post
@app.post("/posts", response_model=PostOut)
def create_post(
    post: PostCreate,
    user_id : int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_post = models.Post(
        content=post.content,
        user_id=user_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

#Get all posts
@app.get("/posts", response_model=list[PostOut])
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    return posts

#Create a comment
@app.post("/posts/{post_id}/comments", response_model=CommentOut)
def create_comment(
    post_id: int,
    comment: CommentCreate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_comment = models.Comment(
        content=comment.content,
        user_id=user_id,
        post_id=post_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

#Like a post
@app.post("/posts/{post_id}/like")
def like_post(
    post_id: int,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_like = db.query(models.Like).filter(
        models.Like.user_id == user_id,
        models.Like.post_id == post_id
    ).first()

    if existing_like:
        raise HTTPException(status_code=400, detail="Post already liked")

    new_like = models.Like(
        user_id=user_id,
        post_id=post_id
    )
    db.add(new_like)
    db.commit()
    return {"message": "Post liked successfully"}


#Get post metadata: comments and likes count
@app.get("/posts/{post_id}/meta")
def get_post_meta(
    post_id: int,
    db: Session = Depends(get_db)
):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = db.query(models.Comment).filter(models.Comment.post_id == post_id).all()
    likes_count = db.query(models.Like).filter(models.Like.post_id == post_id).count()

    return {
        "post_id": post_id,
        "comments": comments,
        "likes_count": likes_count
    }