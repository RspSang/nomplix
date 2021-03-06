import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getTopMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";

export const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

export const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

export const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

export const SlideContainer = styled.div`
  height: 270px;
`;

export const SliderTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

function Home() {
  const { data: nowPlaying, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: topMovie, isLoading: topMovieLoading } =
    useQuery<IGetMoviesResult>(["movies", "topMovie"], getTopMovies);
  const { data: upcomingMovie, isLoading: upcomingMovieLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcomingMovie"], getUpcomingMovies);
  return (
    <Wrapper>
      {nowPlayingLoading && topMovieLoading && upcomingMovieLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <SlideContainer>
            <SliderTitle>Now Playing</SliderTitle>
            <Slider
              data={nowPlaying}
              type="nowPlaying"
              category="movie"
              url="movie"
            />
          </SlideContainer>
          <SlideContainer>
            <SliderTitle>Upcoming Movie</SliderTitle>
            <Slider
              data={upcomingMovie}
              type="upcomingMovie"
              category="movie"
              url="movie"
            />
          </SlideContainer>
          <SlideContainer>
            <SliderTitle>Top Rated</SliderTitle>
            <Slider
              data={topMovie}
              type="topMovie"
              category="movie"
              url="movie"
            />
          </SlideContainer>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
