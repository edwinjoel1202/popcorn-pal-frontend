import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Start loading

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                username,
                password,
            });

            const { success, message, token } = response.data;

            if (success && token) {
                localStorage.setItem('token', token); // Store token
                setUser({ username }); // Set user in context
                // Reset form fields
                setUsername('');
                setPassword('');
                navigate('/home');
            } else {
                setError(message || 'Login failed. Please try again.');
            }
        } catch (err) {
            // Handle specific error cases
            if (err.response) {
                // Server responded with an error (e.g., 401, 500)
                setError(err.response.data.message || 'Login failed. Please check your credentials.');
            } else if (err.request) {
                // No response from server (e.g., network error)
                setError('Network error. Please check your connection.');
            } else {
                // Other errors (e.g., request setup)
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false); // Stop loading
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
                                disabled={loading} // Disable input during loading
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
                                disabled={loading} // Disable input during loading
                            />
                        </div>
                        {error && <div className="alert alert-danger text-center">{error}</div>}
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading} // Disable button during loading
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
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