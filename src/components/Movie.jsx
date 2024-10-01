// src/components/Movie.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/css/Movie.css'; // Import CSS for styling

const Movie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/movies/details/${id}`);
                setMovie(response.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    return (
        <div className="movie-container">
            <div className="movie-header" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}>
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
                            <li><strong>Language:</strong> {movie.spoken_languages.map(lang => lang.english_name).join(', ')}</li>
                            <li><strong>Budget:</strong> ${movie.budget.toLocaleString()}</li>
                            <li><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</li>
                            <li><strong>Average Rating:</strong> {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</li>
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
                            <a href={movie.homepage} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">
                                Official Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Movie;
