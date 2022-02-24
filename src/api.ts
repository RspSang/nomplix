const API_Key = process.env.REACT_APP_MOVIE_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_Key}`).then(
    (response) => response.json()
  );
}
