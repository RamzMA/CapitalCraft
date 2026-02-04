import type { Account, AccountStatus, Description, UserProfileImage} from '../types/Account';

const API_BASE_URL = "https://capitalcraft.onrender.com"

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

    //check status before parsing JSON
    if (!res.ok) {
        let errorMsg = `Failed to update user details (status ${res.status})`;
        try {
            const errorData = await res.json();
            if (errorData && errorData.detail) {
                errorMsg = errorData.detail;
            }
        } catch (e) {
            console.error("Failed to parse error response as JSON", e);
        }
        throw new Error(errorMsg);
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


// Fetch user status
export async function fetchUserStatus(
    userId: number
): Promise<AccountStatus> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/status`, {
        method: "GET",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if(!res.ok){
        throw new Error("Failed to fetch user status");
    }

    return res.json();
}


//User Description Update
export async function updateUserDescription(
    userId: number,
    content: string
): Promise<Description> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/description`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            content: content,
        }),
    });

    if(!res.ok){
        throw new Error("Failed to update user description");
    }

    return res.json();
}


// Fetch user description
export async function fetchUserDescription(
    userId: number
): Promise<Description> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/description`, {
        method: "GET",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if(!res.ok){
        throw new Error("Failed to fetch user description");
    }

    return res.json();
}

//get user profile image
export async function fetchUserProfileImage(
    userId: number
): Promise<UserProfileImage> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/profile-image`, {
        method: "GET",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    
    if(!res.ok){
        throw new Error("Failed to fetch user profile image");
    }
    
    return res.json();
}

// update user profile image
export async function updateUserProfileImage(
    userId: number,
    imageUrl: string
): Promise<UserProfileImage> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/user/${userId}/profile-image`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            profile_image: imageUrl,
        }),
    });

    if (!res.ok) {
    const errorText = await res.text();
    console.error("Profile image update error:", errorText);
    throw new Error(errorText);
    }

    localStorage.setItem("profile_image", imageUrl ?? "");
    return res.json();
}

