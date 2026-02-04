import UserIcon from '../Components/UserIcon';
import Footer from '../Components/Footer';
import React, { useState } from 'react';
import { updateUserDetails } from '../api/userUpdate';
import { useNavigate } from 'react-router-dom';


    export default function ChangeDetails() {
        const [email, setEmail] = useState('');
        const [author_name, setAuthorName] = useState('');
        const [password, setPassword] = useState('');
        const [message, setMessage] = useState('');

        const currentEmail = localStorage.getItem("author_email") || "Unknown";
        const currentName = localStorage.getItem("author_name") || "Unknown";
        const currentUserId = localStorage.getItem("user_id") || "0";
        const userId = Number(currentUserId);
        const navigate = useNavigate();


        return (
            <>
            <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
                <div className="w-full flex justify-between h-1/5 items-center p-4 border-b border-gray-700 mb-1">
                    <div>
                        <button
                            className="text-white hover:bg-gray-700 transition block cursor-pointer"
                            onClick={() => window.history.back()}>
                            Go Back
                        </button>
                    </div>

                    <div className="p-4 m-0 rounded-lg">
                        <h1 className="text-3xl font-bold ">Change Details</h1>
                    </div>

                    <div>
                        <UserIcon />
                    </div>
                </div>

                <div className="flex flex-col items-center mt-10">
                    <h2 className="text-2xl font-semibold mb-6">Update Your Details</h2>
                    <form className="flex flex-col w-1/3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            await updateUserDetails(
                                userId,
                                author_name || undefined,
                                email || undefined,
                                password || undefined
                            );
                            setMessage('Details updated successfully!');
                        } catch (error) {
                            setMessage('Failed to update details.');
                        } finally{
                            navigate("/pages/Profile");
                        }
                    }}
                    >

                        <input
                            type="text"
                            placeholder={currentName}
                            value={author_name}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                        />
                        <input
                            type="email"
                            placeholder={currentEmail}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                        />
                        <input
                            type="password"
                            placeholder="*******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-6 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition mb-3 cursor-pointer"
                        >
                            Update Details
                        </button>
                    </form>
                    {message && <p className="mt-4 text-green-400">{message}</p>}
                </div>
            </div>
            <Footer />
            </>
        )
};