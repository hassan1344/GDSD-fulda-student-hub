import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchCard from "../components/SearchCard";
import Pagination from "../components/Pagination";
import { dummyData } from "../utils/dummyData";

const SearchResults = () => {
  const { state } = useLocation();
  const { location, roomType, priceRange } = state || {};

  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Search Results for "{location || "All Locations"}" -{" "}
          {roomType || "All Room Types"}
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {dummyData.length > 0 ? (
            dummyData.map((item, index) => (
              <SearchCard
                key={index}
                image={item.image}
                description={item.description}
                price={item.price}
                poster={item.poster}
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
          totalPages={5}
        />
      </div>
    </div>
  );
};

export default SearchResults;
