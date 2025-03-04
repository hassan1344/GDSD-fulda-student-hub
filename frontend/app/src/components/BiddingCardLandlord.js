import React, { useState, useEffect } from "react";
import { FaGavel, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const BiddingCardLandlord = ({ session, listing, onButtonClick }) => {
  const highestBid = session.highest_bid || 0;
  const hasEnded = session.status === "ended";

  const calculateTimeLeft = () => {
    const endTime = session.ends_at;
    const difference = new Date(endTime) - new Date();
    if (difference <= 0) return "00:00:00";

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      key={session.session_id}
      className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 transition hover:shadow-xl"
    >
      {/* Listing Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {listing.title || "Unknown Listing"}
      </h2>
      <p className="text-gray-600 text-sm mb-3">
        {listing.description || "No description available"}
      </p>
      {/* Bidding Details */}
      <div className="bg-gray-100 p-4 rounded-lg">
        {!hasEnded && (
          <p className="flex items-center gap-2">
            <FaClock className="text-red-500" />
            <strong>Time Left:</strong>{" "}
            <span className="text-red-500">{timeLeft}</span>
          </p>
        )}

        <p className="flex items-center gap-2">
          <FaGavel className="text-blue-500" />
          <strong>Starting Price:</strong>{" "}
          <span>€{session.starting_price}</span>
        </p>
        <p className="flex items-center gap-2">
          <FaGavel className="text-yellow-500" />
          <strong>Highest Bid:</strong> <span>€{highestBid}</span>
        </p>
        <p className="flex items-center gap-2">
          <strong>Status:</strong>
          <span
            className={`font-medium ${
              session.status === "active" ? "text-green-600" : "text-red-500"
            }`}
          >
            {session.status === "active" ? "Active" : "Ended"}
          </span>
        </p>
      </div>
      {/* Highest Bidder Info */}
      {hasEnded && (
        <p
          className={`font-bold flex items-center mt-3 text-$
            {session.highest_bidder ? "green-600" : "red-500"}`}
        >
          {session.highest_bidder ? (
            <>
              <FaCheckCircle className="text-green-500 mr-1" />
              Won by: {session.highest_bidder}
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-500 mr-1" />
              No Winner
            </>
          )}
        </p>
      )}
      {/* Action Buttons */}
      {session.status === "active" && (
        <button
          onClick={() =>
            onButtonClick({ id: session.listing_id, status: session.status })
          }
          className={`mt-4 w-full text-white font-semibold py-2 rounded-lg transition-all duration-200 
            ${
              timeLeft === "00:00:00"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {timeLeft === "00:00:00" ? "End Session" : "Join Session"}{" "}
        </button>
      )}
      {session.status === "ended" && session.highest_bidder && (
        <button
          onClick={() =>
            onButtonClick({
              id: session.highest_bidder,
              status: session.status,
            })
          }
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          Contact Winner
        </button>
      )}
    </div>
  );
};

export default BiddingCardLandlord;
