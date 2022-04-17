import { useQuery } from "react-query";
import {
  getOnAirShows,
  getPopularShows,
  getTopShows,
  IGetShowResult,
} from "../api";
import { makeImagePath } from "../utils";
import Slider from "../Components/Slider";
import {
  Wrapper,
  Loader,
  Banner,
  Title,
  Overview,
  SlideContainer,
  SliderTitle,
} from "./Home";

function Tv() {
  const { data: topShow, isLoading: topShowLoading } = useQuery<IGetShowResult>(
    ["tvs", "topShow"],
    getTopShows
  );
  const { data: popularShow, isLoading: popularShowLoading } =
    useQuery<IGetShowResult>(["tvs", "popularShow"], getPopularShows);
  const { data: onAirShow, isLoading: onAirShowLoading } =
    useQuery<IGetShowResult>(["tvs", "onAirShow"], getOnAirShows);

  return (
    <Wrapper>
      {topShowLoading && popularShowLoading && onAirShowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(topShow?.results[0].backdrop_path || "")}
          >
            <Title>{topShow?.results[0].name}</Title>
            <Overview>{topShow?.results[0].overview}</Overview>
          </Banner>
          <SlideContainer>
            <SliderTitle>Now Playing</SliderTitle>
            <Slider data={topShow} type="topShow" category="tv" url="tv" />
          </SlideContainer>
          <SlideContainer>
            <SliderTitle>Upcoming Movie</SliderTitle>
            <Slider
              data={popularShow}
              type="popularShow"
              category="tv"
              url="tv"
            />
          </SlideContainer>
          <SlideContainer>
            <SliderTitle>Top Rated</SliderTitle>
            <Slider data={onAirShow} type="onAirShow" category="tv" url="tv" />
          </SlideContainer>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
