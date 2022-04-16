const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  url?: string;
  type?: string;
  category?: string;
}

interface IGenres {
  id: number;
  name: string;
}

export interface IDetail {
  genres: IGenres[];
  homepage: string;
  original_title?: string;
  original_name?: string;
  tagline: string;
  runtime: number;
  number_of_episodes?: number;
  number_of_seasons?: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getTopMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getDetail(category?: string, movieId?: string) {
  return fetch(
    `${BASE_PATH}/${category}/${movieId}?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
