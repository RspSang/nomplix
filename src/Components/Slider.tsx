import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import { useQuery } from "react-query";
import { getDetail, IDetail } from "../api";

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Left = styled.div`
  position: absolute;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 5;
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 48px;
  padding: 0.5rem;
  transition: 0.3s;
`;

const Right = styled(Left)`
  right: 0;
`;

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
  svg {
    font-size: 1.25em;
    color: #4cd137;
    margin-right: 5px;
  }
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

const rowVariants = {
  hidden: (back: boolean) => ({
    x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (back: boolean) => ({
    x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

export interface ISlider {
  data: any;
  category?: string;
  url?: string;
  type?: string;
}

const offset = 6;

function Slider({ data, category, type, url }: ISlider) {
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
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const onOverlayClick = () => history.push("/");
  const onBoxClicked = (movieId: number) => {
    history.push(`/${url}/${type}/${movieId}`);
  };
  const { data: detail } = useQuery<IDetail>(
    ["details", `detail_${bigMovieMatch?.params.movieId}`],
    () => getDetail("movie", bigMovieMatch?.params.movieId)
  );
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const dcraseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 1 : prev - 1));
    }
  };

  return (
    <>
      {data && (
        <>
          {index === 0 || <Left onClick={dcraseIndex}>&lsaquo;</Left>}
          {index === 2 || <Right onClick={incraseIndex}>&rsaquo;</Right>}
          <AnimatePresence
            initial={false}
            custom={back}
            onExitComplete={toggleLeaving}
          >
            <Row
              custom={back}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie: any) => (
                  <Box
                    layoutId={movie.id + ""}
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    onClick={() => onBoxClicked(movie.id)}
                    transition={{ type: "tween" }}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
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
                              clickedMovie.release_date ||
                              clickedMovie.first_air_date
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
                            {detail?.genres.map((genre) => (
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
        </>
      )}
    </>
  );
}
export default Slider;
