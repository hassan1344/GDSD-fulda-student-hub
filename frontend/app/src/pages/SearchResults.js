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
    advancedFilters = {},
  } = state || {};

  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const address = encodeURIComponent(location);
        const minRent = priceRange[0];
        const maxRent = priceRange[1];

        const amenities = Object.keys(advancedFilters)
          .filter((key) => advancedFilters[key])
          .map((key) => `"${key}"`)
          .join(",");
//
        const apiUrl = `https://fulda-student-hub.publicvm.com/api/v1/properties?address=${address}&minRent=${minRent}&maxRent=${maxRent}${
          amenities ? `&amenities=${encodeURIComponent(amenities)}` : ""
        }`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }

        // Log the raw response before parsing
        const rawData = await response.text();
        console.log("Raw response data:", rawData); // Log raw response

        // Try parsing JSON
        const data = JSON.parse(rawData);
        console.log("Parsed data:", data);

        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setListings([]);
      }
    };

    fetchListings();
  }, [location, priceRange, advancedFilters]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedListings = listings.slice(startIndex, endIndex);

  const handleSelectProperty = (property) => setSelectedProperty(property);
  const handleBackToResults = () => setSelectedProperty(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {selectedProperty ? (
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

          <div className="grid grid-cols-1 gap-6">
            {paginatedListings.length > 0 ? (
              paginatedListings.map((listing) => (
                <SearchCard
                  key={listing.property_id}
                  image={listing.Media[0]?.mediaUrl || "/default.jpg"}
                  description={listing.amenities.join(", ")}
                  price={`€${listing.rent}`}
                  poster={`${listing.landlord.first_name} ${listing.landlord.last_name}`}
                  onClick={() => handleSelectProperty(listing)}
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
