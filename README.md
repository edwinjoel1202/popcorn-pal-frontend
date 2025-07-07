# 🍿 PopcornPal

Welcome to **PopcornPal** — your ultimate movie companion! Discover trending, popular, top-rated, and upcoming movies, manage your personal watchlist, and share your thoughts with reviews. Built with React and Vite for a blazing-fast, modern experience.

---

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT-based sessions.
- **Movie Discovery**: Browse trending, popular, top-rated, and upcoming movies with beautiful posters and ratings.
- **Movie Details**: Dive deep into each movie with detailed info, user reviews, and ratings.
- **Search**: Instantly search for movies by title with real-time suggestions.
- **Watchlist**: Save your favorite movies to a personal watchlist for easy access.
- **User Reviews**: Write, view, and manage reviews for any movie.
- **Responsive UI**: Clean, modern, and mobile-friendly design using Bootstrap.

---

## 🖥️ Screens & Navigation

- **Landing Page**: Welcome screen with options to Login or Register.
- **Home**: Dashboard with search, now playing carousel, and quick links to movie categories.
- **Trending / Popular / Top Rated / Upcoming**: Dedicated pages for each movie category.
- **Movie Details**: In-depth info, reviews, and add-to-watchlist functionality.
- **Watchlist**: View and manage your saved movies.
- **Search Results**: Filtered movie results based on your query.
- **Authentication**: Secure login and registration forms.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Bootstrap
- **State Management**: React Context API
- **HTTP Client**: Axios (with JWT token support)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Backend API running at `http://localhost:8080` (see [PopcornPal Backend](#) for details)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/popcorn-pal-frontend.git
cd popcorn-pal-frontend

# Install dependencies
npm install
# or
yarn install
```

### Running the App

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 🔑 Environment Variables

No custom environment variables are required for local development. The frontend expects the backend API at `http://localhost:8080`.

---

## 📝 Folder Structure

```
src/
  components/      # React components (pages, UI, features)
  context/         # React Context for user authentication
  assets/          # Images and static assets
  axios.jsx        # Axios instance with JWT support
  App.jsx          # Main app and routing
  main.jsx         # Entry point
```

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [TMDB API](https://www.themoviedb.org/documentation/api) for movie data
- [React](https://react.dev/), [Vite](https://vitejs.dev/), [Bootstrap](https://getbootstrap.com/)

---

> Made with ❤️ by the PopcornPal Team
