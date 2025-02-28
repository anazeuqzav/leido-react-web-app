import PropTypes from "prop-types";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <span>
      {Array.from({ length: totalStars }, (_, index) =>
        index < rating ? "★" : "☆"
      )}
    </span>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;