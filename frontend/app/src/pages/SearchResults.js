import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchCard from "../components/SearchCard";
import Pagination from "../components/Pagination";
import PropertyDetails from "../components/PropertyDetails";

const SearchResults = () => {
  const { state } = useLocation();
  const {
    location = "",
    roomType = "",
    priceRange = [0, 1000],
    advancedFilters = {
      shower: false,
      heater: false,
      kitchen: false,
      balcony: false,
    },
  } = state || {};

  // State to hold listings fetched from API
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null); // To handle detailed view
  const itemsPerPage = 10;

  // Fetch listings from the API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const address = location;  // Get location from search state
        const minRent = priceRange[0];
        const maxRent = priceRange[1];

        const response = await fetch(
          `http://localhost:8000/api/v1/properties?address=${encodeURIComponent(address)}&minRent=${minRent}&maxRent=${maxRent}`
        );

        const data = await response.json();
        console.log("Fetched data:", data); // Log the response to check the structure
        setListings(data);  // Set the data fetched from API
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchListings();
  }, [location, priceRange]);

  // Calculate the indices for slicing the data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Paginate data
  const paginatedListings = listings.slice(startIndex, endIndex);

  // Handler to select a property
  const handleSelectProperty = (property) => {
    setSelectedProperty(property); // Select a property to view in detail
  };

  // Handler to return to the search results
  const handleBackToResults = () => {
    setSelectedProperty(null); // Reset selected property
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {selectedProperty ? (
        // Render PropertyDetails if a property is selected
        <PropertyDetails property={selectedProperty} onBack={handleBackToResults} />
      ) : (
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Results</h2>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Applied Filters:</h3>
            {location && <p className="text-gray-600">Location: {location}</p>}
            {roomType && <p className="text-gray-600">Room Type: {roomType}</p>}
            <p className="text-gray-600">Price Range: €{priceRange[0]} - €{priceRange[1]}</p>
            {/* Display active advanced filters */}
            <div className="text-gray-600">
              {Object.keys(advancedFilters)
                .filter((key) => advancedFilters[key])
                .map((key, index) => (
                  <p key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {paginatedListings.length > 0 ? (
              paginatedListings.map((listing) => (
                <SearchCard
                  key={listing.property_id} // Use the property_id as the unique key
                  image={listing.Media[0]?.mediaUrl || "/default.jpg"} // Use the first image or a default image
                  title={listing.address}
                  description={listing.amenities}
                  price={`€${listing.rent}`}
                  landlord={listing.landlord.name}
                  onClick={() => handleSelectProperty(listing)} // Pass listing data
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No results found. Try a different search.
              </p>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(listings.length / itemsPerPage)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
