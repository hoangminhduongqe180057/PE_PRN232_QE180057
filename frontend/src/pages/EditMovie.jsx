import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import toast from "react-hot-toast";

export default function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    posterUrl: "",
  });

  const [imageMode, setImageMode] = useState("link");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await api.get(`/movies/${id}`);
        const m = res.data;
        setForm({
          title: m.title,
          genre: m.genre || "",
          rating: m.rating || "",
          posterUrl: m.posterUrl || "",
        });
        setPreview(m.posterUrl);
      } catch {
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      toast.error("Title is required");
      return;
    }

    if (form.rating && (form.rating < 1 || form.rating > 5)) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("genre", form.genre);
    data.append("rating", form.rating);

    if (imageMode === "link" && form.posterUrl)
      data.append("posterUrl", form.posterUrl);

    if (imageMode === "file" && e.target.posterFile.files[0])
      data.append("posterFile", e.target.posterFile.files[0]);

    try {
      setIsSubmitting(true);
      await api.put(`/movies/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Movie updated successfully!");
      navigate("/");
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-8">Loading movie...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">✏️ Edit Movie</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Movie title *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        disabled={isSubmitting}
      />

      {/* Genre */}
      <input
        type="text"
        placeholder="Genre (optional)"
        value={form.genre}
        onChange={(e) => setForm({ ...form, genre: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        disabled={isSubmitting}
      />

      {/* Rating */}
      <input
        type="number"
        min="1"
        max="5"
        placeholder="Rating (1–5)"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        disabled={isSubmitting}
      />

      {/* Poster */}
      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-2">Poster Source:</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="imageMode"
              value="link"
              checked={imageMode === "link"}
              onChange={() => {
                setImageMode("link");
                setPreview(form.posterUrl);
              }}
              className="accent-blue-600"
            />
            🔗 Link
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="imageMode"
              value="file"
              checked={imageMode === "file"}
              onChange={() => {
                setImageMode("file");
                setPreview("");
              }}
              className="accent-blue-600"
            />
            📁 Upload File
          </label>
        </div>
      </div>

      {imageMode === "link" ? (
        <input
          type="text"
          placeholder="Paste poster link..."
          value={form.posterUrl}
          onChange={(e) => {
            setForm({ ...form, posterUrl: e.target.value });
            setPreview(e.target.value);
          }}
          className="border p-2 w-full rounded mb-3"
          disabled={isSubmitting}
        />
      ) : (
        <input
          type="file"
          name="posterFile"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded mb-3"
          disabled={isSubmitting}
        />
      )}

      <img
        src={preview || "https://placehold.co/300x450?text=No+Poster"}
        alt="Preview"
        className="w-full h-72 object-cover rounded mb-3 border"
      />

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}