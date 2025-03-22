import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8080/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { username } = response.data;
          setUser({ username });
          console.log("User fetched successfully:", username);
        } catch (error) {
          console.error('Error fetching user details:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        console.log("No token found in localStorage");
        setUser(null);
      }
      setLoading(false); // Mark loading complete
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  );
};