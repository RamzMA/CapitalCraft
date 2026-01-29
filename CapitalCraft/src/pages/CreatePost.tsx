
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { createPost } from "../api/posts"

export function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()



  const handleImageChange = (file: File) => {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let uploadedImageUrl = imageUrl
    if (imageFile) {
      // Upload image to backend
      const formData = new FormData()
      formData.append("file", imageFile)
    const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setError("Image upload failed")
        return
      }
      const data = await res.json()
      uploadedImageUrl = data.url
    }
    try {
      await createPost(title, content, uploadedImageUrl || undefined)
      navigate("/feed")
    } catch (err: any) {
      setError(err.message)
    }
  }


  return (
   <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-black via-red-900 to-red-500 text-white">
     <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
       <h2 className="text-2xl mb-6 text-center font-bold">Create New Post</h2>
       {error && <p className="text-red-500 mb-4">{error}</p>}
       <form
         onSubmit={handleSubmit}
       >
         <div className="mb-4">
           <label className="block mb-2">Title</label>
           <input
             type="text"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             className="w-full p-2 rounded bg-gray-700 border border-gray-600"
             required
           />
         </div>
         <div className="mb-4">
           <label className="block mb-2">Content</label>
           <textarea
             value={content}
             onChange={(e) => setContent(e.target.value)}
             className="w-full p-2 rounded bg-gray-700 border border-gray-600"
             rows={5}
             required
           ></textarea>
         </div>
         <div className="mb-4">
           <label className="block mb-2">Image (optional)</label>
           <div
             onDrop={handleDrop}
             onDragOver={handleDragOver}
             className="w-full p-4 border-2 border-dashed border-gray-600 rounded bg-gray-700 text-center cursor-pointer"
             onClick={() => fileInputRef.current?.click()}
           >
             {imagePreview ? (
               <img src={imagePreview} alt="Preview" className="mx-auto max-h-40" />
             ) : (
               <span>Drag & drop or click to select an image</span>
             )}
             <input
               type="file"
               accept="image/*"
               ref={fileInputRef}
               style={{ display: "none" }}
               onChange={handleFileInput}
             />
           </div>
         </div>
         <button
           type="submit"
           className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
         >
           Create Post
         </button>
       </form>
     </div>
   </div>
  )
}
