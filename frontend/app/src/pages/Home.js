import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    shower: false,
    heater: false,
    kitchen: false,
    balcony: false,
  });
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
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

          {showAdvanced && (
            <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Advanced Filters</h3>
              <div className="grid grid-cols-2 gap-4">
                {["shower", "heater", "kitchen", "balcony"].map((filter) => (
                  <label key={filter} className="flex items-center space-x-3 text-gray-700">
                    <input
                      type="checkbox"
                      checked={advancedFilters[filter]}
                      onChange={() => handleToggleFilter(filter)}
                      className="w-5 h-5 text-blue-500 focus:ring-blue-400 rounded"
                    />
                    <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Home;