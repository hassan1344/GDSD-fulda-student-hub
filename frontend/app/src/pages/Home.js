import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Disclaimer from "../components/Disclaimer";
import SearchCard from "../components/SearchCard";
import { fetchProperties } from "../services/propertyServices";
import PropertyDetails from "../components/PropertyDetails";

const Home = () => {
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    shower: false,
    heater: false,
    kitchen: false,
    balcony: false,
  });

  const [properties, setProperties] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch properties without filters on component mount
    const fetchDefaultProperties = async () => {
      try {
        const data = await fetchProperties("", [0, 1000], {});
        setProperties(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchDefaultProperties();
  }, []);

  const handleToggleFilter = (filter) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSearch = () => {
    navigate("/searchresults", {
      state: {
        location,
        roomType,
        priceRange,
        advancedFilters,
      },
    });
  };

  // Handler to select a property
  const handleSelectProperty = (property) => {
    setSelectedProperty(property); // Select a property to view in detail
  };

  const handleBackToResults = () => {
    setSelectedProperty(null); // Reset selected property
  };

  return (
    <div className="background-container">
      {/* Navigation Bar */}
      <Navbar />

      {selectedProperty ? (
        // Render PropertyDetails if a property is selected
        <PropertyDetails
          property={selectedProperty}
          onBack={handleBackToResults}
        />
      ) : (

      <div className="flex justify-center mt-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Find Your Perfect Accommodation
          </h2>

          <SearchBar
            location={location}
            setLocation={setLocation}
            roomType={roomType}
            setRoomType={setRoomType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <button
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transition duration-200 w-full"
          >
            {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
          </button>

          {/* Advanced Search Section */}
          {showAdvanced && (
            <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Advanced Filters
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["shower", "heater", "kitchen", "balcony"].map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center space-x-3 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={advancedFilters[filter]}
                      onChange={() => handleToggleFilter(filter)}
                      className="w-5 h-5 text-blue-500 focus:ring-blue-400 rounded"
                    />
                    <span>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="mt-8 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow-lg transition duration-200 w-full"
          >
            Let’s Go
          </button>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Featured Listings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <SearchCard
                    key={property.property_id}
                    image={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${property.Media[0]?.mediaUrl}` || "/default.jpg"}
                    description={property.amenities.join(", ")}
                    price={`€${property.rent}`}
                    poster={`${property.landlord.first_name} ${property.landlord.last_name}`}
                    onClick={() => handleSelectProperty(property)}
                  />
                ))
              ) : (
                <p className="text-gray-600 text-center">
                  Loading featured listings...
                </p>
              )}
            </div>

            {/* View More Placeholder */}
            <div className="mt-4 text-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">
                View More
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      <div className="pb-16"></div> 

      <Disclaimer />
    </div>
  );
};

export default Home;
