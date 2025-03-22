import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load the user information when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user details from the backend using the token
            axios.get('http://localhost:8080/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                const { username } = response.data;
                setUser({ username });
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
                // If token is invalid or expired, clear localStorage and set user to null
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};