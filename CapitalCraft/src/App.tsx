import Login from "./pages/Login";
import Feed from "./pages/Feed";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import MyPost from "./pages/MyPost";
import Description from "./pages/Description";
import ChangeDetails from "./pages/ChangeDetails";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CreatePost } from "./pages/CreatePost";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
        <Route path="/pages/Profile" element={<Profile />} />
        <Route path="/pages/MyPosts" element={<MyPost />} />
        <Route path="/pages/ChangeDetails" element={<ChangeDetails />} />
        <Route path="/pages/Description" element={<Description />} />
      </Routes>
    </BrowserRouter>
  );
}
