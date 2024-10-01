// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import First from './components/First';
import Movie from './components/Movie';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<First />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/movie/:id" element={<Movie />} />          
            </Routes>
        </Router>
    );
};

export default App;
