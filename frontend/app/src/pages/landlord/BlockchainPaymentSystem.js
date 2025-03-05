import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers'; // For ethers v5
import apiClient from '../../services/apiClient';


// Contract info on Sepolia
const CONTRACT_ADDRESS = '0x4B14E3E650f8159106C98E4EA550628A8B22B382';
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"landlord","type":"address"}],"name":"getPaymentsByLandlord","outputs":[{"components":[{"internalType":"address","name":"payer","type":"address"},{"internalType":"string","name":"listingTitle","type":"string"},{"internalType":"string","name":"listingId","type":"string"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct RentalManagement.Payment[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"landlord","type":"address"},{"internalType":"string","name":"listingTitle","type":"string"},{"internalType":"string","name":"listingId","type":"string"}],"name":"payRent","outputs":[],"stateMutability":"payable","type":"function"}];


const BlockchainPaymentSystem = () => {
  const { property_id } = useParams();

  // Original state for config
  const [config, setConfig] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [txEnabled, setTxEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const [paymentLogs, setPaymentLogs] = useState([]);

  // 1) Fetch property details from backend
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const res = await apiClient.get(`/blockchain-config/property/${property_id}`, {
          requireToken: true,
        });
        if (res.data?.success) {
          setConfig(res.data.data);
          setWalletAddress(res.data.data.landlord_wallet_address);
          setTxEnabled(res.data.data.blockchain_tx_enabled);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setConfig(null);
          setWalletAddress('');
          setTxEnabled(true);
        } else {
          setError('Failed to load configuration');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyDetails();
  }, [property_id]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!config?.landlord_wallet_address) return; // Skip if no wallet
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  
        // Query logs for the configured landlord's wallet
        const rawLogs = await contract.getPaymentsByLandlord(config.landlord_wallet_address);
  
        // Convert raw logs to readable format
        const logs = rawLogs.map((p) => ({
          payer: p.payer,
          listingTitle: p.listingTitle,
          date: new Date(p.date.toNumber() * 1000).toLocaleString(),
          amountWei: ethers.utils.formatEther(p.amount).toString(),
        }));
  
        setPaymentLogs(logs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };
  
    fetchLogs();
  }, [config?.landlord_wallet_address]); // Runs on mount + whenever walletAddress updates
  

  // Connect/Disconnect user wallet 
  const handleWalletAction = async () => {
    try {
      if (walletAddress) {
        // Disconnect
        setWalletAddress('');
        return;
      }
      if (!window.ethereum) throw new Error('Please install MetaMask!');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error('Wallet action failed:', err);
      setError(err.message);
    }
  };

  // Submit config changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const method = config ? 'put' : 'post';
      const url = config ? `/blockchain-config/${config.id}` : '/blockchain-config';

      const response = await apiClient[method](
        url,
        { property_id, wallet_address: walletAddress, blockchain_tx_enabled: txEnabled },
        { requireToken: true }
      );

      setSuccess(response.data.message);
      setConfig(response.data.data);

      // Refresh
      const refresh = await apiClient.get(`/blockchain-config/property/${property_id}`, {
        requireToken: true,
      });
      setConfig(refresh.data.data);
    } catch (err) {
      console.error('Operation failed:', err);
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  // Delete config
  const handleDelete = async () => {
    try {
      if (!config?.id) return;
      await apiClient.delete(`/blockchain-config/${config.id}`, { requireToken: true });
      setConfig(null);
      setWalletAddress('');
      setShowDelete(false);
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete configuration');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      {/* Container for main panel + logs panel */}
      <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-8">
        {/* Main Panel (unchanged) */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Blockchain Payment Configuration</h1>
          </div>

          {config && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-700">Current Configuration</h2>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Configured Wallet:</strong> {config?.landlord_wallet_address || 'No wallet configured'}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Transaction Status:</strong>{' '}
                {config.blockchain_tx_enabled ? 'Enabled (Accepting payments)' : 'Disabled (Payments paused)'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Last updated:</strong>{' '}
                {config.updated_at ? new Date(config.updated_at).toLocaleString() : 'N/A'}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-700">Update Configuration</h3>

            {/* Wallet Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Wallet Configuration</p>
                <button
                  type="button"
                  onClick={handleWalletAction}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    walletAddress
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-mono break-all">
                  {walletAddress || 'No wallet connected'}
                </p>
              </div>
            </div>

            {/* Transaction Toggle */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700">Transaction Settings</p>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-700">Blockchain Transactions</p>
                  <p className="text-sm text-gray-500">
                    {txEnabled ? 'Enabled - Accepting payments' : 'Disabled - Payments paused'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTxEnabled(!txEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    txEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      txEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              {config && (
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete Configuration
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {config ? 'Save Changes' : 'Activate Blockchain Payments'}
              </button>
            </div>
          </form>

          {showDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md">
                <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  This will permanently remove all blockchain payment settings for this property.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Logs Panel */}
        <div className="w-full lg:w-80 bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            On-Chain Payment Logs
          </h2>
          {paymentLogs.length === 0 ? (
            <p className="text-sm text-gray-600 mb-4">
              No logs found for <code>{config?.landlord_wallet_address}</code>.
            </p>
          ) : (
            paymentLogs.map((log, idx) => (
              <div key={idx} className="bg-gray-50 p-3 mb-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Payer:</strong> {log.payer}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Title:</strong> {log.listingTitle}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Amount:</strong> {log.amountWei}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Date:</strong> {log.date}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockchainPaymentSystem;
