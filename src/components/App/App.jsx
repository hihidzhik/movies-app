import { useContext, useState, useEffect } from "react";
import { Tabs, Alert } from "antd";
import MovieList from "../MovieList/MovieList";
import SearchBar from "../Searchbar/Searchbar";
import { MoviesContext } from "../../contexts/MoviesContext";
import { fetchMovies } from "../../api/api";
import "./App.scss";

const App = () => {
    const {
        movies,
        setMovies,
        ratedMovies,
        sessionId,
        query,
        setQuery,
        error,
        loadRatedMovies
    } = useContext(MoviesContext);

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
            <Tabs
                defaultActiveKey="1"
                onChange={(key) => {
                    if (key === "2") loadRatedMovies();
                }}
            >
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
                    <MovieList movies={ratedMovies} sessionId={sessionId} />
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default App;
