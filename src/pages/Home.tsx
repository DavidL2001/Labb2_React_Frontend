import { useState, useEffect } from "react";
import { searchMovies } from "../api/omdb";
import { getFavorites, addFavorite, removeFavorite } from "../api/favorites";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import "./Home.scss";

const Home = () => {


  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);


  useEffect(() => {

    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch {
        console.error("Failed to load favorites");

      }
    };
    fetchFavorites();
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchMovies(query);
      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError("No movies found.");
      }
    } catch {
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };


  const handleFavoriteToggle = async (movie: Movie) => {

    const exists = favorites.find((f) => f.imdbID === movie.imdbID);
    try {
      if (exists) {
        await removeFavorite(movie.imdbID);
        setFavorites((prev) => prev.filter((f) => f.imdbID !== movie.imdbID));
      } else {
        await addFavorite(movie);
        setFavorites((prev) => [...prev, movie]);
      }

    } catch {
      console.error("Could not update favorites");
    }
  };

  const isFavorite = (id: string) => favorites.some((f) => f.imdbID === id);

  return (
    <div className="home">
      <div className="home__hero">
        <h1 className="home__hero-title">Search for Movies</h1>
        <p className="home__hero-subtitle">
          Search for your favorite movies and save them to your favorites list.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && (
        <div className="empty-state">
          <div className="spinner" />
          <p>Searching...</p>
        </div>
      )}

      {error && !loading && (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      )}


      {!hasSearched && !loading && (
    <div className="empty-state">
          <p>Start by searching for movies above</p>
        </div>
      )}


      {!loading && movies.length > 0 && (
        <>
          <p className="home__results-count">{movies.length} results found</p>
          <div className="home__grid">
            {movies.map((movie) => (

              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={isFavorite(movie.imdbID)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
