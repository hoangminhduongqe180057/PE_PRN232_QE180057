import { useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PostForm() {
  const [form, setForm] = useState({ name: "", description: "", imageUrl: "" });
  const [imageMode, setImageMode] = useState("link"); // 'link' | 'file'
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // ✅ Preview khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      toast.error("Name & Description are required!");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);

    // Gửi link hoặc file tuỳ mode
    if (imageMode === "link" && form.imageUrl)
      data.append("imageUrl", form.imageUrl);
    if (imageMode === "file" && e.target.imageFile.files[0])
      data.append("imageFile", e.target.imageFile.files[0]);

    try {
      setIsSubmitting(true);
      await api.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create post!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">📝 Create Post</h2>

      {/* --- Name --- */}
      <input
        type="text"
        placeholder="Post Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        disabled={isSubmitting}
      />

      {/* --- Description --- */}
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full rounded mb-3"
        rows="4"
        disabled={isSubmitting}
      />

      {/* --- Radio chọn loại ảnh --- */}
      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-2">Image Source:</p>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="imageMode"
              value="link"
              checked={imageMode === "link"}
              onChange={() => {
                setImageMode("link");
                setPreview(form.imageUrl);
              }}
              disabled={isSubmitting}
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
                setForm({ ...form, imageUrl: "" });
              }}
              disabled={isSubmitting}
              className="accent-blue-600"
            />
            📁 Upload File
          </label>
        </div>
      </div>

      {/* --- Input ảnh --- */}
      {imageMode === "link" ? (
        <input
          type="text"
          placeholder="Paste image link..."
          value={form.imageUrl}
          onChange={(e) => {
            setForm({ ...form, imageUrl: e.target.value });
            setPreview(e.target.value);
          }}
          className="border p-2 w-full rounded mb-3"
          disabled={isSubmitting}
        />
      ) : (
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full rounded mb-3"
          disabled={isSubmitting}
        />
      )}

      {/* --- Preview ảnh --- */}
      <img
        src={preview || "https://placehold.co/600x400?text=No+Image+Available"}
        alt="Preview"
        className="w-full h-56 object-cover rounded mb-3 border"
      />

      {/* --- Submit --- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-4 py-2 rounded text-white transition ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}