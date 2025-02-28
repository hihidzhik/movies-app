import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const GenresContext = createContext();

const GenresProvider = ({ children }) => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    "https://api.themoviedb.org/3/genre/movie/list?api_key=26cac6af0befbcf81304d2de00cab399&language=en-US"
                );
                if (!response.ok) {
                    throw new Error("Ошибка при получении жанров");
                }
                const data = await response.json();
                setGenres(data.genres || []);
            } catch (error) {
                console.error("Ошибка при загрузке жанров:", error);
            }
        };

        fetchGenres();
    }, []);

    return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
};

GenresProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { GenresContext, GenresProvider };
