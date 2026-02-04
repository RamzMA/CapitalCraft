export interface Account {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface AccountStatus {
    id: number;
    created_at: string;
    postCount: number;
    commentCount: number;
}

export interface Description {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
}

export interface UserProfileImage {
    id: number;
    user_id: number;
    image_url: string;
    uploaded_at: string;
}