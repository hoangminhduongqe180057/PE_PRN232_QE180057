import { X, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PostDetailModal({ post, onClose }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {post.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* ✅ Hình ảnh chiếm full modal */}
        {post.imageUrl && (
          <div className="w-full h-[450px] bg-black">
            <img
              src={post.imageUrl}
              alt={post.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            {post.description || "No description provided."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            🕒 Created at:{" "}
            <span className="font-medium">{formatDate(post.createdAt)}</span>
          </p>

          {/* ✅ Nút Edit trong modal */}
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Edit3 size={18} /> Edit This Post
          </button>
        </div>
      </div>
    </div>
  );
}