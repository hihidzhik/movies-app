import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Card, Rate, Spin, Tag } from "antd";
import { format } from "date-fns";
import { MoviesContext } from "../../contexts/MoviesContext";
import RatingCircle from "../RatingCircle/RatingCircle";
import { rateMovie, deleteRating } from "../../api/api";
import "./MovieCard.scss";
import { GenresContext } from "../../contexts/GenresContext";

const { Meta } = Card;

const MovieCard = ({ movie }) => {
    const { sessionId, ratedMovies, setRatedMovies, setMovies } = useContext(MoviesContext);
    const genres = useContext(GenresContext);
    const movieGenres = genres.filter((genre) => movie.genre_ids?.includes(genre.id));

    const initialRating = ratedMovies.find((m) => m.id === movie.id)?.rating || 0;
    const [userRating, setUserRating] = useState(initialRating);
    const [loading, setLoading] = useState(true);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    const placeholderUrl = "https://via.placeholder.com/183x279?text=No+Image";
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : placeholderUrl;

    const handleImageError = (e) => {
        if (!isPlaceholder) {
            setIsPlaceholder(true);
            e.target.src = placeholderUrl;
        }
        setLoading(false);
    };

    const handleRate = async (value) => {
        if (!sessionId) return;

        if (value === 0) {
            await deleteRating(movie.id, sessionId);
            setRatedMovies((prev) => prev.filter((m) => m.id !== movie.id));
            setMovies((prev) =>
                prev.map((m) => (m.id === movie.id ? { ...m, rating: 0 } : m))
            );
        } else {
            await rateMovie(movie.id, value, sessionId);
            setUserRating(value);
            setRatedMovies((prev) =>
                prev.some((m) => m.id === movie.id)
                    ? prev.map((m) => (m.id === movie.id ? { ...m, rating: value } : m))
                    : [...prev, { ...movie, rating: value }]
            );
            setMovies((prev) =>
                prev.map((m) => (m.id === movie.id ? { ...m, rating: value } : m))
            );
        }
    };

    return (
        <Card
            hoverable
            className="movie-card"
            cover={
                <div className="movie-card__image-container">
                    {loading && <Spin className="spinner" size="large" />}
                    <img
                        src={imageUrl}
                        alt=""
                        className={`movie-card__img ${loading ? "hidden" : ""}`}
                        onLoad={() => setLoading(false)}
                        onError={handleImageError}
                    />
                    {!movie.poster_path && (
                        <div className="movie-card__no-image">
                            <p>Нет изображения</p>
                        </div>
                    )}
                </div>
            }
        >
            <RatingCircle rating={movie.vote_average} />

            <Meta
                title={<div className="movie-card__title">{movie.title}</div>}
                description={
                    <>
                        <p className="release-date">
                            {movie.release_date
                                ? format(new Date(movie.release_date), "MMMM dd, yyyy")
                                : "Дата неизвестна"}
                        </p>

                        <div className="genres">
                            {movieGenres.length > 0
                                ? movieGenres.map((genre) => <Tag key={genre.id}>{genre.name}</Tag>)
                                : <Tag>Неизвестный жанр</Tag>}
                        </div>

                        <p className="overview">
                            {movie.overview ? movie.overview.slice(0, 100) + "..." : "Описание отсутствует"}
                        </p>

                        <Rate allowHalf value={userRating} onChange={handleRate} count={10} style={{ fontSize: "14px" }}/>
                    </>
                }
            />
        </Card>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        release_date: PropTypes.string,
        overview: PropTypes.string,
        poster_path: PropTypes.string,
        vote_average: PropTypes.number,
        genre_ids: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
};

export default MovieCard;
