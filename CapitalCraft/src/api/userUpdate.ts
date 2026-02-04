import type { Account } from '../types/Account';

const API_BASE_URL = "http://127.0.0.1:8000"

export async function updateUserDetails(
    userId: number,
    author_name?: string,
    email?: string,
    password?: string
): Promise<Account> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/change-details`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            author_name: author_name,
            email: email,
            password: password,
        }),
    });

    if(!res.ok){
        throw new Error("Failed to update user details");
    }

    return res.json();
}

// Delete user account
export async function deleteUserAccount(
    email: string
): Promise<void> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${email}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if(!res.ok){
        throw new Error("Failed to delete user account");
    }
}
