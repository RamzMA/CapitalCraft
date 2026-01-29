from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from database import engine, SessionLocal
from models import User, Post, Comment
import models
from sqlalchemy.orm import Session
from schemas import UserCreate, UserLogin, PostCreate, PostResponse, PublicPost, PostUpdate, PostCountResponse, CommentCreate, CommentResponse, CommentUpdate
from auth import hash_password, verify_password, create_access_token, get_current_user
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import DateTime
from datetime import datetime
from starlette import status
from dotenv import load_dotenv
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Serve uploaded files
from fastapi.staticfiles import StaticFiles
import os
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Image upload endpoint
@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    file_ext = os.path.splitext(file.filename)[1]
    if file_ext.lower() not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type.")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    # Ensure unique filename
    base, ext = os.path.splitext(file.filename)
    counter = 1
    while os.path.exists(file_path):
        file_path = os.path.join(UPLOAD_DIR, f"{base}_{counter}{ext}")
        counter += 1
    with open(file_path, "wb") as f:
        f.write(await file.read())
    url = f"/uploads/{os.path.basename(file_path)}"
    return {"url": url}

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
        "token_type": "bearer",
        "user_id": db_user.id
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
    public_posts = []
    for post in posts:
        author_name = "Unknown"
        if post.user and post.user.name:
            author_name = post.user.name
        public_posts.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "image_url": post.image_url,
            "created_at": post.created_at,
            "author_name": author_name,
            "user_id": post.user_id
        })
    return public_posts




#post creation endpoint
@app.post("/posts", response_model=PostResponse)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_post = Post(
        **post.dict(),
        user_id=current_user
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



##############################################################

#Get comments for a post
@app.get("/posts/comments", response_model=list[CommentResponse])
def get_comments(
    post_id: int,
    db: Session = Depends(get_db)
):
    comments = (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.desc())
        .all()
    )
    return comments

#Add comment to a post
@app.post("/posts/comments", response_model=CommentResponse)
def add_comment(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    

    if not db.query(Post).filter(Post.id == comment.post_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    new_comment = Comment(
        post_id=comment.post_id,
        content=comment.content,
        user_id=current_user.id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

#Delete comment endpoint
@app.delete("/posts/{post_id}/comments/{comment_id}")
def delete_comment(
    post_id: int,
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = (
        db.query(Comment)
        .filter(
            Comment.id == comment_id, 
            Comment.post_id == post_id
            )
        .one_or_none()
    )

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
            )
    
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
            )
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

#comment update endpoint
@app.put("/posts/{post_id}/comments/{comment_id}", response_model=CommentResponse)
def update_comment(
    post_id: int,
    comment_id: int,
    comment_update: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = (
        db.query(Comment)
        .filter(
            Comment.id == comment_id,
            Comment.post_id == post_id
        )
        .one_or_none()
    )

    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    if not comment_update.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No data provided"
        )
    
    update_data = comment_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(comment, field, value)

    db.commit()
    db.refresh(comment)
    return comment