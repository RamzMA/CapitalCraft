import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserIconProps {
    profileImageUrl: string | null;
}

const UserIcon: React.FC<UserIconProps> = ({ profileImageUrl }) => {
    const navigate = useNavigate();
    const [authorName, setAuthorName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const updateAuthorName = () => {
            setAuthorName(localStorage.getItem("author_name"));
        };

        updateAuthorName();
        window.addEventListener("authorNameChanged", updateAuthorName);

        return () => {
            window.removeEventListener("authorNameChanged", updateAuthorName);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("authorNameChanged"));
        window.location.href = "/";
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center justify-center h-14 w-14 bg-linear-to-br from-red-600 to-red-800 rounded-full overflow-hidden">
                {profileImageUrl ? (
                    <img
                        src={profileImageUrl.startsWith('http') ? profileImageUrl : `http://127.0.0.1:8000${profileImageUrl}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                    />
                ) : (
                    <span className="text-xl font-bold text-white">
                        {authorName ? authorName[0].toUpperCase() : "U"}
                    </span>
                )}
            </button>

            <div
                className={`absolute right-0 mt-2 w-48 bg-gray-800 p-4 rounded shadow-lg z-10 transition-all duration-200
                ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
                <p className="text-white text-sm mb-1">Logged in as</p>
                <p className="text-white font-bold mb-3">
                    {authorName || "Unknown"}
                </p>

                <button
                    className="w-full border p-1 mb-2 hover:bg-gray-700"
                    onClick={() => navigate("/pages/Profile")}
                >
                    Profile
                </button>

                <button
                    className="w-full border p-1 mb-2 hover:bg-gray-700"
                    onClick={() => navigate("/pages/MyPosts")}
                >
                    My Posts
                </button>

                <button
                    className="w-full bg-red-600 p-1 hover:bg-red-700"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserIcon;
