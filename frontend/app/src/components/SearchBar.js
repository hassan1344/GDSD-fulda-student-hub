import React, { useState, useEffect } from "react"; // Import useState
import { Range } from "react-range"; // Import the Range component from react-range
import { getAllRoomTypes } from "../services/utilServices";

const SearchBar = ({
  location,
  setLocation,
  roomType,
  setRoomType,
  priceRange,
  setPriceRange,
}) => {
  const [roomtypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(true); // Handle loading state for room types
  const [roomTypeName, setRoomTypeName] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRoomTypes = await getAllRoomTypes();
        setRoomTypes(fetchedRoomTypes);
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    fetchData();
  }, []);

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
        onChange={(e) => {
          const selectedId = e.target.value;
          setRoomType(selectedId);
        }}
        className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Room Type</option>
        {loadingRoomTypes
          ? <option disabled>Loading...</option>
          : roomtypes.map((room) => (
            <option
              key={room.room_type_id}
              value={JSON.stringify({
                id: room.room_type_id,
                name: room.room_type_name,
              })}
            >
              {room.room_type_name}
            </option>
          )
          )}
      </select>

      {/* Price Range Slider */}
      <div className="flex flex-col items-center flex-1">
        <div className="mb-2 text-gray-700 font-medium">
          <span>€{priceRange[0]} - €{priceRange[1]}</span>
        </div>
        <Range
          values={priceRange} // Current values for the price range
          step={1} // Step value for the slider
          min={0} // Minimum value
          max={2000} // New maximum value (can be customized as needed)
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
      </div>
    </div>
  );
};

export default SearchBar;
