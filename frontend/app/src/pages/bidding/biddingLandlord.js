import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getBiddingStatus } from "../../services/biddingServices";
import LandlordNavbar from "../../components/LandlordNavbar";
import { jwtDecode } from "jwt-decode";

const BIDDING_SERVER_URL = "https://fulda-student-hub.publicvm.com";

const BiddingLandlord = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();

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
  const [winner, setWinner] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const decodedToken = jwtDecode(accessToken);
    const { userName } = decodedToken;

    setUserName(userName);

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
      console.log(data);
      const hB = {
        status: "active",
        highest_bid: data.startingPrice,
        highest_bidder: null,
      };
      setHighestBid(hB);
      setBidders([]);
    });

    newSocket.on("joinedBidding", (data) => {
      if (data) {
        console.log(data);
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
        setStartingPrice(data.startingPrice);
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

      if (data?.winner) {
        console.log("Winner received:", data.winner);

        setWinner((prevWinner) => {
          const updatedWinner = { ...data.winner }; // Ensure the latest data is used
          console.log("Updated winner state:", updatedWinner);

          return updatedWinner; // Return the new state to ensure React updates it properly
        });

        alert(
          `Bidding ended. Winner: ${data.winner.userName} Highest Bid: €${data.winner.amount}`
        );
      }
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
            socket.emit("joinBidding", { listingId }, (response) => {
              console.log(response);
              if (response?.error) {
                alert(response.error);
              } else {
                setBiddingStatus("active");
              }
            });
          }
        } catch (error) {
          console.error("Error loading status:", error);
        }
      }
    };

    bidStatus();
  }, [socket, listingId]);

  useEffect(() => {
    if (winner?.userName && socket) {
      console.log("winnerUseEffect triggered:", winner);

      // Emit the event to create or get a conversation
      socket.emit("createConversation", {
        receiver_id: winner.userName, // Latest winner
      });

      console.log("Emitting createConversation for:", winner.userName);
    }
  }, [winner]); // Triggered when a new winner is set

  useEffect(() => {
    if (socket) {
      socket.on("createConversation", (conversation) => {
        if (!conversation) {
          console.error("Failed to create or receive conversation.");
          return;
        }
        console.log("createConversation");
        console.log(conversation);
        console.log("winner");
        console.log(winner);

        if (
          conversation.receiver_id === winner.userName ||
          (conversation.sender_id === winner.userName &&
            conversation.conversation_id)
        ) {
          setConversation(conversation);
        }
      });
    }
  }, [winner]);

  useEffect(() => {
    console.log("conversationUsereffect");
    console.log(conversation);
    if (conversation?.conversation_id && winner?.userName) {
      sendMessage();
    }
  }, [conversation]);

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

  const sendMessage = () => {
    if (!conversation?.conversation_id) {
      console.error("Cannot send message: conversation ID is missing.");
      return;
    }

    const winMessage = `Congratulations! 🎉 You have won the bidding for a listing with a bid of $${winner.amount}. Please contact the landlord to proceed.`;

    const payload = {
      sender_id: userName,
      message: winMessage,
      conversation_id: conversation.conversation_id,
      created_at: new Date().toISOString(),
    };

    console.log(payload);
    socket.emit("sendMessage", payload);
  };

  return (
    <div className="background-container">
      <LandlordNavbar />
      <div className="p-8 max-w-4xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Join Bidding Session</h1>
          <p className="text-gray-600 mt-2 text-base">Participate in the bidding process and place your bid</p>
        </header>

        {biddingStatus !== "active" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Starting Price (€)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                disabled={biddingStatus === "active"}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                disabled={biddingStatus === "active"}
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">Bidding Details</h2>
            
            <div className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="text-xl font-medium text-gray-700"><strong>Starting Price:</strong> <span className="text-green-600 font-bold ml-2">€{startingPrice || "N/A"}</span></p>
            <p className="text-xl font-medium text-gray-700"><strong>Current Highest Bid:</strong> <span className="text-green-600 font-bold ml-2">€{highestBid.highest_bid || "N/A"}</span></p>
              <p className="text-xl font-medium text-gray-700"><strong>Bidder:</strong> <span className="text-green-600 font-bold ml-2">{highestBid.highest_bidder || "N/A"}</span></p>
              <p className="text-lg text-gray-600 mt-2"><strong>Total Bids:</strong> {bidders.length || "No bids yet"}</p>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700">Bid History</h3>
              <div className="mt-3 bg-gray-50 p-4 rounded-lg shadow-inner max-h-40 overflow-y-auto">
                {bidders.length > 0 ? (
                  <ul className="space-y-3">
                    {bidders.map((bid, index) => (
                      <li key={index} className="flex justify-between bg-white p-3 rounded-lg shadow">
                        <span className="text-gray-800 font-medium">{bid.bidder_id}</span>
                        <span className="text-green-600 font-semibold">€{bid.amount}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center">No bids placed yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {biddingStatus !== "active" && (
            <button
              onClick={handleStartBidding}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Start Bidding
            </button>
          )}
          <button
            onClick={() => navigate("/landlord/my-prop-listings")}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Navigate to Listings
          </button>
          {biddingStatus === "active" && (
            <button
              onClick={handleEndBidding}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              End Bidding
            </button>
          )}
        </div>
      </div>
    </div>

  );
};

export default BiddingLandlord;
