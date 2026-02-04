import UserIcon from "../Components/UserIcon";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function Profile() {
    const navigate = useNavigate();
    const [userDescription, setUserDescription] = useState<string>("");
    const [userLikes, setUserLikes] = useState<number>(0);
    const [userPosts, setUserPosts] = useState<number>(0);
    const [userComments, setUserComments] = useState<number>(0);
    const [memberSince, setMemberSince] = useState<string>("N/A");


    return (
    <>
         {/*Overall Div */}
        <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
             {/* Profile overall Div */}
             <div className="w-full flex justify-between h-1/5 items-center p-4 border-b border-gray-700 mb-15">
                <div>
                    <button
                        className="text-white hover:bg-gray-700 transition block cursor-pointer"
                        onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>

                {/* Profile Div */}
                <div className="p-4 m-0 rounded-lg">
                    <h1 className="text-3xl font-bold ">Profile</h1>
                </div>

                {/* User Icon */}
                <div>
                    <UserIcon />
                </div>
             </div>


             {/* Profile Content */}
             <div className="w-4/5 flex flex-row justify-between items-center p-9 border mx-auto rounded-lg ">
             <div className="flex flex-col items-start w-full">
                  <h2 className="block text-2xl mr-auto font-semibold mb-4">User Information</h2>

                    {/* Placeholder for user information */}
                    <div
                        className="flex flex-col items-start w-4/5 mr-auto bg-gray-800 p-4 rounded-lg">
                            {/* Username Display */}
                        <p className="mr-1">
                            <span
                                className="font-bold text-md"
                                >Username:</span> {localStorage.getItem("author_name") || "Unknown"}
                        </p>

                        {/* Email Display */}
                        <p className="mr-1">
                            <span
                                className="font-bold text-md"
                                >Email:</span> {localStorage.getItem("author_email") || "Unknown"}
                        </p>

                        {/* Password Display */}
                        <p className="mr-1">
                            <span className="font-bold text-md">
                                Password:</span> ********
                        </p>

                        {/* User ID Display */}
                        <p className="mr-1">
                            <span
                                className="font-bold text-md"
                                >User ID:</span> {localStorage.getItem("user_id") || "Unknown"}
                        </p>

                    
                        {/*Change Details */}
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 hover:bg-blue-300 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                                onClick={() => navigate("/pages/ChangeDetails")}
                            >
                                Change Details
                            </button>
                        </div>
                    </div>
                </div>

                {/*Profile Image */}
                <div className="flex flex-col justify-center items-center gap-2">
                    <h2 className="text-2xl font-semibold mt-6 mb-4">Profile Image</h2>
                    <div className="w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                        {/* Placeholder for profile image */}
                        <span className="text-gray-500">No Image</span>
                    </div>
                    <button>
                        {/* Change Image Button */}
                        <span className="mt-4 text-blue-500 hover:text-blue-300 cursor-pointer">
                            Change Image
                        </span>
                    </button>
                </div>
        
            </div>



            {/*user stats section */}
            <div className="border mx-auto w-4/5 my-0 rounded-lg p-4 mt-8 mb">
                <div className="flex flex-col items-center w-full">
                    <div className="flex justify-between w-full mx-7 items-center mb-4">
                        <h2 className="text-2xl my-auto font-semibold">User Description</h2>
                        <button>
                            {/* Edit Description Button */}
                            <span
                                className="text-blue-500 hover:text-blue-300 cursor-pointer"
                                onClick={() => navigate("/pages/EditDescription")}
                            >
                                Edit Description
                            </span>
                        </button>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg w-full mx-7">
                        {/* Placeholder for user description */}
                        {userDescription ? (
                            <p>{userDescription}</p>
                        ) : (
                            <p className="text-gray-400">No description currently.</p>
                        )}
                    </div>
                </div>
            </div>



            {/*user stats section */}
            <div className="border mx-auto w-4/5 my-0 rounded-lg p-4 mt-8 mb-4">
                <div>  
                    <h2 className="text-2xl font-semibold mb-4">User Statistics</h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        {/* Placeholder for user statistics */}
                        <p className="mb-2">Total Posts: {userPosts}</p>
                        <p className="mb-2">Total Likes: {userLikes}</p>
                        <p className="mb-2">Total Comments: {userComments}</p>
                        <p className="mb-2">Member Since: {memberSince}</p>
                    </div>
                </div>
            </div>


             {/*Delete user section */}
            <div className="border mx-auto w-4/5 my-0 rounded-lg p-4 mt-8 mb-10">
                <div className="flex flex-col items-center w-full mx-auto">  
                    <h2 className="text-2xl font-semibold mb-4">User Delete</h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        {/* Placeholder for user delete */}
                        <p className="mb-4">Delete your account and all associated data. This action is irreversible.</p>
                        <div className="flex justify-center">
                              <button
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                            onClick={() => navigate("/pages/DeleteAccount")}
                            >
                            Delete Account
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            

            <Footer />
            
        </div>
    </>
    )
}
