import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchMovies as fetchMoviesAPI, fetchRatedMovies, createGuestSession } from "../api/api";

export const MoviesContext = createContext();

const MoviesProvider = ({ children }) => {
    const getSessionId = () => {
        if (typeof window !== "undefined") {
            try {
                return localStorage.getItem("sessionId");
            } catch (err) {
                console.error("Ошибка при получении sessionId из localStorage:", err);
                return null;
            }
        }
        return null;
    };

    const [movies, setMovies] = useState([]);
    const [ratedMovies, setRatedMovies] = useState([]);
    const [sessionId, setSessionId] = useState(getSessionId());
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);

    const fetchMovies = async (searchQuery, page = 1) => {
        if (!searchQuery) return { results: [], total_pages: 1 };
        try {
            const { results, total_pages } = await fetchMoviesAPI(searchQuery, page);
            setMovies(results || []);
            return { results, total_pages };
        } catch (err) {
            console.error("Ошибка при загрузке фильмов:", err);
            setError("Ошибка загрузки фильмов. Попробуйте позже.");
            return { results: [], total_pages: 1 };
        }
    };

    useEffect(() => {
        const initSession = async () => {
            if (sessionId) {
                try {
                    const rated = await fetchRatedMovies(sessionId);
                    setRatedMovies(rated);
                } catch (err) {
                    console.error("Ошибка загрузки оцененных фильмов:", err);
                    setError("Ошибка загрузки оцененных фильмов.");
                }
            } else {
                try {
                    const newSession = await createGuestSession();
                    if (newSession) {
                        localStorage.setItem("sessionId", newSession);
                        setSessionId(newSession);
                        const rated = await fetchRatedMovies(newSession);
                        setRatedMovies(rated);
                    }
                } catch (err) {
                    console.error("Ошибка создания гостевой сессии:", err);
                    setError("Ошибка при создании гостевой сессии.");
                }
            }
        };
        initSession();
    }, [sessionId]);

    useEffect(() => {
        if (ratedMovies.length > 0) {
            localStorage.setItem("ratedMovies", JSON.stringify(ratedMovies));
        }
    }, [ratedMovies]);

    useEffect(() => {
        const updateRatedMovies = async () => {
            if (!sessionId) return;

            try {
                const rated = await fetchRatedMovies(sessionId);
                setRatedMovies((prev) => (JSON.stringify(prev) !== JSON.stringify(rated) ? rated : prev));
            } catch (err) {
                console.error("Ошибка загрузки оцененных фильмов:", err);
                setError("Ошибка загрузки оцененных фильмов.");
            }
        };

        updateRatedMovies();
    }, [sessionId]);

    return (
        <MoviesContext.Provider
            value={{
                movies,
                setMovies,
                ratedMovies,
                setRatedMovies,
                sessionId,
                setSessionId,
                query,
                setQuery,
                fetchMovies,
                error,
                setError,
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

MoviesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { MoviesProvider };
