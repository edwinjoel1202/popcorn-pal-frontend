import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
// import '../components/css/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Navbar from './Navbar';


const Home = () => {
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    console.log("User from Home:", user);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const trendingResponse = await axios.get('http://localhost:8080/api/movies/trending');
                setTrendingMovies(trendingResponse.data);

                const popularResponse = await axios.get('http://localhost:8080/api/movies/popular');
                setPopularMovies(popularResponse.data);

                const topRatedResponse = await axios.get('http://localhost:8080/api/movies/top-rated');
                setTopRatedMovies(topRatedResponse.data);

                const upcomingResponse = await axios.get('http://localhost:8080/api/movies/upcoming');
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

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/movies/search', {
                        params: { query: searchTerm }
                    });
                    setSearchResults(response.data.slice(0, 5));
                } catch (error) {
                    console.error('Error fetching search results:', error);
                    setSearchResults([]);
                }
            };
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

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
            navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleResultClick = (movieId) => {
        setSearchTerm('');
        setSearchResults([]);
        navigate(`/movie/${movieId}`);
    };

    return (
        <div>
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
                            <li className="nav-item"><Link className="nav-link" to="/account">{user ? `Hi, ${user.username}` : "Account"}</Link></li>
                        </ul>
                    </div>
                </div>
            </nav> */}

            <Navbar user={user} />

            <div className="container mt-5">
                {error && <div className="alert alert-danger">{error}</div>}

                <h1 className="slogan">Grab Your Popcorn, Dive In!</h1>
                <div className="input-group mb-4 position-relative">
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
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {searchResults.length > 0 && (
                        <ul className="search-results-dropdown">
                            {searchResults.map((movie) => (
                                <li
                                    key={movie.id}
                                    className="search-result-item"
                                    onClick={() => handleResultClick(movie.id)}
                                >
                                    <img
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                                : 'https://via.placeholder.com/92x138?text=No+Poster'
                                        }
                                        alt={movie.title}
                                        className="search-result-poster"
                                    />
                                    <div className="search-result-info">
                                        <span className="search-result-title">{movie.title}</span>
                                        <span className="search-result-year">
                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

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