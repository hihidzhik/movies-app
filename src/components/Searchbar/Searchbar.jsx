import { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { debounce } from "lodash";
import { MoviesContext } from "../../contexts/MoviesContext";

const SearchBar = () => {
    const { setQuery, setMovies } = useContext(MoviesContext);
    const [searchTerm, setSearchTerm] = useState("");

    const [debouncedSearch] = useState(() =>
        debounce((value) => {
            if (value.trim() !== "") {
                setQuery(value);
            }
        }, 500)
    );


    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length === 0) {
            setQuery("");
            setMovies([]);
        } else {
            debouncedSearch(value);
        }
    };

    return (
        <Input
            placeholder="Введите название фильма"
            value={searchTerm}
            onChange={handleChange}
            allowClear
        />
    );
};

SearchBar.propTypes = {
    setQuery: PropTypes.func,
    setMovies: PropTypes.func,
};

export default SearchBar;
