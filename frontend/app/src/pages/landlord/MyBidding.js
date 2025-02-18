import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLandlordBiddingSessions } from "../../services/biddingServices"; // Fetch landlord's bidding sessions
import BiddingCardLandlord from "../../components/BiddingCardLandlord";
import { jwtDecode } from "jwt-decode";
import LandlordNavbar from "../../components/LandlordNavbar";

const MyBidding = () => {
  const [biddingSessions, setBiddingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const { userName } = decodedToken;

  useEffect(() => {
    const fetchBiddingSessions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getLandlordBiddingSessions(userName);
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

  const handleButtonClick = (sessionD) => {
    if (sessionD.status === "active") {
        console.log(sessionD.id);
      navigate(`/bidding/BiddingLandlord/${sessionD.id}`);
    } else if (sessionD.status === "ended") {
        localStorage.setItem(
            "receiverId",
            sessionD.id
          );
          navigate("/messages")
    }
  };
  return (
    <div className="background-container">
      <LandlordNavbar />
      <div className="p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Listings' Bidding Sessions</h1>
          <p className="text-gray-500 mt-2 text-sm">Monitor bidding sessions for your properties</p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-gray-700 text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Error</h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">{error}</p>
            </div>
          </div>
        ) : biddingSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {biddingSessions.map((session) => {
//              const listing = listingsMap[session.listing_id] || {};
              return (
                <BiddingCardLandlord
                  key={session.session_id}
                  session={session}
                  listing={session.listing}
                  onButtonClick={(sessionD) => handleButtonClick(sessionD)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center mt-12">
            <div className="text-center bg-white shadow-lg p-8 rounded-lg max-w-sm">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">No Active Bidding Sessions</h2>
              <p className="text-sm text-gray-500 mb-4 leading-snug">
                You currently have no active bidding sessions. List a property to start bidding.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBidding;
