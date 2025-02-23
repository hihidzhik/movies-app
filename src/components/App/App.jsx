import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tabs, Alert } from "antd";
import MovieList from "../MovieList/MovieList";
import SearchBar from "../SearchBar/SearchBar";
import { MoviesContext } from "../../contexts/MoviesContext";
import { fetchMovies } from "../../api/api";
import "./App.scss";

const App = () => {
    const { movies, setMovies, ratedMovies, sessionId, query, setQuery, error } = useContext(MoviesContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadMovies = async () => {
            if (!query) return;
            try {
                const { results, total_pages } = await fetchMovies(query, currentPage);
                setMovies(results || []);
                setTotalPages(total_pages || 1);
            } catch (err) {
                console.error("Ошибка загрузки фильмов:", err);
            }
        };

        loadMovies();
    }, [query, currentPage, setMovies]);

    const handleSearch = (value) => {
        setQuery(value || "");
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="app-container">
            {error && <Alert message={error} type="error" showIcon closable />}
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Search" key="1">
                    <SearchBar onSearch={handleSearch} />
                    <MovieList
                        movies={movies}
                        sessionId={sessionId}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Rated" key="2">
                    <MovieList movies={ratedMovies} sessionId={sessionId} currentPage={1} totalPages={1} onPageChange={() => {}} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

App.propTypes = {
    movies: PropTypes.array,
    ratedMovies: PropTypes.array,
    sessionId: PropTypes.string,
    query: PropTypes.string,
    setQuery: PropTypes.func,
    error: PropTypes.string,
};

export default App;
