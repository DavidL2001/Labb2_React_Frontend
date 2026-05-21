import { useState, useEffect } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import StarRating from "../components/StarRating";
import {
  getFavorites,
  removeFavorite,
  updateFavorite,
} from "../api/favorites";
import "./Favorites.scss";



const Favorites = () => {

  const [favorites, setFavorites] =useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null> (null);

  useEffect(() => {

    const fetchFavorites = async () => {


      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch {

        setError("Failed load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (movie: Movie) => {
    try {
      await removeFavorite(movie.imdbID);
      setFavorites((prev) => prev.filter((f) => f.imdbID !== movie.imdbID));
    } catch {
      setError("Could not remove favorite.");
    }
  };

  const handleRate = async (imdbID: string, rating: number) => {

    const movie = favorites.find((f) => f.imdbID === imdbID);


    if (!movie) return;
    try {
      const updated = await updateFavorite({ ...movie, rating });
      setFavorites((prev) =>
        prev.map((f) => (f.imdbID === imdbID ? updated : f))
      );
    } catch {
      setError("Could not update rating.");
    }
  };

  const handleClearAll = async () => {
    try {
      await Promise.all(favorites.map((f) => removeFavorite(f.imdbID)));
      setFavorites([]);
    } catch {
      setError("Could not clear favorites.");
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" />
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h1 className="page-title">My Favorites</h1>

      {error && <p className="favorites__error">{error}</p>}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>You haven not added any favorite movies yet.</p>

        </div>
      ) : (
        <>
          <p className="favorites__count">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
          </p>
          <div className="favorites__grid">
            {favorites.map((movie) => (
              <div key={movie.imdbID} className="favorites__item">
                <MovieCard
                  movie={movie}
                  onFavoriteToggle={handleRemove}
                  isFavorite={true}
                />
                <StarRating
                  imdbID={movie.imdbID}
                  currentRating={movie.rating}
                  onRate={handleRate}
                />
              </div>
            ))}
          </div>
          <button
            className="favorites__clear btn-secondary"
            onClick={handleClearAll}

            
          >
            Clear all movies
          </button>
        </>
      )}
    </div>
  );
};

export default Favorites;
