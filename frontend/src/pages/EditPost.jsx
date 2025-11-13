import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import toast from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [imageMode, setImageMode] = useState("link"); // 'link' hoặc 'file'
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setForm({
          name: res.data.name,
          description: res.data.description,
          imageUrl: res.data.imageUrl || "",
        });
        setPreview(res.data.imageUrl);
      } catch {
        toast.error("Failed to load post details");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // ✅ Preview file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description) {
      toast.error("Name and Description are required");
      return;
    }

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);

    if (imageMode === "link" && form.imageUrl)
      data.append("imageUrl", form.imageUrl);
    if (imageMode === "file" && e.target.imageFile.files[0])
      data.append("imageFile", e.target.imageFile.files[0]);

    try {
      setIsSubmitting(true);
      await api.put(`/posts/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post updated successfully!");
      navigate("/");
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-8">Loading post...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-lg max-w-2xl mx-auto mt-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-primary">✏️ Edit Post</h2>

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
              }}
              disabled={isSubmitting}
              className="accent-blue-600"
            />
            📁 Upload File
          </label>
        </div>
      </div>

      {/* --- Image input --- */}
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

      {/* --- Preview --- */}
      <img
        src={preview || "https://placehold.co/600x400?text=No+Image+Available"}
        alt="Preview"
        className="w-full h-56 object-cover rounded mb-3 border"
      />

      {/* --- Buttons --- */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`px-4 py-2 rounded transition ${
            isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}