import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchCard from "../components/SearchCard";
import Pagination from "../components/Pagination";
import PropertyDetails from "../components/PropertyDetails";
import { fetchListings } from "../services/searchListingServices";
import Disclaimer from "../components/Disclaimer";

const SearchResults = () => {
  const { state } = useLocation();

  // State for API results
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const { location, priceRange, roomType, amenities } = state || {};

  const createPayload = useCallback(() => {
    const payload = {};
    if (location) payload.address = location;
    if (priceRange && priceRange.length === 2) {
      payload.minRent = priceRange[0];
      payload.maxRent = priceRange[1];
    }
    if (roomType?.id) payload.roomType = roomType.id;
    if (amenities?.length > 0) {
      // Create a unique list of amenity names (case-insensitive and no duplicates)
      const amenityNames = [...new Set(amenities.map((amenity) => amenity.name.toLowerCase()))];
      payload.amenities = JSON.stringify(amenityNames);
    }
    return payload;
  }, [location, priceRange, roomType, amenities]);
  
  useEffect(() => {
    const fetchData = async () => {
      const payload = createPayload();
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchListings(payload);
        setListings(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading properties:", error);
        setError("Failed to load properties.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [createPayload]);

  // Ensure paginated listings are always recalculated
  const paginatedListings = useMemo(() => {
    return listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [listings, currentPage]);

  const handleSelectProperty = (property, isBidding = false) => {
    setSelectedProperty({ ...property, isBidding });
  };

  const handleBackToResults = () => {
    setSelectedProperty(null);
  };

  // Function to normalize and filter amenity names
  const normalizeAmenities = (amenities) => {
    const seenAmenities = new Set();
    return amenities
      .map((amenity) => amenity.name.replace(/_/g, " ").toLowerCase()) // Replace _ with space and convert to lowercase
      .filter((amenity) => {
        if (seenAmenities.has(amenity)) return false;
        seenAmenities.add(amenity);
        return true;
      })
      .map((amenity) => amenity.charAt(0).toUpperCase() + amenity.slice(1)); // Capitalize the first letter
  };

  const normalizedAmenities = normalizeAmenities(amenities || []);

  return (
    <div className="background-container">
      <Navbar />

      {selectedProperty ? (
        <PropertyDetails
          listing={selectedProperty}
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
            {roomType?.name && (
              <p className="text-gray-600">Room Type: {roomType.name}</p>
            )}
            {priceRange && (
              <p className="text-gray-600">
                Price Range: €{priceRange[0]} - €{priceRange[1]}
              </p>
            )}
            <div className="text-gray-600">
              {normalizedAmenities?.length > 0 ? (
                normalizedAmenities.map((amenity, index) => (
                  <p key={index}>{amenity}</p>
                ))
              ) : (
                <p>No amenities selected.</p>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : paginatedListings.length > 0 ? (
            <>
            {console.log("HERERE", paginatedListings)}
            {console.log("HERERE", listings)}
              <div className="grid grid-cols-1 gap-6">
                {paginatedListings.map((listing) => (
                  <SearchCard
                    key={listing.listing_id}
                    image={
                      `https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.Media[0]?.mediaUrl}` ||
                      "/default.jpg"
                    }
                    description={listing.title}
                    price={`€${listing.rent}`}
                    poster={`${listing.property.landlord?.first_name} ${listing.property.landlord?.last_name}`}
                    onClick={() => {
                      handleSelectProperty(listing);
                    }}
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
    </div>
  );
};

export default SearchResults;
