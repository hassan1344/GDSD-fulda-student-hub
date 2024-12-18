import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Disclaimer from "../components/Disclaimer";
import SearchCard from "../components/SearchCard";
import PropertyDetails from "../components/PropertyDetails";
import { getAllAmenities } from "../services/utilServices";
import { fetchListings } from "../services/searchListingServices";

const Home = () => {
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({
  });

  const [listings, setListings] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedListings, fetchedAmenities] = await Promise.all([
          fetchListings({}),
          getAllAmenities(),
        ]);
        setListings(fetchedListings.slice(0, 5));
        setAmenities(fetchedAmenities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchInitialData();
  }, []);
  
  const handleToggleFilter = (filter) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSearch = () => {
    let selectedRoomType = null;
  
    // Safely parse roomType only if it's not empty
    if (roomType) {
      try {
        selectedRoomType = JSON.parse(roomType);
      } catch (error) {
        console.error("Invalid roomType value:", error);
        selectedRoomType = null;
      }
    }
  
    console.log("Room ID:", selectedRoomType?.id || "None selected");
    console.log("Room Name:", selectedRoomType?.name || "None selected");
  
    const selectedAmenities = amenities
      .filter((amenity) => advancedFilters[amenity.amenity_name])
      .map((amenity) => ({
        id: amenity.amenity_id,
        name: amenity.amenity_name,
      }));
  
    navigate("/searchresults", {
      state: {
        location,
        priceRange,
        roomType: {
          id: selectedRoomType?.id || null,
          name: selectedRoomType?.name || null, // Fallback to null if not selected
        },
        amenities: selectedAmenities,
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
          listing={selectedProperty}
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
                  {amenities.length > 0 ? (
                    amenities.map((filter) => (
                      <label
                        key={filter.amenity_name}
                        className="flex items-center space-x-3 text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={
                            advancedFilters[filter.amenity_name] || false
                          }
                          onChange={() =>
                            handleToggleFilter(filter.amenity_name)
                          }
                          className="w-5 h-5 text-blue-500 focus:ring-blue-400 rounded"
                        />
                        <span>
                          {filter.amenity_name.charAt(0).toUpperCase() +
                            filter.amenity_name.slice(1)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p>Loading amenities...</p>
                  )}
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
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <SearchCard
                      key={listing.listing_id}
                      image={
                        `https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${listing.Media[0]?.mediaUrl}` ||
                        "/default.jpg"
                      }
                      description={listing.description}
                      price={`€${listing.rent}`}
                      poster={`${listing.property.landlord.first_name} ${listing.property.landlord.last_name}`}
                      onClick={() => handleSelectProperty(listing)}
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
