import { ISlider } from "./Slider";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { getDetail, IDetail } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  z-index: 999;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const DetailWrap = styled.div`
  padding: 0 20px;
`;

const Runtime = styled.span`
  margin-left: 1em;
`;

const Bigdate = styled.div`
  font-size: 1em;
  position: relative;
  top: -60px;
  margin-left: 1.3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const BigVote = styled.div`
  font-size: 1rem;
  margin-left: 1rem;
  span {
    color: gray;
  }
`;

const GenresList = styled.ul`
  margin-left: 2rem;
  display: flex;
  justify-content: flex-end;
  span {
    color: gray;
  }
  li {
    margin-left: 5px;
  }
`;

const BigTagline = styled.span`
  display: block;
  font-size: 1.25em;
  line-height: 2;
`;

function Detail({ data, category, type, url }: ISlider) {
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/${url}/${type}/:movieId`
  );
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => +movie.id === +bigMovieMatch.params.movieId
    );
  const onOverlayClick = () => {
    category === "movie"
      ? history.push("/")
      : category === "tv"
      ? history.push("/tv")
      : history.push("/search");
  };
  const { data: detail } = useQuery<IDetail>(
    ["details", `detail_${bigMovieMatch?.params.movieId}`],
    () => getDetail("movie", bigMovieMatch?.params.movieId)
  );

  return (
    <AnimatePresence>
      {bigMovieMatch ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            exit={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <BigMovie
            style={{ top: scrollY.get() + 100 }}
            layoutId={bigMovieMatch.params.movieId}
          >
            {clickedMovie && detail ? (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedMovie.backdrop_path
                    )})`,
                  }}
                />
                <DetailWrap>
                  <BigTitle>
                    <h3>{clickedMovie.title || clickedMovie.name}</h3>
                  </BigTitle>
                  <Bigdate>
                    <span>
                      {(
                        clickedMovie.release_date || clickedMovie.first_air_date
                      ).substr(0, 4)}
                    </span>
                    {detail.runtime ? (
                      <Runtime>
                        {Math.floor(detail?.runtime / 60)}시간
                        {detail?.runtime % 60}분
                      </Runtime>
                    ) : null}
                    <BigVote>
                      <span>평점:</span>
                      {clickedMovie.vote_average}
                    </BigVote>
                    <GenresList>
                      <span>장르: </span>
                      {detail?.genres?.map((genre) => (
                        <li key={genre.id}>{genre.name},</li>
                      ))}
                    </GenresList>
                  </Bigdate>
                  <BigOverview>
                    <BigTagline>{detail?.tagline}</BigTagline>
                    {clickedMovie.overview}
                  </BigOverview>
                </DetailWrap>
              </>
            ) : null}
          </BigMovie>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default Detail;
