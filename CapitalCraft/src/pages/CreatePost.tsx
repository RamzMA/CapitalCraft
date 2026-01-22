import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  //Create post
  const handleCreatePost = async (content: string) => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("Not authenticated")
      return
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error("Failed to create post")
      }

      const newPost = await res.json()
      console.log("Post created:", newPost)
    } catch (err) {
      setError("Could not create post")
    }
  }
    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-500"
          rows={5}
          placeholder="What's on your mind?"
        ></textarea>
       <button
            onClick={async () => {
                await handleCreatePost(content)
                navigate("/feed")
            }}
            className="w-full py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
            Post
        </button>

      </div>
    </div>
  );
}