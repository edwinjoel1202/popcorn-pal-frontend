import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../components/css/Watchlist.css';
import Navbar from "./Navbar";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const fetchWatchlist = async () => {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        console.log("No token or user, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        // Fetch watchlist entries
        const watchlistResponse = await axios.get(
          "https://popcorn-pal.onrender.com/api/watchlist",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const watchlistData = watchlistResponse.data;

        // Fetch movie details for each watchlist entry
        const enrichedWatchlist = await Promise.all(
          watchlistData.map(async (entry) => {
            try {
              const movieResponse = await axios.get(
                `https://popcorn-pal.onrender.com/api/movies/details/${entry.tmdbMovieId}`
              );
              return {
                ...entry,
                title: movieResponse.data.title,
                posterPath: movieResponse.data.poster_path, // Match Movie.jsx naming
              };
            } catch (movieError) {
              console.error(
                `Error fetching details for movie ID ${entry.tmdbMovieId}:`,
                movieError
              );
              return {
                ...entry,
                title: "Unknown Title",
                posterPath: null, // Fallback if movie details fail
              };
            }
          })
        );

        console.log("Enriched watchlist data:", enrichedWatchlist);
        setWatchlist(enrichedWatchlist);
        setError(null);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        if (error.response && error.response.status === 401) {
          console.log("Token invalid or expired, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load watchlist. Please try again later.");
        }
      }
    };

    fetchWatchlist();
  }, [user, loading, navigate]);

  const handleDelete = async () => {
    if (!movieToDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://popcorn-pal.onrender.com/api/watchlist/${movieToDelete.watchlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWatchlist(
        watchlist.filter(
          (movie) => movie.watchlistId !== movieToDelete.watchlistId
        )
      );
      setShowDeleteModal(false);
      setMovieToDelete(null);
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        alert(
          "An error occurred while removing the movie from your watchlist."
        );
      }
    }
  };

  const confirmDelete = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMovieToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="container mt-5">
        <h1>Your Watchlist</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        {watchlist.length === 0 ? (
          <p>Your watchlist is empty. Add some movies from the home page!</p>
        ) : (
          <div className="row">
            {watchlist.map((movie) => (
              <div key={movie.watchlistId} className="col-md-4 mb-4">
                <div className="card movie-card">
                  <Link
                    to={`/movie/${movie.tmdbMovieId}`}
                    className="text-decoration-none"
                  >
                    <img
                      src={
                        movie.posterPath
                          ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                          : "https://via.placeholder.com/500x750?text=No+Poster"
                      }
                      className="card-img-top"
                      alt={movie.title || "No Title"}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {movie.title || "Untitled"}
                      </h5>
                      <p className="card-text">
                        Added on: {new Date(movie.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <div className="card-footer">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => confirmDelete(movie)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDeleteModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Removal</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeDeleteModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to remove "
                    {movieToDelete?.title || "this movie"}" from your watchlist?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
