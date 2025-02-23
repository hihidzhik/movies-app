import PropTypes from "prop-types";
import "./RatingCircle.scss";

const getRatingColor = (rating) => {
    if (rating >= 7) return "#66E900";
    if (rating >= 5) return "#E9D100";
    if (rating >= 3) return "#E97E00";
    return "#E90000";
};

const RatingCircle = ({ rating }) => (
    <div className="rating-circle" style={{ borderColor: getRatingColor(rating) }}>
        {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
    </div>
);

RatingCircle.propTypes = {
    rating: PropTypes.number,
};

export default RatingCircle;
