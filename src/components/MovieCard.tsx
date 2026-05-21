import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import "./MovieCard.scss";

interface MovieCardProps {
    movie: Movie;
    onFavoriteToggle?: (movie: Movie) => void;
    isFavorite: boolean;
}


const MovieCard = ({ movie, onFavoriteToggle, isFavorite = false }: MovieCardProps) => {
const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://placehold.co/300x450?text=No+Image";

    return (
        <div className="movie-card">
            <Link to={`/movie/${movie.imdbID}`}>
                <img src={posterUrl} alt={movie.Title} className="movie-card__poster" />
                <div className="movie-card__info">
                    <h3 className="movie-card__title">{movie.Title}</h3>
                    <span className="movie-card__year">{movie.Year}</span>
                </div>
            </Link>

            {onFavoriteToggle && (
                <button
                    className={`movie-card__fav-btn ${isFavorite ? "movie-card__fav-btn--active" : ""}`}
                    onClick={() => onFavoriteToggle(movie)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorite ?"❤️": "🤍"}
                </button>
            )}

        </div>
    );
};

export default MovieCard;
