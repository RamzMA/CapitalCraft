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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950 to-black">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md">
          <p className="text-red-400 text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("/uploads")) {
      return "http://localhost:8000" + url;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white">
      {/* Header */}
      <div className="border-b border-red-900/50 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-red-500 rounded"></div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">Feed</h1>
            </div>
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-red-800/50 hover:scale-105"
              onClick={() => window.location.href = "/create-post"}
            >
              Create Post
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">Showing {posts.length} of {postCount} posts</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {posts.map((post, index) => (
            <article 
              key={index} 
              className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-xl overflow-hidden hover:border-red-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-900/20"
            >
              {post.image_url && (
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  <img
                    src={getImageUrl(post.image_url)}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-white hover:text-red-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  {post.content}
                </p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-red-900/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span className="text-sm font-bold">{post.author.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-400">By <span className="text-red-400 font-medium">{post.author}</span></span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-900/20 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-red-500/50 rounded-full"></div>
            </div>
            <p className="text-gray-400 text-lg">No posts yet. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
