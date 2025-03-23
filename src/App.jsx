// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import First from "./components/First";
import Movie from "./components/Movie";
import { UserProvider } from "./context/UserContext";
import PopularMovies from './components/PopularMovies';
import TrendingMovies from './components/TrendingMovies';
import TopRatedMovies from './components/TopRatedMovies';
import UpcomingMovies from './components/UpcomingMovies';
import Watchlist from './components/Watchlist';
import SearchResults from './components/SearchResults';
import "./components/css/Styles.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/trending" element={<TrendingMovies />} />
          <Route path="/popular" element={<PopularMovies />} />
          <Route path="/top-rated" element={<TopRatedMovies />} />
          <Route path="/upcoming" element={<UpcomingMovies />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
