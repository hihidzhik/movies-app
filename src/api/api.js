const API_KEY = "26cac6af0befbcf81304d2de00cab399";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query, page = 1) => {
    try {
        if (!query) return { results: [], total_pages: 1 };
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}&language=en-US&include_adult=false`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки фильмов");

        const data = await response.json();
        return { results: data.results || [], total_pages: data.total_pages || 1 };
    } catch (error) {
        console.error("Ошибка API:", error);
        return { results: [], total_pages: 1 };
    }
};

export const createGuestSession = async () => {
    try {
        const response = await fetch(`${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`);
        if (!response.ok) throw new Error("Ошибка создания гостевой сессии");

        const data = await response.json();
        return data.guest_session_id;
    } catch (error) {
        console.error("Ошибка в createGuestSession:", error);
        return null;
    }
};

export const rateMovie = async (movieId, rating, sessionId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: rating }),
            }
        );
        if (!response.ok) throw new Error("Ошибка добавления рейтинга");

        return await response.json();
    } catch (error) {
        console.error("Ошибка в rateMovie:", error);
        return null;
    }
};

export const fetchRatedMovies = async (sessionId) => {
    if (!sessionId) return [];
    try {
        const response = await fetch(
            `${BASE_URL}/guest_session/${sessionId}/rated/movies?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) throw new Error("Ошибка загрузки оцененных фильмов");

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Ошибка в fetchRatedMovies:", error);
        return [];
    }
};

export const fetchGenres = async () => {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) throw new Error("Ошибка загрузки жанров");

        const data = await response.json();
        return data.genres || [];
    } catch (error) {
        console.error("Ошибка в fetchGenres:", error);
        return [];
    }
};

export const deleteRating = async (movieId, sessionId) => {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionId}`,
            { method: "DELETE", headers: { "Content-Type": "application/json" } }
        );
        if (!response.ok) throw new Error("Ошибка удаления рейтинга");

        return await response.json();
    } catch (error) {
        console.error("Ошибка в deleteRating:", error);
        return null;
    }
};
