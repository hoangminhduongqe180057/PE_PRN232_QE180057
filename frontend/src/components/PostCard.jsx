import { Trash2, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function PostCard({ post, onDelete, onClick }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div
        onClick={onClick}
        className="cursor-pointer bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* ✅ Hình ảnh rõ nét */}
        {post.imageUrl ? (
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105 brightness-105"
              loading="lazy"
              style={{
                imageRendering: "auto",
                filter: "none",
              }}
            />
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 italic">
            No Image
          </div>
        )}

        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
            {post.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
            {post.description || "No description available."}
          </p>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${post.id}`);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Edit3 size={16} /> Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true); // ✅ mở popup confirm
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Popup confirm (sẽ xử lý delete + isDeleting bên trong) */}
      <DeleteConfirmModal
        show={showConfirm}
        postId={post.id}
        postName={post.name}
        onClose={() => setShowConfirm(false)}
        onDeleted={onDelete}
      />
    </>
  );
}