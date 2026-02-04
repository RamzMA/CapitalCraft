import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Footer from "../Components/Footer";
import { updateUserDescription, fetchUserDescription } from "../api/userUpdate";


export default function Description() {
    const userID = Number(localStorage.getItem("user_id") || "0");
    const [Description, setDescription] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const desc = await fetchUserDescription(userID);
                if (desc) {
                    setDescription(desc.content);
                }
            } catch (error) {
                console.error("Failed to fetch description:", error);
            }
        };
        fetchDescription();
    }, [userID]);
               

    return (
        <>
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div>
                <h1 className="text-3xl font-bold mb-6">Description Page</h1>
            </div>

            <form className="w-full max-w-2xl mb-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                    <h3>
                        Current Description:{<span className="ml-1">{Description}</span>}
                    </h3>
            </div>
            </form>


            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">Edit Description</h3>
                <form
                
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            await updateUserDescription(userID, Description);
                            alert('Description updated successfully!');
                        } catch (error) {
                            alert('Failed to update description.');
                        } finally {
                            navigate("/pages/Profile");
                        }
                    }}
                >
                    <textarea
                        className="w-full h-40 p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter your new description here..."
                        value={Description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
                    >
                        Save Description
                    </button>
                </form>
            </div>
        </div>
        <Footer />
        </>
    );
}