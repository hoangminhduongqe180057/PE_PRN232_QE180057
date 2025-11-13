import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import PostList from "./pages/PostList";
import PostForm from "./pages/PostForm";
import EditPost from "./pages/EditPost";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}