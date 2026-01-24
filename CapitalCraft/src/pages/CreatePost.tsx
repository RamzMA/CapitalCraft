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
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Create Post/Comments Removed</h1>
        <p className="text-gray-400">This page is now disabled. Please use Login/Register.</p>
      </div>
    </div>
  )
}
