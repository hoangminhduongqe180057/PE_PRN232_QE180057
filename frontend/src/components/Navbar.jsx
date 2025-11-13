import { Link, useLocation } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path
      ? "text-white bg-blue-600 shadow-sm"
      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50";

  return (
    <nav className="backdrop-blur-md bg-white/90 shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          📝 <span>Post Manager</span>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active(
              "/"
            )}`}
          >
            <FileText size={18} />
            All Posts
          </Link>

          <Link
            to="/create"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active(
              "/create"
            )}`}
          >
            <PlusCircle size={18} />
            Create
          </Link>
        </div>
      </div>
    </nav>
  );
}