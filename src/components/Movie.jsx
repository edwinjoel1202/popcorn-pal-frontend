import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../context/UserContext';
import "../components/css/Movie.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [page, setPage] = useState(0);
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const { user } = useContext(UserContext);
  console.log("User from Movie:",user);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setHasMoreReviews(true);
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

  useEffect(() => {
    if (id) {
      fetchReviews(page);
    }
  }, [page, id]);

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
      setReviewText("");
      setRating(5);
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

  const loadMoreReviews = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-container">
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
              <li>
                <strong>Release Date:</strong> {movie.release_date}
              </li>
              <li>
                <strong>Runtime:</strong> {movie.runtime} minutes
              </li>
              <li>
                <strong>Language:</strong>{" "}
                {movie.spoken_languages
                  .map((lang) => lang.english_name)
                  .join(", ")}
              </li>
              <li>
                <strong>Budget:</strong> ${movie.budget.toLocaleString()}
              </li>
              <li>
                <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
              </li>
              <li>
                <strong>Average Rating:</strong> {movie.vote_average.toFixed(1)}{" "}
                ({movie.vote_count} votes)
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

            {movie.homepage && (
              <a
                href={movie.homepage}
                className="btn btn-primary mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official Website
              </a>
            )}
          </div>
        </div>

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

        <div className="mt-5">
          <h4>User Reviews</h4>
          {reviews.length > 0 ? (
            <ul className="list-group">
              {reviews.map((review) => (
                <li key={review.reviewId} className="list-group-item">
                  <strong>{review.username} - Rating: {review.rating}/10</strong>
                  <p>{review.reviewText}</p>
                  <small>
                    Reviewed on: {new Date(review.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to add a review!</p>
          )}
          {hasMoreReviews && (
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