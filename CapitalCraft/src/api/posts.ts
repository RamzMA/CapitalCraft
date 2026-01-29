import type { PublicPost } from '../types/PublicPost';

const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchPost(
    skip: number = 0,
    limit: number = 10
): Promise<PublicPost[]> {
    const res = await fetch(
        `${API_BASE_URL}/posts?skip=${skip}&limit=${limit}`
    );

    if(!res.ok){
        throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    // Map author_name to author for compatibility with PublicPost type
    return data.map((post: any) => ({
        ...post,
        author: post.author_name ?? post.author ?? "Unknown"
    }));

};


//Create a new post
export async function createPost(
    title: string,
    content: string,
    image_url?: string
): Promise<PublicPost> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            title,
            content,
            image_url,
        }),
    });

    if(!res.ok){
        throw new Error("Failed to create post");
    }

    return res.json();
}


// delete a post by ID
export async function deletePost(postId: number): Promise<void> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if(!res.ok){
        throw new Error("Failed to delete post");
    }
}

//edit post by ID
export async function editPost(
    postId: number,
    title: string,
    content: string,
    image_url?: string
): Promise<PublicPost> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            title,
            content,
            image_url,
        }),
    });

    if(!res.ok){
        throw new Error("Failed to edit post");
    }

    return res.json();
}


// Fetch a single post by ID
export async function fetchPostById(postId: number): Promise<PublicPost> {
    const res = await fetch(`${API_BASE_URL}/posts?skip=0&limit=100`); // fetch all, filter client-side (or add a backend endpoint for single post)
    if (!res.ok) {
        throw new Error("Failed to fetch posts");
    }
    const data = await res.json();
    const post = data.find((p: any) => p.id === postId);
    if (!post) throw new Error("Post not found");
    return {
        ...post,
        author: post.author_name ?? post.author ?? "Unknown"
    };
}


