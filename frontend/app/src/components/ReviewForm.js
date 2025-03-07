import React, { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({ rating, reviewText });

    setRating(0);
    setHover(0);
    setReviewText("");
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-medium text-gray-700">Leave a Review</h3>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;

          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={ratingValue <= (hover || rating) ? "#f59e0b" : "none"}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#f59e0b"
                className="w-6 h-6 cursor-pointer transition-colors"
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(rating)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.75.75 0 011.04 0l2.053 2.084 2.89.414c.82.117 1.148 1.13.555 1.71l-2.091 2.04.494 2.869c.14.812-.702 1.43-1.42 1.047L12 12.347l-2.545 1.337c-.718.383-1.56-.235-1.42-1.047l.494-2.869-2.091-2.04c-.593-.58-.265-1.593.555-1.71l2.89-.414 2.053-2.084z"
                />
              </svg>
            </label>
          );
        })}
      </div>

      <textarea
        className="w-full p-2 border border-gray-300 rounded-md mb-2"
        placeholder="Share your experience..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;
