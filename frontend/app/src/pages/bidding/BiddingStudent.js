import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "../../components/NavBar";

const BIDDING_SERVER_URL = "http://localhost:8000";

const BiddingStudent = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentBid, setCurrentBid] = useState("");
  const [highestBid, setHighestBid] = useState({
    status: "",
    highest_bid: 0,
    highest_bidder: null,
  });
  const [bidders, setBidders] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState("idle");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication required.");
      navigate("/login");
      return;
    }

    const newSocket = io(BIDDING_SERVER_URL, { query: { token } });
    setSocket(newSocket);

    newSocket.on("biddingStarted", (data) => {
      setBiddingStatus("active");
      setHighestBid(data.startingPrice);
      setBidders([]);
    });

    newSocket.on("joinedBidding", (data) => {
      console.log(data);
      if (data) {
        const highestBid = data.bids.length
          ? data.bids.reduce((max, bid) =>
              bid.amount > max.amount ? bid : max
            )
          : null;

        const bidder_dets = {
          status: "active",
          highest_bid: highestBid?.amount || 0,
          highest_bidder: highestBid?.bidder_id || null,
        };
        setHighestBid(bidder_dets);
        setEndTime(data.endsAt);
        setStartingPrice(data.startingPrice);
      }

      setBidders(data.bids);
    });

    newSocket.on("updateBids", (data) => {
      if (data) {
        const highestBid = data.bids.length
          ? data.bids.reduce((max, bid) =>
              bid.amount > max.amount ? bid : max
            )
          : null;

        const bidder_dets = {
          status: "active",
          highest_bid: highestBid?.amount || 0,
          highest_bidder: highestBid?.bidder_id || null,
        };

        setHighestBid(bidder_dets);
      }

      setBidders(data.bids);
    });

    newSocket.on("biddingEnded", (data) => {
      setBiddingStatus("ended");
      alert(`Bidding ended. Final highest bid: €${data.winner.amount}`);
    });

    newSocket.on("userLeft", (data) => {
      if (data?.bids) {
        const highestBid = data.bids.length
          ? data.bids.reduce((max, bid) =>
              bid.amount > max.amount ? bid : max
            )
          : null;

        const bidder_dets = {
          status: "active",
          highest_bid: highestBid?.amount || 0,
          highest_bidder: highestBid?.bidder_id || null,
        };

        setHighestBid(bidder_dets);
      }

      setBidders(data.bids);
    });

    newSocket.on("error", (message) => alert(message));

    return () => newSocket.disconnect();
  }, []);

  const calculateTimeLeft = (endTime) => {
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const handleJoinBidding = () => {
    if (!listingId || !socket) {
      alert("Invalid listing ID or socket not connected.");
      return;
    }
    socket.emit("joinBidding", { listingId }, (response) => {
      console.log(response);
      if (response?.error) {
        alert(response.error);
      } else {
        setBiddingStatus("active");
      }
    });
  };

  const handlePlaceBid = () => {
    if (!currentBid || currentBid <= highestBid.highest_bid) {
      alert("Please place a valid bid higher than the current highest bid.");
      return;
    }
    socket.emit("placeBid", { listingId, amount: parseFloat(currentBid) });
    setCurrentBid("");
  };

  const handleLeaveBidding = () => {
    if (!socket) return;
    socket.emit("leaveBidding", { listingId });
    setBiddingStatus("idle");
  };

  return (
    <div className="background-container min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Join Bidding Session
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Participate in the bidding process and place your bid
          </p>
        </header>

        {biddingStatus !== "active" ? (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleJoinBidding}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Join Bidding
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              Bidding Details
            </h2>

            {/* Display Current Highest Bid */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
              <p className="text-lg text-red-500 mt-3 font-bold">
                <strong>Time Left:</strong> {timeLeft}
              </p>
              <p className="text-xl font-medium text-gray-700">
                <strong>Starting Price:</strong>
                <span className="text-green-600 font-bold ml-2">
                  €{startingPrice || "N/A"}
                </span>
              </p>
              <p className="text-xl font-medium text-gray-700">
                <strong>Current Highest Bid:</strong>
                <span className="text-green-600 font-bold ml-2">
                  €{highestBid.highest_bid || "N/A"}
                </span>
              </p>
              <p className="text-xl font-medium text-gray-700">
                <strong>Bidder:</strong>
                <span className="text-green-600 font-bold ml-2">
                  {highestBid.highest_bidder || "N/A"}
                </span>
              </p>
              <p className="text-lg text-gray-600 mt-3">
                <strong>Total Bids:</strong> {bidders.length || "No bids yet"}
              </p>
            </div>

            {/* Bidder List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Bid History
              </h3>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-inner max-h-48 overflow-y-auto">
                {bidders.length > 0 ? (
                  <ul className="space-y-3">
                    {bidders.map((bid, index) => (
                      <li
                        key={index}
                        className="flex justify-between bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
                      >
                        <span className="text-gray-800 font-medium">
                          {bid.bidder_id}
                        </span>
                        <span className="text-green-600 font-semibold">
                          €{bid.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">
                    No bids placed yet.
                  </p>
                )}
              </div>
            </div>

            {/* Bid Input Field */}
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Your Bid (€)
              </label>
              <input
                type="number"
                value={currentBid}
                onChange={(e) => setCurrentBid(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 transition shadow-sm"
                placeholder="Enter bid amount"
                min="1"
              />
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <button
                onClick={handlePlaceBid}
                disabled={timeLeft === "00:00:00"}
                className={`px-8 py-4 text-white text-lg font-medium rounded-xl shadow-md transition-all transform hover:scale-105
                  ${timeLeft === "00:00:00" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              >
                Place Bid
              </button>
              <button
                onClick={handleLeaveBidding}
                className="px-8 py-4 bg-red-600 text-white text-lg font-medium rounded-xl shadow-md hover:bg-red-700 transition-all transform hover:scale-105"
              >
                Leave Bidding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiddingStudent;
