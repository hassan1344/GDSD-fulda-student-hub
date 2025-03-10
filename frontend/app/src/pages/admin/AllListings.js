import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordNavbar from '../../components/LandlordNavbar';
import { deleteListingAdmin, fetchAllListingsAdmin, updateListingAdmin } from '../../services/ListingServices';
import Navbar from '../../components/NavBar';

const AllListings = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchListings = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const data = await fetchAllListingsAdmin(token);
            if (data.success) {
                console.log("Listings", data.data);
                setListings(data.data);
            } else {
                setError(data.message || 'Failed to fetch listings');
            }
        } catch (error) {
            setError('Error fetching listings. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                const token = localStorage.getItem('accessToken');
                const data = await deleteListingAdmin(listingId, token);
                // Remove deleted listing from the state
                if (data.success) {
                    setListings(listings.filter(listing => listing.listing_id !== listingId));
                } else {
                    setError('Failed to delete listing');
                }
            } catch (error) {
                console.log("error", error.response.data.error)
                if (error.response?.data?.error && typeof error.response.data.error === "string" &&
                    error.response.data.error.includes("[AppYes]")) {
                    alert("Listing is associated with application(s) or bidding(s). Cannot delete");
                } else {
                    setError('Error deleting listing');
                }
            }
        }
    };

    /* Function to handle approval of a property by ID  */
    const handleApprove = async (listingId) => {
        if (window.confirm('Are you sure you want to approve this property?')) {
            try {
                const token = localStorage.getItem('accessToken');
                // Get selected listing
                let selectedListing = listings.find(listing => listing.listing_id == listingId);

                // Update status
                selectedListing.status = "Available";
                /* API call to approve the property from DB*/
                console.log("Selected Listing", selectedListing);
                const data = await updateListingAdmin(listingId, selectedListing);
                if (data.success) {
                    fetchListings();
                } else {
                    setError('Failed to delete property');
                }
            } catch (error) {
                setError('Error deleting property');
            }
        }
    };

    /* Fetches all listings when the component mounts */
    useEffect(() => {
        fetchListings();
    }, []);

    //loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="text-2xl text-green-700">Loading...</div>
            </div>
        );
    }
    //error state
    if (error) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="text-2xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 relative z-0">
            <Navbar />
            <div className="container mx-auto px-4 py-8 relative z-0">
                <div className="flex flex-col items-center mb-12">
                    <div className="relative group">
                        <h1 className="text-5xl font-bold text-green-700 mb-4 relative z-10">
                            All Listings
                        </h1>
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-green-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
                    </div>
                    <div className="bg-white px-6 py-2 rounded-full shadow-md mb-8">
                        <span className="text-lg text-gray-600 font-medium">
                            Total Listings: {listings.length}
                        </span>
                    </div>

                </div>

                {listings.length === 0 ? (
                    <div className="text-center bg-white rounded-lg shadow-md p-8">
                        <p className="text-xl text-gray-600">No listings available.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {listings.map(listing => (
                            <div key={listing.listing_id} className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
                                <div className="flex flex-col md:flex-row">

                                    <div className="md:w-1/3">
                                        <div className="relative h-64 md:h-full">
                                            {listing.media && listing.media.length > 0 ? (
                                                <img
                                                    src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.media[0].media_url}`}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover p-4"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <span className="text-gray-400 text-lg">No image available</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <h2 className="text-3xl font-bold text-green-700 mb-4">
                                            {listing.title}
                                        </h2>
                                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                            {listing.description}
                                        </p>
                                        <div className="flex flex-wrap gap-3 mt-auto justify-center">
                                            <button
                                                onClick={() => navigate(`/admin/edit-prop-listing/${listing.listing_id}`)}
                                                className="flex-1 min-w-[130px] px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-base font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Edit Listing
                                            </button>

                                            <button
                                                onClick={() => handleDelete(listing.listing_id)}
                                                className="flex-1 min-w-[130px] px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-base font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Delete Listing
                                            </button>

                                            {listing.status === "Pending" && (
                                                <button
                                                    onClick={() => handleApprove(listing.listing_id)}
                                                    className="flex-1 min-w-[130px] px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
                                                >
                                                    Approve Listing
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AllListings;
