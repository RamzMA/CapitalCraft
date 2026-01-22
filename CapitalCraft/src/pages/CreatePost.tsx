import { useState, useEffect } from "react"
import { MessageCircle, Heart, Trash2, Send } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
  likes: number
  avatar: string
}

export function CreatePost() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const navigate = useNavigate();

//fetch comments on load
  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://127.0.0.1:8000/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      const mapped = data.map((post: any) => ({
        id: post.id,
        author: post.author_email,
        content: post.content,
        timestamp: new Date(post.created_at).toLocaleString(),
        likes: 0,
        avatar: post.author_email
          .split("@")[0]
          .slice(0, 2)
          .toUpperCase(),
      }))

      setComments(mapped)
    } catch (err) {
      console.error("Failed to load comments", err)
    }
  }

  // Add comment
  const handleAddComment = async () => {
  if (!newComment.trim()) return

  const token = localStorage.getItem("token")

  const res = await fetch("http://127.0.0.1:8000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content: newComment,
    }),
  })

  if (!res.ok) {
    console.error("Failed to create post")
    return
  }

  setNewComment("")
  fetchComments() // reload from backend
}


  // Delete comment
  const handleDeleteComment = async (id: number) => {
  const token = localStorage.getItem("token")

  await fetch(`http://127.0.0.1:8000/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  navigate("/feed", { replace: true })
}


  // Like comment
  const handleLikeComment = (id: number) => {
    setLikedComments((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              likes: likedComments.has(id) ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-900 to-black border-b-4 border-red-600">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            className="flex items-center gap-2 text-red-400 hover:text-red-300 mb-4 font-semibold transition-colors border border-red-600 px-4 py-2 rounded-lg hover:bg-red-950 cursor-pointer"
            onClick={() => navigate("/feed")}
          >
            ← Go Back to Feed
          </button>
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="size-8 text-red-500" />
            <h1 className="text-4xl font-bold">Comments</h1>
          </div>
          <p className="text-red-200 ml-11">Join the conversation</p>
        </div>
      </div>

      {/* ADD COMMENT */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8 border-2 border-red-600 rounded-lg p-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-black border border-gray-700 p-3 rounded"
          />
          <button
            onClick={handleAddComment}
            className="mt-3 bg-red-600 px-4 py-2 rounded cursor-pointer"
          >
            <Send className="inline mr-2" /> Post Comment
          </button>
        </div>

        {/* COMMENTS LIST */}
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          All Comments ({comments.length})
        </h2>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-700 p-6 rounded">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{comment.author}</p>
                  <p className="text-sm text-gray-400">
                    {comment.timestamp}
                  </p>
                </div>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  <Trash2 />
                </button>
              </div>

              <p className="my-4">{comment.content}</p>

              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center gap-2"
              >
                <Heart
                  className={
                    likedComments.has(comment.id) ? "fill-red-500" : ""
                  }
                />
                {comment.likes}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
