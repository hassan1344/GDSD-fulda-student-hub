import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchCard from "../components/SearchCard";
import Pagination from "../components/Pagination";
import PropertyDetails from "../components/PropertyDetails";
import { sampleProperty } from "../utils/sampleProperty"; // Import sampleProperty

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

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null); // To handle detailed view
  const itemsPerPage = 10;

  // Calculate the indices for slicing the data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Assuming sampleProperty is just a single property to display
  const paginatedData = sampleProperty.slice(startIndex, endIndex);

  // Handler to select a property
  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
  };

  // Handler to return to the search results
  const handleBackToResults = () => {
    setSelectedProperty(null);
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
            {/* Handle advanced filters if any */}
            <div className="text-gray-600">
              {Object.keys(advancedFilters)
                .filter((key) => advancedFilters[key])
                .map((key, index) => (
                  <p key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <SearchCard
                  key={index}
                  image={item.images[0]} // Use first image for search card
                  description={item.description}
                  price={item.totalRent}
                  poster={item.contact.name}
                  onClick={() => handleSelectProperty(item)} // Pass property data
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
            totalPages={Math.ceil(sampleProperty.length/ itemsPerPage)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
