import Login from "./pages/Login";
import Feed from "./pages/Feed";
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
      </Routes>
    </BrowserRouter>
  );
}
