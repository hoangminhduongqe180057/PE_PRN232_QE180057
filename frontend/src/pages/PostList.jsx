import { useEffect, useState } from "react";
import { api } from "../api/api";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import PostDetailModal from "../components/PostDetailModal";
import toast from "react-hot-toast";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // ✅ người dùng chọn số bài mỗi trang
  const [total, setTotal] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/posts?search=${search}&sort=${sort}&page=${page}&pageSize=${pageSize}`
      );
      const data = res.data;
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, sort, page, pageSize]); // ✅ theo dõi cả pageSize

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-lg"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="asc">Sort A–Z</option>
            <option value="desc">Sort Z–A</option>
          </select>
        </div>

        {/* ✅ chọn số item mỗi trang */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700">Show:</label>
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPage(1);
            }}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={6}>6</option>
          </select>
          <span className="text-gray-600 text-sm">items/page</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton />
      ) : posts.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onClick={() => setSelectedPost(p)}
                onDelete={fetchPosts}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination total={total} page={page} setPage={setPage} pageSize={pageSize} />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No posts found.</p>
      )}

      {/* Modal */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}