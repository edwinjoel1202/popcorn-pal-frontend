// src/components/First.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/First.css';

const First = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="first-container">
            <div className="overlay">
                <div className="content">
                    <h1 className="title">Welcome to PopcornPal</h1>
                    <p className="subtitle">Discover movies, ratings, and more!</p>
                    <div className="button-group">
                        <button className="btn btn-primary" onClick={handleLoginClick}>
                            Login
                        </button>
                        <button className="btn btn-secondary" onClick={handleRegisterClick}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default First;
