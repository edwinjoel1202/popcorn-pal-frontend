
import React, { createContext, useState, useEffect } from 'react';

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load the user information from localStorage when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Optionally verify token with backend here
            setUser({ username: 'loaded-from-token' }); // Replace with actual username from token
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};