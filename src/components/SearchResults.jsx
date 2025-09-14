import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/SearchResults.css';
import Navbar from './Navbar';
import { UserContext } from '../context/UserContext';

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { user } = useContext(UserContext);

    // Extract query parameter from URL
    const query = new URLSearchParams(location.search).get('query') || '';

    useEffect(() => {
        if (!query.trim()) {
            setError('Please enter a search term.');
            return;
        }

        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://pop-corn-pal.onrender.com/api/movies/search', {
                    params: { query }
                });
                setSearchResults(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Failed to load search results. Please try again later.');
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // Re-fetch when query changes

    return (
        <div>
            <Navbar user={user} />
            {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">PopcornPal</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><Link className="nav-link" to="/home">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/watchlist">Watchlist</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/account">Account</Link></li>
                        </ul>
                    </div>
                </div>
            </nav> */}

            <div className="container mt-4">
                <h1>Search Results for "{query}"</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div>Loading...</div>}

                {searchResults.length === 0 && !loading && !error && (
                    <p>No results found for "{query}". Try a different search term.</p>
                )}

                {searchResults.length > 0 && (
                    <div className="row">
                        {searchResults.map((movie) => (
                            <div key={movie.id} className="col-md-4 mb-4">
                                <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                    <div className="card movie-card">
                                        <img
                                            src={
                                                movie.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                    : '/assets/movie_poster_placeholder.jpg'
                                            }
                                            className="card-img-top"
                                            alt={movie.title}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{movie.title || movie.original_title}</h5>
                                            <p className="card-text">
                                                Rating: {movie.vote_average || 'N/A'}
                                            </p>
                                            <p className="card-text">
                                                Release Year: {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;