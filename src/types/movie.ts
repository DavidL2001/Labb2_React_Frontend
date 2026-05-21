export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
  rating?: number;
}

export interface MovieDetail extends Movie {
  Plot: string;
  Director: string;
  Actors: string;
  Genre: string;
  Runtime: string;
  imdbRating: string;
}

export interface OmdbSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
