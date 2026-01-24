import { useEffect, useState } from "react"
import { fetchPostCount } from "../api/post"
import { fetchPost } from "../api/posts";
import type { PublicPost } from "../types/PublicPost";

export default function Feed() {
  // State variables for post count, loading, error, and posts
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);

      // Fetch post count on component mount
    useEffect(() => {
      Promise.all([
        fetchPostCount(),
        fetchPost(0, 10),  // Fetch first 10 posts
      ])
        .then(([countData, postsData]) => {
          setPostCount(countData.post_count);
          setPosts(postsData);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, []);
    
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-red-900 to-red-500 text-white">Loading...</div>;
    }

    if (error) {
      return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-red-900 to-red-500 text-white">Error: {error}</div>;
    }





  return (
    <div className="min-h-screen bg-linear-to-r from-black via-red-900 to-red-500 text-white">
      <div className="text-center py-10 px-4">
        <div className="mb-8 flex items-center justify-between p-8">
        <p className="text-gray-300">Showing: {posts.length} of {postCount}</p>
        <h1 className="text-3xl font-bold">Feed</h1>
         <button 
         className="mt-4 px-4 py-2 bg-black rounded hover:bg-gray-800 transition cursor-pointer"
         onClick={() => window.location.href = "/create-post"}
         >Create Post</button>
        </div>
        


      {/*Maps posts to feed page */}
      {posts.map((post, index) => (
        <div key={index} className="post">
          <h2>{post.title}</h2>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              style={{ maxWidth: "100%" }}
            />
          )}

              <p>{post.content}</p>
              <small>By {post.author}</small>
            </div>
          ))}
        </div>
      </div>
  )
}