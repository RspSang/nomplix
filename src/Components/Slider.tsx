import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../utils";
import Detail from "./Detail";

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
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    `/${url}/${type}/:movieId`
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);

  const onBoxClicked = (movieId: number) => {
    history.push(`/${url}/${type}/${movieId}`);
  };

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
                      <h4>{category === "tv" ? movie.name : movie.title}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
          {bigMovieMatch && category === "movie" ? (
            <Detail data={data} category="movie" type={type} url={url} />
          ) : null}
          {bigMovieMatch && category === "tv" ? (
            <Detail data={data} category="tv" type={type} url={url} />
          ) : null}
        </>
      )}
    </>
  );
}
export default Slider;
