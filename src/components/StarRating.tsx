import { useState } from "react";
import "./StarRating.scss";

interface StarRatingProps {
  imdbID: string;
  currentRating?: number;
  onRate: (imdbID: string, rating: number) => void;
}

const StarRating = ({ imdbID, currentRating = 0, onRate }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayRating = hovered ?? currentRating;

  return (
    <div className="star-rating">
    <div className="star-rating__stars">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            className={`star-rating__star ${star <= displayRating ?

                "star-rating__star--active" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onRate(imdbID, star)}
            aria-label={`Rate ${star} out of 10`}
          >
            ★

          </button>
        ))}
      </div>
    {currentRating > 0 && (

        <span className="star-rating__label">{currentRating}/10</span>
      )}
    </div>
  );
};

export default StarRating;
