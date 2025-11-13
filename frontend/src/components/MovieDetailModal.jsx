import { X, Edit3, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieDetailModal({ movie, onClose }) {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderRating = () => {
    if (!movie.rating) return "No rating";
    return `${movie.rating}/5`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {movie.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        {/* Poster */}
        {movie.posterUrl && (
          <div className="w-full h-[450px] bg-black">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5 space-y-2">
          <p className="text-gray-700">
            <span className="font-semibold">Genre:</span>{" "}
            {movie.genre || "Unknown"}
          </p>
          <p className="text-gray-700 flex items-center gap-1">
            <span className="font-semibold">Rating:</span>
            {movie.rating ? (
              <>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < movie.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">
                  ({renderRating()})
                </span>
              </>
            ) : (
              "No rating"
            )}
          </p>
          <p className="text-sm text-gray-500">
            🕒 Added at:{" "}
            <span className="font-medium">{formatDate(movie.createdAt)}</span>
          </p>

          <button
            onClick={() => navigate(`/edit/${movie.id}`)}
            className="mt-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Edit3 size={18} /> Edit This Movie
          </button>
        </div>
      </div>
    </div>
  );
}