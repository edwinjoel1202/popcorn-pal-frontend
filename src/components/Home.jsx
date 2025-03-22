import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../components/css/Home.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]); // Added state for Upcoming Movies
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const trendingResponse = await axios.get('http://localhost:8080/api/movies/trending');
                setTrendingMovies(trendingResponse.data);

                const popularResponse = await axios.get('http://localhost:8080/api/movies/popular');
                setPopularMovies(popularResponse.data);

                const topRatedResponse = await axios.get('http://localhost:8080/api/movies/top-rated');
                setTopRatedMovies(topRatedResponse.data);

                const upcomingResponse = await axios.get('http://localhost:8080/api/movies/upcoming'); // Added fetch for Upcoming Movies
                setUpcomingMovies(upcomingResponse.data);

                const nowPlayingResponse = await axios.get('http://localhost:8080/api/movies/now-playing');
                setNowPlayingMovies(nowPlayingResponse.data.slice(0, 5));
                setError(null);
            } catch (error) {
                console.error('Error fetching movies:', error.response || error.message);
                setError('Failed to load movies. Please try again later.');
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (nowPlayingMovies.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => {
                    const nextIndex = prevIndex === nowPlayingMovies.length - 1 ? 0 : prevIndex + 1;
                    return nextIndex;
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [nowPlayingMovies]);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => 
            prevIndex === 0 ? nowPlayingMovies.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => 
            prevIndex === nowPlayingMovies.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`; // Redirect to a search page
        }
    };

    return (
        <div>
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

            <div className="container mt-4">
                {error && <div className="alert alert-danger">{error}</div>} {/* Moved error message to the top */}

                <h1 className="slogan">Grab Your Popcorn, Dive In!</h1>
                <div className="input-group mb-4">
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search movies..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                    <button 
                        className="btn btn-primary" 
                        type="button" 
                        onClick={handleSearch} // Added search handler
                    >
                        Search
                    </button>
                </div>

                {/* Now Playing Carousel */}
                <h2>Now Playing in Theaters</h2>
                <div id="nowPlayingCarousel" className="carousel slide mb-4">
                    <div className="carousel-inner">
                        {nowPlayingMovies.map((movie, index) => (
                            <div 
                                key={movie.id} 
                                className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
                            >
                                <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                                        className="d-block w-100 carousel-image"
                                        alt={movie.title}
                                    />
                                    <div className="carousel-caption">
                                        <h3>{movie.title}</h3>
                                        <p>Rating: {movie.vote_average}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="carousel-control-prev" 
                        type="button" 
                        onClick={handlePrev}
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button 
                        className="carousel-control-next" 
                        type="button" 
                        onClick={handleNext}
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>

                {/* Trending Movies Section */}
                <div className="trending-section">
                    <div className="trending-header">
                        <h2>Trending Movies</h2>
                        {trendingMovies.length > 3 && (
                            <Link to="/trending" className="view-all">View All</Link>
                        )}
                    </div>
                    <div className="row">
                        {trendingMovies.slice(0, 3).map((movie) => (
                            <div key={movie.id} className="col-md-4 mb-4">
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
                        ))}
                    </div>
                </div>

                {/* Popular Movies Section */}
                <div className="popular-section">
                    <div className="popular-header">
                        <h2>Popular Movies</h2>
                        {popularMovies.length > 3 && (
                            <Link to="/popular" className="view-all">View All</Link>
                        )}
                    </div>
                    <div className="row">
                        {popularMovies.slice(0, 3).map((movie) => (
                            <div key={movie.id} className="col-md-4 mb-4">
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
                        ))}
                    </div>
                </div>
                
                {/* Top Rated Movies Section */}
                <div className="top-rated-section">
                    <div className="top-rated-header">
                        <h2>Top Rated Movies</h2>
                        {topRatedMovies.length > 3 && (
                            <Link to="/top-rated" className="view-all">View All</Link>
                        )}
                    </div>
                    <div className="row">
                        {topRatedMovies.slice(0, 3).map((movie) => (
                            <div key={movie.id} className="col-md-4 mb-4">
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
                        ))}
                    </div>
                </div>

                {/* Upcoming Movies Section */}
                <div className="upcoming-section">
                    <div className="upcoming-header">
                        <h2>Upcoming Movies</h2>
                        {upcomingMovies.length > 3 && (
                            <Link to="/upcoming" className="view-all">View All</Link>
                        )}
                    </div>
                    <div className="row">
                        {upcomingMovies.slice(0, 3).map((movie) => (
                            <div key={movie.id} className="col-md-4 mb-4">
                                <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                                    <div className="card movie-card">
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                                        <div className="card-body">
                                            <h5 className="card-title">{movie.title || movie.original_title}</h5>
                                            <p className="card-text">Rating: {movie.vote_average || 'N/A'}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;