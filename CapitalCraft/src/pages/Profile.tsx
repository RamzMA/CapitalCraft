import UserIcon from "../Components/UserIcon";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    return (
    <>
         {/*Overall Div */}
        <div className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
             {/* Profile overall Div */}
             <div className="w-full flex justify-between h-1/5 items-center p-4 mx-5">
                <div>
                    <button
                        className="text-white hover:bg-gray-700 transition block cursor-pointer"
                        onClick={() => navigate(-1)}>
                        Go Back
                    </button>
                </div>

                {/* Profile Div */}
                <div className="border p-4 m-0 rounded-lg">
                    <h1 className="text-3xl font-bold ">Profile</h1>
                </div>

                {/* User Icon */}
                <div>
                    <UserIcon />
                </div>
             </div>


             {/* Profile Content */}
             <div className="w-4/5 flex flex-row justify-between items-center p-9 border mx-auto rounded-lg">
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
            
        </div>
    </>
    )
}
