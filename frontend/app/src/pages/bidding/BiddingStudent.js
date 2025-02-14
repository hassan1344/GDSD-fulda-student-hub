import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import Navbar from "../../components/NavBar";

const BIDDING_SERVER_URL = process.env.REACT_APP_SOCKET_BASE_URL;

const BiddingStudent = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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
      setHighestBid(data.highestBid);
      alert(`Bidding ended. Final highest bid: €${data.amount}`);
    });

    newSocket.on("userLeft", (data) => {
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

    newSocket.on("error", (message) => alert(message));

    return () => newSocket.disconnect();
  }, []);

  const handleJoinBidding = () => {
    if (!listingId || !socket) {
      alert("Invalid listing ID or socket not connected.");
      return;
    }
    socket.emit("joinBidding", { listingId });
    setBiddingStatus("active");
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
    <div className="background-container">
      <Navbar />
      <div className="p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Join Bidding Session
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Participate in the bidding process and place your bid
          </p>
        </header>

        {biddingStatus !== "active" ? (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleJoinBidding}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Join Bidding
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Bidding Details
            </h2>

            {/* Display Current Highest Bid */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
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
              <p className="text-lg text-gray-600 mt-2">
                <strong>Total Bids:</strong>{" "}
                {bidders.length || "No bids yet"}
              </p>
            </div>

            {/* Bidder List */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Bid History
              </h3>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-inner max-h-40 overflow-y-auto">
                {bidders.length > 0 ? (
                  <ul className="space-y-3">
                    {bidders.map((bid, index) => (
                      <li
                        key={index}
                        className="flex justify-between bg-white p-3 rounded-lg shadow"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 transition"
                placeholder="Enter bid amount"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={handlePlaceBid}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
              >
                Place Bid
              </button>
              <button
                onClick={handleLeaveBidding}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all transform hover:scale-105"
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
