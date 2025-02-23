import { useEffect, useContext, useState } from "react";
import PropTypes from "prop-types";
import { List, Pagination } from "antd";
import MovieCard from "../MovieCard/MovieCard";
import { MoviesContext } from "../../contexts/MoviesContext.jsx";
import ErrorAlert from "../Errors/ErrorAlert";
import LoadingIndicator from "../Loader/LoadingIndicator";
import "./MovieList.scss";

const MovieList = ({ movies, currentPage, totalPages, onPageChange }) => {
    const { query, setMovies } = useContext(MoviesContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const timer = setTimeout(() => {
            if (query.trim() !== "" && movies.length === 0) {
                setError("Фильмы не найдены. Попробуйте другой запрос.");
            } else {
                setError(null);
            }
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [movies, query]);

    useEffect(() => {
        if (query.trim() === "") {
            setMovies([]);
        }
    }, [query, setMovies]);

    return (
        <div className="movie-list-container">
            {loading && <LoadingIndicator />}
            {!loading && error && <ErrorAlert message={error} />}
            <List
                className="movie-list"
                grid={{ gutter: 16, column: 2 }}
                dataSource={movies}
                renderItem={(movie) => (
                    <List.Item key={movie.id}>
                        <MovieCard movie={movie} />
                    </List.Item>
                )}
            />
            {totalPages > 1 && (
                <Pagination
                    align="center"
                    current={currentPage}
                    pageSize={20}
                    showSizeChanger={false}
                    onChange={onPageChange}
                    total={totalPages * 20}
                    style={{ marginTop: 25 }}
                />
            )}
        </div>
    );
};

MovieList.propTypes = {
    movies: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default MovieList;
