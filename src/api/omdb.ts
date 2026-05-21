import axios from 'axios';
import type { MovieDetail, OmdbSearchResponse } from '../types/movie';
console.log("API KEY:", import.meta.env.VITE_OMDB_API_KEY);
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const omdb = axios.create({
    baseURL: BASE_URL,
    params: {
        apikey: API_KEY,
    },
});


export const searchMovies = async (query: string): Promise<OmdbSearchResponse> => {
    const response = await omdb.get("/", {
        params: { s: query, type: 'movie' },
    });
    return response.data;
};



export const getMovieById = async (id: string): Promise<MovieDetail> => {const response = await omdb.get("/", {
        params: { i: id, plot: 'full' },
    });
    return response.data;

};
