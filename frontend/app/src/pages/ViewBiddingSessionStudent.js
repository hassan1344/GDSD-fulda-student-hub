import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { getUserBiddingSessions } from "../services/biddingServices"; // Fetch user bidding sessions
import { getListingsByIds } from "../services/biddingServices"; // Fetch multiple listings at once
import { jwtDecode } from "jwt-decode";
import BiddingCardStudent from "../components/BiddingCardStudent";
//import BiddingSessionDetails from "../components/BiddingSessionDetails";

const ViewBiddingSessionStudent = () => {
  const [biddingSessions, setBiddingSessions] = useState([]);
  const [listingsMap, setListingsMap] = useState({});
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const decodedToken = jwtDecode(accessToken);
  const { userName, userType } = decodedToken;

  useEffect(() => {
    const fetchBiddingSessions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getUserBiddingSessions(userName);

        if (data.length === 0) {
          setBiddingSessions([]);
          return;
        }

        // Extract unique listing IDs
        const listingIds = [
          ...new Set(data.map((session) => session.listing_id)),
        ];

        // Fetch all listing details in one API call
        const listings = await getListingsByIds(listingIds);
        const listingsMap = listings.reduce((acc, listing) => {
          acc[listing.listing_id] = listing;
          return acc;
        }, {});

        setListingsMap(listingsMap);
        setBiddingSessions(data);
      } catch (error) {
        console.error("Error loading bidding sessions:", error);
        setError("Failed to load bidding sessions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBiddingSessions();
  }, [userName]);
  /*
  if (selectedSessionId) {
    return (
      <BiddingSessionDetails
        sessionId={selectedSessionId}
        onBack={() => setSelectedSessionId(null)}
      />
    );
  }
*/
  return (
    <div className="background-container">
      <Navbar />

      <div className="p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Bidding Sessions
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            View the auctions you participated in
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-gray-700 text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Error
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">{error}</p>
            </div>
          </div>
        ) : biddingSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {biddingSessions.map((session) => {
              const listing = listingsMap[session.listing_id] || {};
              return (
                <BiddingCardStudent
                key={session.session_id}
                session={session}
                listing={listing}
                userName={userName}
                onViewDetails={(id) => setSelectedSessionId(id)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                No Bidding Sessions Found
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">
                You haven't participated in any bidding sessions yet. Start
                bidding now!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBiddingSessionStudent;
