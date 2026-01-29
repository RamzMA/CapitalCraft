import type { Comment } from '../types/Comment';

const API_BASE_URL = "http://127.0.0.1:8000";

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