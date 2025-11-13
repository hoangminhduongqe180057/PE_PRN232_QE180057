import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import MovieList from "./pages/MovieList";
import MovieForm from "./pages/MovieForm";
import EditMovie from "./pages/EditMovie";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/create" element={<MovieForm />} />
          <Route path="/edit/:id" element={<EditMovie />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}