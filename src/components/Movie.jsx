import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../context/UserContext';
// import "../components/css/Movie.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [page, setPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const { user } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistUpdated, setWatchlistUpdated] = useState(0); // Trigger re-check
  const [filterCategory, setFilterCategory] = useState("All"); // State for filter category
  const navigate = useNavigate();

  console.log("User from Movie:", user);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/movies/details/${id}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    const checkWatchlist = async () => {
      if (!user) {
        setIsInWatchlist(false);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/watchlist/check/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsInWatchlist(response.data);
      } catch (error) {
        console.error("Error checking watchlist:", error);
        setIsInWatchlist(false); // Default to false on error
      }
    };

    fetchMovieDetails();
    checkWatchlist();
  }, [id, user, watchlistUpdated]); // Add watchlistUpdated as dependency

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasMoreReviews(true);
    fetchReviews(0);
  }, [id]);

  const fetchReviews = async (currentPage) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reviews/movie/${id}`,
        {
          params: {
            page: currentPage,
            size: 10,
          },
        }
      );
      if (response.data.length < 10) {
        setHasMoreReviews(false);
      }
      setReviews((prevReviews) => {
        const newReviews = response.data.filter(
          (newReview) => !prevReviews.some((review) => review.reviewId === newReview.reviewId)
        );
        return [...prevReviews, ...newReviews];
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!user) {
      alert("Please log in to submit a review.");
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      navigate('/login');
      setIsSubmitting(false);
      return;
    }

    const newReview = {
      tmdbMovieId: parseInt(id),
      username: user.username,
      reviewText,
      rating,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        "http://localhost:8080/api/reviews",
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setReviews([]);
      setPage(0);
      setHasMoreReviews(true);
      fetchReviews(0);
      setReviewText("");
      setRating(5);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      } else if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "You have already submitted a review for this movie.");
      } else {
        alert("An error occurred while submitting your review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!user || !userReview) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/reviews/${userReview.reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setReviews([]);
      setPage(0);
      setHasMoreReviews(true);
      fetchReviews(0);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting review:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        alert("You can only delete your own reviews.");
      } else {
        alert("An error occurred while deleting your review. Please try again.");
      }
    }
  };

  const handleAddToWatchlist = async () => {
    if (!user) {
      alert("Please log in to add to your watchlist.");
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/watchlist`,
        { tmdbMovieId: parseInt(id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setIsInWatchlist(true);
      setShowWatchlistModal(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      } else {
        alert("An error occurred while adding to your watchlist. Please try again.");
      }
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const watchlistResponse = await axios.get('http://localhost:8080/api/watchlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const movieInWatchlist = watchlistResponse.data.find(
        (entry) => entry.tmdbMovieId === parseInt(id)
      );

      if (movieInWatchlist) {
        await axios.delete(
          `http://localhost:8080/api/watchlist/${movieInWatchlist.watchlistId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsInWatchlist(false);
        setWatchlistUpdated((prev) => prev + 1); // Trigger re-check
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      if (error.response && error.response.status === 401) {
        alert("Your session has expired. Please log in again.");
        navigate('/login');
      } else {
        alert("An error occurred while removing from your watchlist. Please try again.");
      }
    }
  };

  const loadMoreReviews = () => {
    setPage((prevPage) => prevPage + 1);
    fetchReviews(page + 1);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const closeWatchlistModal = () => {
    setShowWatchlistModal(false);
  };

  const userReview = reviews.find((review) => user && review.username === user.username);
  const otherReviews = reviews.filter((review) => !user || review.username !== user.username);

  // Filter reviews based on the selected category
  const filteredUserReview = userReview && (filterCategory === "All" || userReview.tag === filterCategory) ? userReview : null;
  const filteredOtherReviews = otherReviews.filter(
    (review) => filterCategory === "All" || review.tag === filterCategory
  );

  // Determine if there are more reviews to load after filtering
  const hasMoreFilteredReviews = hasMoreReviews && filteredOtherReviews.length + (filteredUserReview ? 1 : 0) >= (page + 1) * 10;

  if (!movie) {
    return <div>Loading...</div>;
  }

  // Function to get badge class based on sentiment
  const getBadgeClass = (tag) => {
    switch (tag) {
      case "Positive":
        return "badge rounded-pill bg-success";
      case "Negative":
        return "badge rounded-pill bg-danger";
      case "Neutral":
        return "badge rounded-pill bg-warning text-dark";
      default:
        return "badge rounded-pill bg-secondary";
    }
  };

  return (
    <div className="movie-container">
      <Navbar user={user} />
      <div
        className="movie-header"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
        }}
      >
        <div className="movie-title">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>
        </div>
      </div>

      <div className="movie-content container mt-4">
        <div className="row">
          <div className="col-md-4">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
          </div>
          <div className="col-md-8">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
            <h5>Genres</h5>
            <ul>
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
            <h5>Details</h5>
            <ul>
              <li><strong>Release Date:</strong> {movie.release_date}</li>
              <li><strong>Runtime:</strong> {movie.runtime} minutes</li>
              <li>
                <strong>Language:</strong>{" "}
                {movie.spoken_languages.map((lang) => lang.english_name).join(", ")}
              </li>
              <li><strong>Budget:</strong> ${movie.budget.toLocaleString()}</li>
              <li><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</li>
              <li>
                <strong>Average Rating:</strong> {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </li>
            </ul>
            <h5>Production Companies</h5>
            <div className="production-companies">
              {movie.production_companies.map((company) => (
                <div key={company.id} className="production-company">
                  {company.logo_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      className="company-logo"
                    />
                  )}
                  <p>{company.name}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  className="btn btn-primary me-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Website
                </a>
              )}
              <button
                className={`btn ${isInWatchlist ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                disabled={isSubmitting} // Disable only during submission
              >
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>

        {!userReview && user && (
          <div className="mt-4">
            <h4>Add Your Review</h4>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">
                  Rating: {rating}
                </label>
                <input
                  type="range"
                  id="rating"
                  className="form-range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reviewText" className="form-label">
                  Review
                </label>
                <textarea
                  id="reviewText"
                  className="form-control"
                  rows="3"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {showSuccessModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Success</h5>
                  <button type="button" className="btn-close" onClick={closeSuccessModal}></button>
                </div>
                <div className="modal-body">
                  <p>Review added successfully!</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={closeSuccessModal}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete your review? This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDeleteReview}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showWatchlistModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Watchlist</h5>
                  <button type="button" className="btn-close" onClick={closeWatchlistModal}></button>
                </div>
                <div className="modal-body">
                  <p>{isInWatchlist ? "Added to Watchlist!" : "Removed from Watchlist!"}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={closeWatchlistModal}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5">
          <h4>User Reviews</h4>
          {/* Filter Section */}
          <div className="mb-3">
            <label className="me-2">Filter by Sentiment:</label>
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn ${filterCategory === "All" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setFilterCategory("All")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn ${filterCategory === "Positive" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setFilterCategory("Positive")}
              >
                Positive
              </button>
              <button
                type="button"
                className={`btn ${filterCategory === "Neutral" ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => setFilterCategory("Neutral")}
              >
                Neutral
              </button>
              <button
                type="button"
                className={`btn ${filterCategory === "Negative" ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => setFilterCategory("Negative")}
              >
                Negative
              </button>
            </div>
          </div>

          {(filteredUserReview || filteredOtherReviews.length > 0) ? (
            <ul className="list-group">
              {filteredUserReview && (
                <li
                  className="list-group-item d-flex justify-content-between align-items-start"
                  style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb' }}
                >
                  <div>
                    <strong>{filteredUserReview.username} - Rating: {filteredUserReview.rating}/10</strong>
                    <span className={`ms-2 ${getBadgeClass(filteredUserReview.tag)}`}>
                      {filteredUserReview.tag || "Unknown"}
                    </span>
                    <p>{filteredUserReview.reviewText}</p>
                    <small>Reviewed on: {new Date(filteredUserReview.createdAt).toLocaleString()}</small>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </button>
                </li>
              )}
              {filteredOtherReviews.map((review) => (
                <li key={review.reviewId} className="list-group-item">
                  <strong>{review.username} - Rating: {review.rating}/10</strong>
                  <span className={`ms-2 ${getBadgeClass(review.tag)}`}>
                    {review.tag || "Unknown"}
                  </span>
                  <p>{review.reviewText}</p>
                  <small>Reviewed on: {new Date(review.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews match the selected filter. Try a different category!</p>
          )}
          {hasMoreFilteredReviews && (
            <div className="text-center mt-3">
              <button className="btn btn-secondary" onClick={loadMoreReviews}>
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movie;