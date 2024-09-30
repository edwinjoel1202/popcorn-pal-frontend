// src/components/Movie.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/css/Movie.css'; // Create this CSS file to handle styles

const Movie = () => {
    const { movieId } = useParams(); // Assuming you're using React Router to get the selected movie ID
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/reviews/${movieId}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchMovieDetails();
        fetchReviews();
    }, [movieId]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="movie-container">
            <div className="movie-background">
                <div className="movie-details">
                    <h1 className="movie-title">{movie.title}</h1>
                    <div className="movie-poster">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    </div>
                    <div className="movie-info">
                        <h2 className="movie-subtitle">Storyline</h2>
                        <p className="movie-description">{movie.overview}</p>

                        <div className="movie-actors">
                            <h3 className="info-heading"><i className="fas fa-users"></i> Actors</h3>
                            <p>{movie.actors?.join(', ')}</p>
                        </div>

                        <div className="movie-ratings">
                            <h3 className="info-heading"><i className="fas fa-star"></i> Rating</h3>
                            <p>{movie.vote_average.toFixed(1)} / 10</p>
                        </div>
                    </div>

                    <div className="movie-reviews">
                        <h2 className="reviews-heading"><i className="fas fa-comments"></i> Reviews</h2>
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="review">
                                    <p><strong>{review.user}:</strong> {review.content}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
