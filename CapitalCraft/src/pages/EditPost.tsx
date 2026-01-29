import { editPost, fetchPostById } from "../api/posts";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export function EditPost() {
    const { postId } = useParams<{ postId: string }>();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Fetch existing data
        const fetchPostData = async () => {
            try {
                const data = await fetchPostById(Number(postId));
                setTitle(data.title);
                setContent(data.content);
                setImageUrl(data.image_url || "");
                setImagePreview(data.image_url ? "http://localhost:8000" + data.image_url : "");
                setLoading(false);
            }
            catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchPostData();
    }, [postId]);

    const handleImageChange = (file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageChange(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let uploadedImageUrl = imageUrl;
        if (imageFile) {
            // Upload image to backend
            const formData = new FormData();
            formData.append("file", imageFile);
            const res = await fetch("http://localhost:8000/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                setError("Image upload failed");
                return;
            }
            const data = await res.json();
            uploadedImageUrl = data.url;
        }
        try {
            await editPost(Number(postId), title, content, uploadedImageUrl || undefined);
            navigate("/feed");
        } catch (err: any) {
            setError(err.message);
        }
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white">
            {/* Header */}
            <div className="border-b border-red-900/50 bg-black/40 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate("/feed")}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="w-2 h-8 bg-red-500 rounded"></div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent">
                            Edit Post
                        </h1>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-xl p-8 shadow-xl">
                    {error && (
                        <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                                placeholder="Enter post title..."
                                required
                            />
                        </div>

                        {/* Content Textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all resize-none h-40"
                                placeholder="Share your thoughts..."
                                required
                            ></textarea>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Image
                            </label>
                            <div
                                className="relative border-2 border-dashed border-red-900/50 rounded-lg p-8 text-center cursor-pointer hover:border-red-700/50 transition-all bg-black/30 hover:bg-black/50 group"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="max-w-full h-auto mx-auto rounded-lg max-h-96 object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <p className="text-white font-medium">Click or drag to change image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <svg 
                                            className="w-16 h-16 mx-auto mb-4 text-red-500/50 group-hover:text-red-500 transition-colors" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-gray-400 mb-2">Drag & drop an image here</p>
                                        <p className="text-sm text-gray-500">or click to select a file</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileInput}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-red-800/50 hover:scale-105 font-medium"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/feed")}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditPost;