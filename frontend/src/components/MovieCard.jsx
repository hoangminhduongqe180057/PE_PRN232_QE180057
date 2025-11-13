import { Trash2, Edit3, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function MovieCard({ movie, onDelete, onClick }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const renderRating = () => {
    if (!movie.rating) return <span className="text-gray-400 text-sm">No rating</span>;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={i < movie.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({movie.rating}/5)</span>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={onClick}
        className="cursor-pointer bg-white shadow-md hover:shadow-xl transition-all rounded-xl overflow-hidden border border-gray-100"
      >
        {/* Poster */}
        {movie.posterUrl ? (
          <div className="relative w-full h-64 overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 italic">
            No Poster
          </div>
        )}

        <div className="p-5">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
            {movie.title}
          </h3>

          <p className="text-sm text-gray-500 mb-2">
            Genre:{" "}
            <span className="font-medium">
              {movie.genre || "Unknown"}
            </span>
          </p>

          {renderRating()}

          {/* Action buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${movie.id}`);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Edit3 size={16} /> Edit
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        show={showConfirm}
        movieId={movie.id}
        movieTitle={movie.title}
        onClose={() => setShowConfirm(false)}
        onDeleted={onDelete}
      />
    </>
  );
}