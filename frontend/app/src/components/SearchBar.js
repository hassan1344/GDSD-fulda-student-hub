const SearchBar = ({ location, setLocation, roomType, setRoomType, priceRange, setPriceRange }) => {
    return (
      <div className="flex flex-wrap md:flex-nowrap gap-4">
        <input
          type="text"
          placeholder="Location or Postal Code"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
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
        <div className="flex items-center flex-1">
          <input
            type="range"
            min="0"
            max="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
            className="w-full"
          />
          <span className="ml-3 text-gray-700 font-medium">€{priceRange[0]} - €{priceRange[1]}</span>
        </div>
      </div>
    );
  };
  
  export default SearchBar;
  