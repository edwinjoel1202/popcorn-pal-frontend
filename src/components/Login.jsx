// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for the Register option

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                username,
                password,
            });

            if (response.data.success) {
                navigate('/home');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Wrong credentials or password');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <div className="text-center mt-3">
                        <span>New User? </span>
                        <Link to="/register" className="text-primary">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
