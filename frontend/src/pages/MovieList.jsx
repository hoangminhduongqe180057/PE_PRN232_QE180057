import { useEffect, useState } from "react";
import { api } from "../api/api";
import MovieCard from "../components/MovieCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import MovieDetailModal from "../components/MovieDetailModal";
import toast from "react-hot-toast";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");      
  const [genre, setGenre] = useState("");        
  const [sort, setSort] = useState("title");     

  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchAllGenres = async () => {
    try {
      const res = await api.get("/movies");
      const list = res.data || [];

      // build genre list
      const genreList = [
        ...new Set(
          list
            .map((m) => m.genre?.trim())
            .filter((g) => g && g.length > 0)
        ),
      ];

      setAllGenres(genreList);
    } catch {
      toast.error("Failed to load genres");
    }
  };
  
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
    fetchAllGenres();
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [search, genre, sort]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        {/* Search + Sort */}
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="🔍 Search by title..."
            className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-72"
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* ⭐ Genre Filter – dùng allGenres */}
        <div className="flex items-center gap-2">
          <span className="text-gray-700 text-sm">Genre:</span>
          <select
            className="border border-gray-300 px-3 py-2 rounded-lg"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All</option>
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Movie List */}
      {loading ? (
        <LoadingSkeleton />
      ) : movies.length ? (
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
      ) : (
        <p className="text-center text-gray-500 mt-10">No movies found.</p>
      )}

      {/* Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}