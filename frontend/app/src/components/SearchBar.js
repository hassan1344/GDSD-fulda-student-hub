import React, { useState } from "react"; // Import useState
import { Range } from "react-range"; // Import the Range component from react-range

const SearchBar = ({ location, setLocation, roomType, setRoomType, priceRange, setPriceRange }) => {
 
  const handleChange = (values) => {
    setPriceRange(values); // Update priceRange when values change
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4">
      {/* Location Input */}
      <input
        type="text"
        placeholder="Location or Postal Code"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      />

      {/* Room Type Select */}
      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Room Type</option>
        <option value="single">Single Apartment</option>
        <option value="shared">Shared Apartment</option>
        <option value="private">Private Room</option>
      </select>

      {/* Price Range Slider */}
      <div className="flex items-center flex-1">
        <Range
          values={priceRange} // Current values for the price range
          step={1} // Step value for the slider
          min={0} // Minimum value
          max={1000} // New maximum value (can be customized as needed)
          onChange={handleChange} // Update the priceRange when the slider value changes
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                backgroundColor: "#ddd",
                borderRadius: "4px",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ index, props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
              }}
            />
          )}
        />
        <span className="ml-3 text-gray-700 font-medium">
          €{priceRange[0]} - €{priceRange[1]} {/* Display selected price range */}
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
