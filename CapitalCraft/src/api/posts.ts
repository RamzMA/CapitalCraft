import type { PublicPost} from '../types/PublicPost';

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

    return res.json();

};