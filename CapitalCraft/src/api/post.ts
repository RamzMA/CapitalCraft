import type { PostCountResponse } from "../types/Post";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function fetchPostCount(): Promise<PostCountResponse> {
    const res = await fetch(`${API_BASE_URL}/posts/count`);

    if(!res.ok){
        throw new Error("Failed to fetch post count");
    }

    return res.json();
}