import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import apiClient from "../services/apiClient"; // Use secure API client

const CONTRACT_ADDRESS = "0x4b14e3e650f8159106c98e4ea550628a8b22b382"; 
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "landlord", type: "address" }],
    name: "getPaymentsByLandlord",
    outputs: [
      {
        components: [
          { internalType: "address", name: "payer", type: "address" },
          { internalType: "string", name: "listingTitle", type: "string" },
          { internalType: "string", name: "listingId", type: "string" },
          { internalType: "uint256", name: "date", type: "uint256" },
          { internalType: "uint256", name: "amount", type: "uint256" }
        ],
        internalType: "struct RentalManagement.Payment[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "landlord", type: "address" },
      { internalType: "string", name: "listingTitle", type: "string" },
      { internalType: "string", name: "listingId", type: "string" }
    ],
    name: "payRent",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];

const USD_TO_ETH_CONVERSION_RATE = 3000; // 1 ETH = 3000 USDT

const ApplicationCard = ({
  application_id,
  listing_id,
  application_status,
  appliedAt,
  title,
  description,
  roomType,
  rent, // Rent in USDT
  onViewDetails
}) => {
  const [loading, setLoading] = useState(false);
  const [landlordWallet, setLandlordWallet] = useState(null);
  const [blockchainTxEnabled, setBlockchainTxEnabled] = useState(false);

  // Fetch landlord's wallet & status when component loads
  useEffect(() => {
    const fetchLandlordWallet = async () => {
      if (!listing_id) {
        console.warn("No listing_id provided, skipping wallet fetch.");
        return;
      }

      try {
        console.log(`Fetching wallet for listing_id: ${listing_id}`);
        const response = await apiClient.get(
          `/blockchain-config/wallet-by-listing/${listing_id}`,
          { requireToken: true }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          setLandlordWallet(response.data.wallet);
          setBlockchainTxEnabled(true);
        } else {
          setLandlordWallet(null);
          setBlockchainTxEnabled(false);
        }
      } catch (error) {
        console.error("Error fetching landlord wallet:", error);
        setLandlordWallet(null);
        setBlockchainTxEnabled(false);
      }
    };

    fetchLandlordWallet();
  }, [listing_id]); // Runs whenever listing_id changes

  const handlePayRent = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to make payments.");
      return;
    }

    if (!listing_id || !title || !landlordWallet) {
      alert("Error: Missing listing or wallet information.");
      return;
    }

    setLoading(true);

    try {
      console.log("Requesting MetaMask connection...");
      await window.ethereum.request({ method: "eth_requestAccounts" }); // **Ensure MetaMask is connected**

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress(); // ✅ Ensure user is properly connected
      console.log("User connected with address:", userAddress);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert rent from USDT to ETH and then to Wei
      const rentInETH = (rent / USD_TO_ETH_CONVERSION_RATE).toFixed(6); // Convert rent to ETH
      const rentInWei = ethers.utils.parseEther(rentInETH.toString()).div(100000000); // Convert ETH to Wei

      // Send transaction
      console.log("Sending transaction to:", landlordWallet);
      const tx = await contract.payRent(landlordWallet, title, listing_id, {
        value: rentInWei
      });

      await tx.wait();
      alert("Payment successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Payment failed. Please check console for details.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{new Date(appliedAt).toLocaleDateString()}</p>
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            application_status === "PENDING"
              ? "bg-yellow-200 text-yellow-700"
              : application_status === "APPROVED"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          } transition-all duration-300`}
        >
          {application_status}
        </span>
      </div>

      {/* Main Info Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">{title || "No Title"}</h2>
      <p className="text-sm text-gray-600 mb-4 leading-snug">{description || "No Description"}</p>

      {/* Room & Rent Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <p>
          <span className="font-semibold">Room Type:</span> {roomType || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Rent:</span> ${rent} USDT
        </p>
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(application_id)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300 shadow-md"
      >
        View Application Details
      </button>

      {/* Payment Button - Only if status is APPROVED & blockchain payments are enabled */}
      {application_status === "APPROVED" && blockchainTxEnabled && landlordWallet && (
        <button
          onClick={handlePayRent}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Pay Rent"}
        </button>
      )}
    </div>
  );
};

export default ApplicationCard;
