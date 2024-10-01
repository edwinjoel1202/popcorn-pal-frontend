// src/components/Home.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/css/Home.css'; // Import the CSS file for styles
import { Link } from 'react-router-dom';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/movies/trending');
                setMovies(response.data); // Assuming the data comes as an array of movies
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchTrendingMovies();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">PopcornPal</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/watchlist">Watchlist</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/account">
                                    <img src="/path/to/user-icon.png" alt="User Icon" className="user-icon" /> {/* Replace with actual user icon path */}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="input-group mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a movie..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-outline-secondary" type="button">Search</button>
                </div>

                <h2 className="text-center mb-4">Trending Movies</h2>
                <div className="row">
                    {movies.length > 0 ? (
                        movies.map((movie) => (
                            <div className="col-md-3 mb-4" key={movie.id}>
                                <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                    <div className="card movie-card">
                                        <img 
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                            alt={movie.title || movie.original_title} 
                                            className="card-img-top" 
                                        />
                                        <div className="card-body text-center">
                                            <h5 className="card-title">{movie.title || movie.original_title}</h5>
                                            <p className="card-text">Rating: {movie.vote_average.toFixed(1)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No trending movies available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;