import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './css/PopularMovies.css';

const PopularMovies = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopularMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/movies/popular');
                setPopularMovies(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching popular movies:', error.response || error.message);
                setError('Failed to load popular movies.');
            }
        };
        fetchPopularMovies();
    }, []);

    return (
        <div className="container mt-4">
            <h1>Popular Movies</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row">
                {popularMovies.length > 0 ? (
                    popularMovies.map((movie) => (
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
                    <p>No popular movies available.</p>
                )}
            </div>
        </div>
    );
};

export default PopularMovies;