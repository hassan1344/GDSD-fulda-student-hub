import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { getBiddingStatus } from "../../services/biddingServices";
import LandlordNavbar from "../../components/LandlordNavbar";

const BIDDING_SERVER_URL = process.env.REACT_APP_SOCKET_BASE_URL;

const BiddingLandlord = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [startingPrice, setStartingPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [highestBid, setHighestBid] = useState({
    status: "",
    highest_bid: 0,
    highest_bidder: null,
  });
  const [bidders, setBidders] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState("idle");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const bidStatus = async () => {
    //   try {
    //     const data = await getBiddingStatus(listingId);
    //     if(data.isBid && data.bidStatus === "active"){
    //       console.log("bidstaut");
    //       socket.emit("joinBidding", { listingId });
    //       setBiddingStatus("active");
    //     }
    //   } catch (error) {
    //     console.error("Error loading status:", error);
    //   } finally {
    //   }
    // };

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Authentication required.");
      navigate("/login");
      return;
    }

    const newSocket = io(BIDDING_SERVER_URL, { query: { token } });
    setSocket(newSocket);

    if (biddingStatus === "active" && socket) {
      socket.emit("joinBidding", { listingId });
    }

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

    //    bidStatus();

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const bidStatus = async () => {
      if (socket) {
        // Check if socket is initialized
        try {
          const data = await getBiddingStatus(listingId);
          if (data.isBid && data.bidStatus === "active") {
            socket.emit("joinBidding", { listingId }); // Now socket should be defined
            setBiddingStatus("active");
          }
        } catch (error) {
          console.error("Error loading status:", error);
        }
      }
    };

    bidStatus();
  }, [socket, listingId]);

  // Start the bidding session
  const handleStartBidding = () => {
    if (!startingPrice || !duration) {
      alert("Please provide both starting price and duration.");
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const endTime = Date.now() + duration * 60 * 1000; // Duration in minutes
    console.log(listingId, startingPrice, endTime);

    const endsAt = new Date(endTime).toISOString(); // Ensure correct format

    socket.emit("startBidding", {
      listingId,
      startingPrice: parseFloat(startingPrice),
      endsAt,
    });

    setBiddingStatus("active");
    alert("Bidding session started!");
  };

  // End the bidding session
  const handleEndBidding = () => {
    socket.emit("endBidding", { listingId });
    setBiddingStatus("ended");
  };

  return (
    <div className="background-container">
      <LandlordNavbar />

      <div className="p-8">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Join Bidding Session
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Participate in the bidding process and place your bid
          </p>
        </header>
      </div>

      {biddingStatus !== "active" ? (
        <div className="flex justify-center mt-12">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Starting Price (€)
            </label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              disabled={biddingStatus === "active"}
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              disabled={biddingStatus === "active"}
            />
          </div>
          <div className="flex justify-end space-x-4">
            {biddingStatus !== "active" && (
              <button
                onClick={handleStartBidding}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Start Bidding
              </button>
            )}
            <button
              onClick={() => {
                navigate("/landlord/my-prop-listings");
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Back to Listings
            </button>
          </div>
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
              <strong>Total Bids:</strong> {bidders.length || "No bids yet"}
            </p>
          </div>

          {/* Bidder List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Bid History</h3>
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
                <p className="text-gray-500 text-center">No bids placed yet.</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          {biddingStatus === "ended" && (
            <p className="text-lg text-gray-600">
              Bidding has ended. Final highest bid: €{highestBid.highest_bid}.
            </p>
          )}
          {biddingStatus === "active" && (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleEndBidding}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                End Bidding
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiddingLandlord;
