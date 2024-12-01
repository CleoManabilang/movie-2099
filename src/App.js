import React, { useState, useEffect } from 'react';
import './App.css';
import MovieList from './components/MovieList';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';  // Import the Modal component

const App = () => {
  const [movies, setMovies] = useState([]);  // State for movies
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);  // Error state
  const [page, setPage] = useState(1);  // Current page for pagination
  const [selectedMovie, setSelectedMovie] = useState(null);  // State for selected movie details
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility

  // Fetch movies data
  const fetchMovies = async () => {
    const url = `https://www.omdbapi.com/?s=movie&page=${page}&apikey=263d22d8`;

    setLoading(true);  // Set loading to true while fetching
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Response === "True") {
        setMovies(data.Search);  // Set movies data
        setError(null);  // Reset error
      } else {
        setMovies([]);  // Clear movies if no valid response
        setError(data.Error);  // Set error message
      }
    } catch {
      setError("An error occurred while fetching data.");
      setMovies([]);
    } finally {
      setLoading(false);  // Set loading to false once data is fetched
    }
  };

  // Fetch movies whenever the page changes
  useEffect(() => {
    fetchMovies();
  }, [page]);

  // Handle page change (pagination)
  const handlePageChange = (increment) => {
    setPage((prevPage) => Math.max(prevPage + increment, 1)); // Increment or decrement the page
  };

  // Handle movie click to open modal
  const onMovieClick = (movie) => {
    setSelectedMovie(movie);  // Set the selected movie
    setShowModal(true);  // Show the modal
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);  // Hide the modal
    setSelectedMovie(null);  // Clear selected movie
  };

  return (
    <div className="App">
      <Header />
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message if any */}
      {loading ? <p>Loading...</p> : <MovieList movies={movies} onMovieClick={onMovieClick} />}  {/* Show loading or movies */}
      
      {/* Display the modal */}
      {showModal && selectedMovie && (
        <Modal movie={selectedMovie} onClose={closeModal} />
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(-1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => handlePageChange(1)}>
          Next
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default App;
