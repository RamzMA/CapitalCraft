import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


// UserIcon Component
const UserIcon: React.FC = () => {

    const navigate = useNavigate();
    const [authorName, setAuthorName] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const updateAuthorName = () => {
            setAuthorName(localStorage.getItem("author_name"));
        };
        updateAuthorName();
        window.addEventListener("storage", updateAuthorName);
        window.addEventListener("authorNameChanged", updateAuthorName);
        return () => {
            window.removeEventListener("storage", updateAuthorName);
            window.removeEventListener("authorNameChanged", updateAuthorName);
        };
    }, []);

    return (
        <>
            <div className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button
                    className="flex items-center justify-center ml-1 h-14 w-14 bg-linear-to-br from-red-600 to-red-800 rounded-full cursor-pointer hover:bg-red-700 transition hover:animate-spin"
                >
                    {authorName ? authorName.charAt(0).toUpperCase() : "U"}
                </button>


                <div
                    id="userPopUp"
                    className={`w-48 left--15 bg-gray-800 p-4 rounded shadow-lg absolute right-0 mt-2 z-10 transition-all duration-300 transform 
                        ${isOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none -translate-y-2'}`}
                    style={{ minWidth: '12rem', top: '3.5rem', height: 'auto' }}
                >
                    <p className="text-white mb-2">Logged in as:</p>
                    <p className="text-white font-bold">{authorName || "Unknown"}</p>


                    {/* Profile Button */}
                    <button
                        className="text-white rounded border w-full p-1 my-2 hover:bg-gray-700 transition block cursor-pointer"
                        onClick={() => {
                            navigate("/pages/Profile");
                        }}
                    >
                        Profile
                    </button>

                    <button
                        className="text-white rounded border w-full p-1 hover:bg-gray-700 transition block cursor-pointer"
                        onClick={() => {
                            navigate("/pages/MyPosts");
                        }}
                    >
                        My Posts
                    </button>

                    {/* Log Out Button */}
                    <button
                        className="text-white rounded block my-2 border w-full p-1 text-center bg-red-600 hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                            localStorage.removeItem("author_name");
                            localStorage.removeItem("author_token");
                            window.dispatchEvent(new Event("authorNameChanged"));
                            window.location.reload();
                            window.location.href = "/";
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserIcon;