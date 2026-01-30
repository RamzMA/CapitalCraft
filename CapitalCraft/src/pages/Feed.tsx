import { useEffect, useState } from "react"
import { fetchPostCount } from "../api/post"
import { fetchPost, deletePost, addComment } from "../api/posts";
import type { PublicPost } from "../types/PublicPost";
import type { Comment } from "../types/Comment";
import { fetchComments } from "../api/comment";

export default function Feed() {
    // Track which posts have expanded comments
    const [expandedComments, setExpandedComments] = useState<{ [postId: number]: boolean }>({});
  // State variables for post count, loading, error, and posts
  const [postCount, setPostCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const rawUserId = localStorage.getItem("user_id");
  const currentUserId = rawUserId ? parseInt(rawUserId, 10) : null;

  // Fetch post count on component mount
  useEffect(() => {
    Promise.all([
      fetchPostCount(),
      fetchPost(0, 10),  // Fetch first 10 posts
    ])
      .then(async ([countData, postsData]) => {
        setPostCount(countData.post_count);
        setPosts(postsData);
        // Fetch comments for each post
        const commentsObj: { [postId: number]: Comment[] } = {};
        await Promise.all(postsData.map(async (post: PublicPost) => {
          try {
            const postComments = await fetchComments(post.id);
            commentsObj[post.id] = postComments;
          } catch {
            commentsObj[post.id] = [];
          }
        }));
        setComments(commentsObj);
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-red-950 to-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-red-950 to-black">
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


// Handle post delete
  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
      setPostCount(postCount - 1);
    } catch (err: any) {
      alert("Failed to delete post: " + err.message);
    }
  }

    const handleComment = async (postId: number) => {
    const commentInput = document.getElementById(`comment-input-${postId}`) as HTMLTextAreaElement;
    const content = commentInput.value.trim();
    const commentError = document.getElementById(`comment-error-${postId}`);
    if(!content){
      commentError!.textContent = "No comment entered.";
      return;
    } else{
      commentError!.textContent = "";
    }
    try {
      await addComment(postId, content);
      commentInput.value = "";
      // Refresh comments for this post
      const postComments = await fetchComments(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    } catch(err: any){
      commentError!.textContent = "Failed to add comment: " + err.message;
    }
    }
  

  
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-red-950 to-black text-white">
      {/* Header */}
      <div className="border-b border-red-900/50 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-500 rounded"></div>
              <h1 className="text-3xl font-bold bg-white bg-clip-text text-transparent">Feed</h1>
            </div>
            <button 
              className="px-6 py-2.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-red-800/50 hover:scale-105"
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
              className="bg-linear-to-br from-gray-900 to-black border border-red-900/30 rounded-xl overflow-hidden hover:border-red-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-900/20"
            >
              {post.image_url ? (
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  <img
                    src={getImageUrl(post.image_url)}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                </div>
              ) : null}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3 text-white">
                  {post.title}
                </h2>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  {post.content}
                </p>
                
                <div className="flex items-center gap-2 pt-4 border-t border-red-900/30">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span className="text-sm font-bold">{post.author_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-400">By <span className="text-red-400 font-medium">{post.author_name}</span></span>



                <div className="ml-auto p-1">
                     {post.user_id === currentUserId && (
                    <button
                      className="mr-2 focus:outline-none "
                       onClick={() => window.location.href = `/edit-post/${post.id}`}
                    >
                      <span className="text-sm text-white cursor-pointer p-3 bg-black rounded-lg">Edit Post</span>
                    </button>
                  )}
              
                  {post.user_id === currentUserId && (
                    <button
                      className="focus:outline-none"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <span className="text-sm text-white cursor-pointer p-3 bg-red-500 rounded-lg">Delete Post</span>
                    </button>
                  )}
                </div>
                
                </div>
                
                <div className="flex items-center mt-5 gap-2 pt-4 border-t border-red-900/30">
                <span
                  className="focus:outline-none"
                  >
                  Comments
                </span>

                {/* Comment Input Section */}
                </div>
                <div className="mt-4">
                <p id={`comment-error-${post.id}`} className="text-red-500 text-md italic my-4"></p>
                  <div className="flex justify-between items-center">
                     <textarea
                      placeholder="Write a comment"
                      className="w-4/5 h-12 p-3 bg-black/50 border border-red-900/50 rounded-l text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                      id={`comment-input-${post.id}`}
                    ></textarea>
                    <button 
                    className="w-1/5 h-12 flex items-center justify-center p-0"
                    onClick={() => handleComment(post.id)}
                    >
                      <span className="text-sm text-white cursor-pointer w-full h-full flex items-center justify-center bg-red-500 rounded-r">Submit Comment</span>
                    </button>
                  </div>
                  {/* Comments List */}
                  <div className="mt-4" id={`comments-list-${post.id}`}>
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      <>
                        <ul className="space-y-2">
                          {(expandedComments[post.id]
                            ? comments[post.id]
                            : comments[post.id].slice(0, 3)
                          ).map((comment) => (
                            <li key={comment.id} className="bg-black/30 border border-red-900/30 rounded p-2 text-gray-200">
                              <span className="font-semibold text-red-400">{comment.author_name}:</span> {comment.content}
                            </li>
                          ))}
                        </ul>
                        {comments[post.id].length > 3 && (
                          <button
                            className="mt-2 text-white hover:underline text-sm"
                            onClick={() => setExpandedComments(prev => ({
                              ...prev,
                              [post.id]: !prev[post.id]
                            }))}
                          >
                            {expandedComments[post.id] ? 'Show less' : `Show more (${comments[post.id].length - 3} more)`}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* no posts message */}
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
