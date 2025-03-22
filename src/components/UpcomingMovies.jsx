import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/UpcomingMovies.css';

const UpcomingMovies = () => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUpcomingMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/movies/upcoming');
                setUpcomingMovies(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching upcoming movies:', error.response || error.message);
                setError('Failed to load upcoming movies. Please try again later.');
            }
        };
        fetchUpcomingMovies();
    }, []);

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
                            <li className="nav-item"><Link className="nav-link" to="/account">{user ? `Hi, ${user.username}` : "Account"}</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mt-4">
                {error && <div className="alert alert-danger">{error}</div>}

                <h1>Upcoming Movies</h1>
                <div className="row">
                    {upcomingMovies.map((movie) => (
                        <div key={movie.id} className="col-md-3 mb-4">
                            <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                <div className="card movie-card">
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                        className="card-img-top" 
                                        alt={movie.title} 
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{movie.title || movie.original_title}</h5>
                                        <p className="card-text">Release Date: {movie.release_date}</p>
                                        <p className="card-text">Rating: {movie.vote_average || 'N/A'}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpcomingMovies;