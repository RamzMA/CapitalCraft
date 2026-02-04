import type { PostCountResponse } from "../types/Post";

const API_BASE_URL = "https://capitalcraft.onrender.com";

export async function fetchPostCount(): Promise<PostCountResponse> {
    const res = await fetch(`${API_BASE_URL}/posts/count`);

    if(!res.ok){
        throw new Error("Failed to fetch post count");
    }

    return res.json();
}