import { useEffect, useState } from "react"
import { TrendingUp, Clock, User, Plus, UserCircle, LogOut as LogOutIcon } from "lucide-react"


type Post = {
  id: number
  content: string
  author_email: string
  created_at: string
  likes: number
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        const res = await fetch("http://127.0.0.1:8000/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data: Post[] = await res.json()
        setPosts(data)
      } catch (err) {
        setError("Could not load feed")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Loading feed...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    )
  }

  function toggleProfileMenu() {
    setProfileMenuOpen(!profileMenuOpen)
  }


  
  return (
    <div className="min-h-screen bg-black">
      {/* Header with gradient backdrop */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/50">
                  <span className="text-white font-black text-xl">CC</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
                  CapitalCraft
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Feed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Create Post Button */}
              <button
                onClick={() => window.location.href = "/create-post"}
                className="group px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="font-semibold">Create Post</span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:scale-110"
                >
                  U
                </button>

                {profileMenuOpen && (
                  <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileMenuOpen(false)}
                    ></div>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-zinc-900 to-black border border-red-900/30 rounded-xl shadow-xl shadow-red-500/10 z-50 overflow-hidden">
                      <button 
                        className="w-full text-left px-4 py-3 hover:bg-red-900/20 text-gray-300 hover:text-white transition-colors flex items-center gap-2 border-b border-red-900/20"
                      >
                        <UserCircle className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-red-900/20 text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2"
                        onClick={() => {
                          localStorage.removeItem("token");
                          window.location.href = "/login";
                        }}
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="mb-8 p-4 bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-900/30 rounded-xl">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Live Feed</span>
            </div>
            <div className="text-red-400 font-semibold">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-950/30 border-2 border-dashed border-red-900/50 flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-red-500/50" />
            </div>
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative bg-gradient-to-br from-zinc-900 to-black border border-red-900/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Decorative gradient accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 via-red-600 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Post Content */}
              <div className="relative">
                <p className="text-gray-100 text-lg leading-relaxed mb-6">
                  {post.content}
                </p>

                {/* Post Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-red-900/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-300">{post.author_email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <time>{new Date(post.created_at).toLocaleString()}</time>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}