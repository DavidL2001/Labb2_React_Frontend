import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getMovieById } from "../api/omdb"
import type { MovieDetail as MovieDetailType } from "../types/movie"
import type { Movie } from "../types/movie"
import "./MovieDetail.scss";

const getFavorites = (): Movie[] => {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : []
};

const saveFavorites = (favorites: Movie[]) => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
}



const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<MovieDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchMovie = async () => {
            setLoading(true);
            try {
                const data = await getMovieById(id);
                setMovie(data);
                const favorites = getFavorites();
                setIsFavorite(favorites.some((f) => f.imdbID === data.imdbID));
            } catch (err) {
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);

    const handleFavoriteToggle = () => {
        if (!movie) return;
        const current = getFavorites();
        const exists = current.find((f) => f.imdbID === movie.imdbID);
        const updated = exists
            ? current.filter((f) => f.imdbID !== movie.imdbID)
            : [...current, movie];

        saveFavorites(updated);
        setIsFavorite(!exists);
    };

    if (loading) {
        return(
        <div className="empty-state">
            <div className="spinner" />
            <p>Loading movie...</p>
        </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="empty-state">
                <p>{error ?? "Movie not found."}</p>
                <button className="btn-secondary" onClick={() => navigate("/")}>
                    Back to Movies
                </button>
            </div>
        );
    }

const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image";

return (
    <div className="movie-detail">
        <button className="movie-detail__back btn-secondary" onClick={() => navigate(-1)}>
            Go back.
            </button>

        <div className="movie-detail__hero">
        <img src={posterUrl} alt={movie.Title} className="movie-detail__poster" />

        <div className="movie-detail__info">
            <h1 className="movie-detail__title">{movie.Title}</h1>

            <div className="movie-detail__meta">
            <span className="movie-detail__badge">{movie.Year}</span>
            <span className="movie-detail__badge">{movie.Runtime}</span>
            <span className="movie-detail__badge">{movie.Genre}</span>
            </div>

            <div className="movie-detail__rating">
                    🌟<strong>{movie.imdbRating}</strong> / 10
            </div>

            <p className="movie-detail__plot">{movie.Plot}</p>

            <div className="movie-detail__crew">
                <p>
                    <span className="movie-detail__label">Director</span>
                    {movie.Director}
                </p>
                <p>
                    <span className="movie-detail__label">Actors</span>
                    {movie.Actors}
                </p>

            </div>

            <button className={`movie-detail__fav-btn ${isFavorite? "movie-detail__fav-btn--active" : ""}`}
            onClick={handleFavoriteToggle}>
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>
        </div>
    </div>
</div>
);
};


export default MovieDetail;
