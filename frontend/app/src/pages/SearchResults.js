import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchCard from "../components/SearchCard";
import Pagination from "../components/Pagination";
import PropertyDetails from "../components/PropertyDetails";
import { fetchProperties } from "../services/propertyServices";
import Disclaimer from "../components/Disclaimer";

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
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  // Fetch listings from the API
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProperties(
          location,
          priceRange,
          advancedFilters
        );
        setListings(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [location, priceRange, advancedFilters]);

  // Calculate the indices for slicing the data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Paginate data
  const paginatedListings = listings.slice(startIndex, endIndex);

  console.log(paginatedListings, "heherere");

  // Handler to select a property
  const handleSelectProperty = (property) => {
    setSelectedProperty(property); // Select a property to view in detail
  };

  // Handler to return to the search results
  const handleBackToResults = () => {
    setSelectedProperty(null); // Reset selected property
  };

  return (
    <div className="background-container">
      <Navbar />
      {selectedProperty ? (
        // Render PropertyDetails if a property is selected
        <PropertyDetails
          property={selectedProperty}
          onBack={handleBackToResults}
        />
      ) : (
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Search Results
          </h2>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Applied Filters:
            </h3>
            {location && <p className="text-gray-600">Location: {location}</p>}
            {roomType && <p className="text-gray-600">Room Type: {roomType}</p>}
            <p className="text-gray-600">
              Price Range: €{priceRange[0]} - €{priceRange[1]}
            </p>
            {/* Display active advanced filters */}
            <div className="text-gray-600">
              {Object.keys(advancedFilters)
                .filter((key) => advancedFilters[key])
                .map((key, index) => (
                  <p key={index}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </p>
                ))}
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : paginatedListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                {paginatedListings.map((listing) => (
                  <SearchCard
                    key={listing.property_id}
                    image={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.Media[0]?.mediaUrl}` || "/default.jpg"}
                    description={listing.amenities.join(", ")}
                    price={`€${listing.rent}`}
                    poster={`${listing.landlord.first_name} ${listing.landlord.last_name}`}
                    onClick={() => handleSelectProperty(listing)}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={Math.ceil(listings.length / itemsPerPage)}
              />
            </>
          ) : (
            <p className="text-center text-gray-500">
              No results found. Try a different search.
            </p>
          )}
        </div>
      )}

      <div className="pb-16"></div>

      <Disclaimer />
    </div>
  );
};

export default SearchResults;