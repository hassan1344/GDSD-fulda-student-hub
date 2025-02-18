import React, { useState, useEffect } from "react"; // Import useState
import { FaGavel, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const BiddingCardStudent = ({ session, listing, userName, onButtonClick }) => {
  const [selectedApplicationId, setSelectedApplicationId] = useState();

  const userBid = session.Bids.find((bid) => bid.bidder_id === userName);
  const userHighestBid = userBid ? userBid.amount : 0;
  const didUserWin =
    session.status === "ended" && session.highest_bidder === userName;

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
      {/* Pricing & Bidding Details */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="flex items-center gap-2">
          <FaGavel className="text-blue-500" />
          <strong>Starting Price:</strong>{" "}
          <span>€{session.starting_price}</span>
        </p>
        <p className="flex items-center gap-2">
          <FaGavel className="text-green-500" />
          <strong>Your Highest Bid:</strong> <span>€{userHighestBid}</span>
        </p>
        <p className="flex items-center gap-2">
          <FaGavel className="text-yellow-500" />
          <strong>Highest Bid Overall:</strong>{" "}
          <span>€{session.highest_bid}</span>
        </p>
        <p className="flex items-center gap-2">
          <strong>Status:</strong>{" "}
          <span
            className={`font-medium ${
              session.status === "active" ? "text-green-600" : "text-red-500"
            }`}
          >
            {session.status === "active" ? "Active" : "Ended"}
          </span>
        </p>
      </div>
      {/* Win/Loss Message */}
      {session.status === "ended" && (
        <p
          className={`font-bold flex items-center mt-3 ${
            didUserWin ? "text-green-600" : "text-red-500"
          }`}
        >
          {didUserWin ? (
            <>
              <FaCheckCircle className="text-green-500 mr-1" />
              You Won This Bidding!
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-500 mr-1" />
              You Lost This Bidding
            </>
          )}
        </p>
      )}
      {/* View Details Button */}
      {session.status === "active" && (
        <button
          onClick={() => onButtonClick({id: session.listing_id, status: session.status})}
          className="mt-4 w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          Join Session
        </button>
      )}
      {session.status === "ended" && didUserWin && (
        <button
          onClick={() => onButtonClick({id: session.listing_id, status: session.status})}
          className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          View Details
        </button>
      )}
    </div>
  );
};

export default BiddingCardStudent;
