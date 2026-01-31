import type { Comment } from '../types/Comment';

const API_BASE_URL = "https://capitalcraft.onrender.com";

// Function to create a new comment on a post
export async function createComment(
    postId: number,
    content: string
): Promise<Comment> {
    const res = await fetch(`${API_BASE_URL}/posts/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            post_id: postId,
            content: content,
        }),
    });

    if(!res.ok){
        throw new Error("Failed to create comment");
    }

    return res.json();
}

// Function to fetch comments for a specific post
export async function fetchComments(
    postId: number,
    skip: number = 0,
    limit: number = 5
): Promise<Comment[]> {
    const res = await fetch(
        `${API_BASE_URL}/posts/${postId}/comments?skip=${skip}&limit=${limit}`
    );

    if(!res.ok){
        throw new Error("Failed to fetch comments");
    }

    return res.json();
}   


// Function to delete a comment by its ID
export async function deleteComment(
    postId: number,
    commentId: number
): Promise<void> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
    });

    if(!res.ok){
        throw new Error("Failed to delete comment");
    }
}


//handle comment update
export async function updateComment(
    postId: number,
    commentId: number,
    content: string
): Promise<Comment> {
    const token = localStorage.getItem("token");

    // MY ACCESS TOKEN DOESNT WANT TO BE SENT HERE???
    //Nvm typo myb 

    if (token) {
        console.log("Sending Authorization header (PUT):", `Bearer ${token}`);
    } else {
        console.log("No access token found in localStorage for PUT");
    }
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
    });

    if(!res.ok){
        throw new Error("Failed to update comment");
    }

    return res.json();
}