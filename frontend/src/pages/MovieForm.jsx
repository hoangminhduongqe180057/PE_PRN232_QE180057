import { useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function MovieForm() {
  console.log("MovieForm mounted!");

  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    posterUrl: "",
  });

  const [imageMode, setImageMode] = useState("link");
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title) {
      toast.error("Title is required!");
      return;
    }

    if (form.rating && (form.rating < 1 || form.rating > 5)) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    if (form.genre) data.append("genre", form.genre);
    if (form.rating) data.append("rating", form.rating);

    if (imageMode === "link" && form.posterUrl)
      data.append("posterUrl", form.posterUrl);

    if (imageMode === "file" && e.target.posterFile.files[0])
      data.append("posterFile", e.target.posterFile.files[0]);

    try {
      setIsSubmitting(true);
      await api.post("/movies", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Movie added successfully!");
      navigate("/");
    } catch {
      toast.error("Failed to add movie!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">🎬 Add Movie</h2>

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
        placeholder="Rating 1–5 (optional)"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        disabled={isSubmitting}
      />

      {/* Poster type */}
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
                setForm({ ...form, posterUrl: "" });
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
        />
      ) : (
        <input
          type="file"
          name="posterFile"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded mb-3"
        />
      )}

      <img
        src={preview || "https://placehold.co/400x600?text=No+Poster"}
        alt="Preview"
        className="w-full h-64 object-cover rounded mb-3 border"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        {isSubmitting ? "Saving..." : "Save Movie"}
      </button>
    </form>
  );
}