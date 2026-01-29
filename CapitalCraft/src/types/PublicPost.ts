export interface PublicPost {
    id: number;
    title: string;
    content: string;
    author_name: string;
    image_url?: string | null;
    user_id: number;
    created_at: string;
}
