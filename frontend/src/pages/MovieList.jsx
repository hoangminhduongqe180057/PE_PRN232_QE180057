import { useEffect, useState } from "react";
import { api } from "../api/api";
import MovieCard from "../components/MovieCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieDetailModal from "../components/MovieDetailModal";
import toast from "react-hot-toast";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");        // search by title
  const [genre, setGenre] = useState("");          // filter genre
  const [sort, setSort] = useState("title");       // title | rating

  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/movies?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(
          genre
        )}&sort=${sort}`
      );
      setMovies(res.data || []);
    } catch {
      toast.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, genre, sort]);

  // Lấy list genre đơn giản từ data
  const uniqueGenres = [
    ...new Set(movies.map((m) => m.genre).filter((g) => g && g.trim() !== "")),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Search + Sort */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by title..."
            className="border border-gray-300 bg-white text-gray-800 px-4 py-2 rounded-lg w-full md:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Filter Genre */}
        <div className="flex items-center gap-2">
          <span className="text-gray-700 text-sm">Genre:</span>
          <select
            className="border border-gray-300 bg-white text-gray-800 px-3 py-2 rounded-lg"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All</option>
            {uniqueGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingSkeleton />
      ) : movies.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movies.map((m) => (
              <MovieCard
                key={m.id}
                movie={m}
                onClick={() => setSelectedMovie(m)}
                onDelete={fetchMovies}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">No movies found.</p>
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}