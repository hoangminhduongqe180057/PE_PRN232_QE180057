import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({
  show,
  onClose,
  movieId,
  movieTitle,
  onDeleted,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!show) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/movies/${movieId}`);
      toast.success(`"${movieTitle}" deleted successfully!`);
      onDeleted?.();
      onClose();
    } catch {
      toast.error("Failed to delete movie!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">"{movieTitle}"</span> from
          your list?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`px-4 py-2 rounded font-medium transition ${
              isDeleting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 rounded font-medium flex items-center gap-2 transition ${
              isDeleting
                ? "bg-red-400 cursor-not-allowed text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isDeleting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}