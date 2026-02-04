import Footer from "../Components/Footer";
import UserIcon from "../Components/UserIcon";
import {
  deleteUserAccount,
  fetchUserStatus,
  fetchUserDescription,
  updateUserProfileImage,
  fetchUserProfileImage,
} from "../api/userUpdate";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, ArrowLeft, Edit2, Trash2, Calendar, MessageSquare, Heart, FileText, X } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [userDescription, setUserDescription] = useState("");
  const [userLikes, setUserLikes] = useState(0);
  const [userPosts, setUserPosts] = useState(0);
  const [userComments, setUserComments] = useState(0);
  const [memberSince, setMemberSince] = useState("N/A");

  const userEmail = localStorage.getItem("author_email") || "";
  const userId = Number(localStorage.getItem("user_id") || "0");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  /* Image Upload Handler */
  const handleImageUpload = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("file", selectedImage);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.url) throw new Error("Upload failed");
      await updateUserProfileImage(userId, data.url);
      // Fetch the latest image from backend after upload
      const imgRes = await fetchUserProfileImage(userId);
      setProfileImage(imgRes.image_url || null);
      setShowImageModal(false);
      setSelectedImage(null);
    } catch (err) {
      alert("Failed to upload profile image");
      console.error(err);
    }
  };

  /* Fetch Data */
  useEffect(() => {
    const loadData = async () => {
      try {
        const status = await fetchUserStatus(userId);
        setUserPosts(status.postCount || 0);
        setUserComments(status.commentCount || 0);
        setUserLikes(0);
        setMemberSince(status.created_at || "N/A");

        const desc = await fetchUserDescription(userId);
        if (desc?.content) setUserDescription(desc.content);

        // Always fetch the latest profile image from backend
        const imgRes = await fetchUserProfileImage(userId);
        setProfileImage(imgRes.image_url || null);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    loadData();
  }, [userId]);

  /* Delete Account */
  const handleDeleteAccount = async () => {
    if (!userEmail) return;

    if (!window.confirm("Delete account permanently?")) return;

    try {
      await deleteUserAccount(userEmail);
      localStorage.clear();
      navigate("/login");
    } catch {
      alert("Failed to delete account");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Profile Header */}
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
            onClick={() => navigate("/feed")}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Feed</span>
          </button>

          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
            My Profile
          </h1>

          <div className="w-24">
            <UserIcon profileImageUrl={profileImage} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden mb-6">
          {/* Cover Background */}
          <div className="h-32 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          </div>

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 -mt-16">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-40 h-40 bg-linear-to-br from-gray-700 to-gray-800 rounded-full overflow-hidden flex items-center justify-center text-6xl font-bold select-none border-4 border-gray-900 shadow-xl ring-2 ring-gray-700">
                  {profileImage ? (
                    <img
                      src={profileImage.startsWith('http') ? profileImage : `http://127.0.0.1:8000${profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-gray-300">
                      {(localStorage.getItem("author_name") || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 mt-16 md:mt-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {localStorage.getItem("author_name") || "User"}
                    </h2>
                    <p className="text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Active now
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{userPosts}</div>
                        <div className="text-xs text-gray-400">Posts</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{userLikes}</div>
                        <div className="text-xs text-gray-400">Likes</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{userComments}</div>
                        <div className="text-xs text-gray-400">Comments</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white truncate">{formatDate(memberSince).split('/')[0]}/{formatDate(memberSince).split('/')[2]?.slice(-2) || 'N/A'}</div>
                        <div className="text-xs text-gray-400">Joined</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Account Details */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              Account Details
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Username</div>
                <div className="text-white font-medium">{localStorage.getItem("author_name")}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Email</div>
                <div className="text-white font-medium">{userEmail}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Password</div>
                <div className="text-white font-medium">••••••••</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">User ID</div>
                <div className="text-white font-medium">#{userId}</div>
              </div>

              <button
                className="mt-4 w-full py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-300 transition flex items-center justify-center gap-2 cursor-pointer"
                onClick={() => navigate("/pages/ChangeDetails")}
              >
                <Edit2 className="w-4 h-4" />
                <span>Change Details</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                Bio
              </h3>
              <button
                className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm"
                onClick={() => navigate("/pages/Description")}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 min-h-200px">
              {userDescription ? (
                <p className="text-gray-300 leading-relaxed">{userDescription}</p>
              ) : (
                <p className="text-gray-500 italic">No bio added yet. Tell us about yourself!</p>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-linear-to-br from-red-950/40 to-gray-900 rounded-2xl border border-red-900/50 shadow-xl p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-600/30 active:scale-95 flex items-center gap-2"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account Permanently
          </button>
        </div>
      </div>

      <Footer />

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 p-8 rounded-2xl w-full max-w-md relative border border-gray-700 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-full p-2"
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">Change Profile Picture</h3>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-red-500 bg-red-500/10" 
                  : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                setSelectedImage(e.dataTransfer.files[0]);
              }}
              onClick={() => inputRef.current?.click()}
            >
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {selectedImage ? (
                <div>
                  <p className="text-white font-medium mb-1">{selectedImage.name}</p>
                  <p className="text-gray-400 text-sm">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium mb-1">Drop image here</p>
                  <p className="text-gray-400 text-sm">or click to browse</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setSelectedImage(e.target.files?.[0] || null)
                }
              />
            </div>

            <button
              className={`w-full mt-6 py-3 rounded-lg font-medium transition-all ${
                selectedImage
                  ? "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleImageUpload}
              disabled={!selectedImage}
            >
              Upload Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
