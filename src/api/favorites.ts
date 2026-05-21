import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "http://localhost:3002";


const api = axios.create({ baseURL: BASE_URL,
});

export const getFavorites = async (): Promise<Movie[]> => {

    const res = await api.get("/favorites");
  return res.data;
};
export const addFavorite = async (movie: Movie): Promise<Movie> => {
const res = await api.post("/favorites", {
    ...movie,
    id: movie.imdbID,
  });
  return res.data;
};



export const removeFavorite = async (imdbID: string): Promise<void> => {await api.delete(`/favorites/${imdbID}`);};

export const updateFavorite = async (movie: Movie): Promise<Movie> =>

    {
  const res = await api.put(`/favorites/${movie.imdbID}`, {
    ...movie,
    id: movie.imdbID,
  });
  return res.data;

};
