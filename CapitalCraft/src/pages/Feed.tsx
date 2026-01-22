import { useEffect, useState } from "react"

type Post = {
  id: number
  content: string
  author_email: string
  created_at: string
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Loading feed...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        {error}
      </div>
    )
  }

  function toggleProfileMenu() {
    setProfileMenuOpen(!profileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="mx-auto space-y-6">

        <div className="flex justify-between items-center mb-6">

            <h1 className="text-3xl font-extrabold text-red-500">
              CC
            </h1>
              <h1 className="text-3xl font-extrabold text-red-500">
                CapitalCraft Feed
            </h1>

                <div className="flex justify-between">
                {/*Create Post*/}
                <button
                    onClick={() => alert("Create Post functionality not implemented yet.")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mr-4"
                >
                    Create Post
                </button>



                {/*profile icon*/}
                <div className="relative">
                <button
                    onClick={toggleProfileMenu}
                    className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold cursor-pointer"
                >
                    U
                </button>

                {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg">Profile</button>
                    <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                        onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                    </div>
                )}
                </div>
                </div>
            </div>


        {posts.length === 0 && (
          <p className="text-gray-400" >No posts yet.</p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4"
          >
            <p className="text-gray-200 mb-3">
              {post.content}
            </p>

            <div className="flex justify-between text-xs text-gray-400">
              <span>{post.author_email}</span>
              <span>{new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
