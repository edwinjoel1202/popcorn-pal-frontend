// src/components/TrendingMovies.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/TrendingMovies.css'; // Create this file for styling
import 'bootstrap/dist/css/bootstrap.min.css';

const TrendingMovies = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/movies/trending');
                setTrendingMovies(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching trending movies:', error.response || error.message);
                setError('Failed to load trending movies.');
            }
        };
        fetchTrendingMovies();
    }, []);

    return (
        <div className="container mt-4">
            <h1>Trending Movies</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {trendingMovies.length > 0 ? (
                    trendingMovies.map((movie) => (
                        <div key={movie.id} className="col-md-3 mb-4">
                            <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                <div className="card movie-card">
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                                    <div className="card-body">
                                        <h5 className="card-title">{movie.title || movie.original_title}</h5>
                                        <p className="card-text">Rating: {movie.vote_average}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No trending movies available.</p>
                )}
            </div>
        </div>
    );
};

export default TrendingMovies;