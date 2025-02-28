import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Disclaimer from "../components/Disclaimer";
import SearchCard from "../components/SearchCard";
import PropertyDetails from "../components/PropertyDetails";
import { getAllAmenities } from "../services/utilServices";
import { fetchListings, fetchScheduledMeetings } from "../services/searchListingServices";
import {
  getAllActiveBiddings,
  getListingsByIds,
} from "../services/biddingServices";

const Home = () => {
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [listings, setListings] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [uniqueAmenities, setUniqueAmenities] = useState([]);
  const [activeBiddings, setActiveBiddings] = useState([]);
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [fetchedListings, fetchedAmenities, fetchedBiddings] =
          await Promise.all([
            fetchListings({}),
            getAllAmenities(),
            getAllActiveBiddings(),
          ]);
        setListings(fetchedListings.slice(0, 5));
        setAmenities(fetchedAmenities);

        const listingIds =
          fetchedBiddings.length > 0
            ? fetchedBiddings.map((bid) => bid.listing_id)
            : [];

        getListingsByIds(listingIds).then((bidListings) => {
          setActiveBiddings(bidListings);
        });

        // Normalize amenities to lowercase and replace underscores with spaces
        const normalizedAmenities = [];
        const seenAmenities = new Set();

        fetchedAmenities.forEach((amenity) => {
          const normalizedName = amenity.amenity_name
            .toLowerCase()
            .replace(/_/g, " "); // Replaces underscores with spaces
          if (!seenAmenities.has(normalizedName)) {
            seenAmenities.add(normalizedName);
            normalizedAmenities.push(amenity);
          }
        });

        setUniqueAmenities(normalizedAmenities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchScheduledMeeting = async () => {
      const data = await fetchScheduledMeetings();
      console.log(73, data);
      setTableData(data);
    }

    fetchInitialData();
    fetchScheduledMeeting();
  }, []);

  const handleToggleFilter = (filter) => {
    setAdvancedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSearch = () => {
    let selectedRoomType = null;

    if (roomType) {
      try {
        selectedRoomType = JSON.parse(roomType);
      } catch (error) {
        console.error("Invalid roomType value:", error);
        selectedRoomType = null;
      }
    }

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
          name: selectedRoomType?.name || null,
        },
        amenities: selectedAmenities,
      },
    });
  };

  const handleViewMore = () => {
    navigate("/searchresults");
  };

  const handleSelectProperty = (property, isBidding = false) => {
    setSelectedProperty({ ...property, isBidding });
  };

  const handleBackToResults = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="background-container">
      <Navbar />

      {selectedProperty ? (
        <PropertyDetails
          listing={selectedProperty}
          onBack={handleBackToResults}
        />
      ) : (
        <div className="flex justify-center mt-12 relative">
          {}
          <div className="w-1/5 bg-white p-4 shadow-lg h-screen overflow-y-auto absolute left-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h3>
            <div className="panel-body text-gray-700">
              {tableData.map((row, index) => (
                <div key={index} className="mb-6">
                  <br />
                   {row.landlord.user_id} has scehedueld meeting on {(new Date(row.date)).toUTCString()}.
                  <br /><br />
                </div>
              ))}
            </div>
          </div>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Advanced Filters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {uniqueAmenities.length > 0 ? (
                    uniqueAmenities.map((filter) => (
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
                          {filter.amenity_name
                            .replace(/_/g, " ") // Display without underscores
                            .replace(/\b\w/g, (char) =>
                              char.toUpperCase()
                            )}{" "}
                          {/* Capitalize first letter */}
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

              {activeBiddings.length === 0 ? (
                <p className="text-gray-600 text-center mb-4">
                  No current active biddings.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Featured Listings */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Featured Listings
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
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
                            onClick={() => handleSelectProperty(listing, false)}
                          />
                        ))
                      ) : (
                        <p className="text-gray-600 text-center">
                          Loading featured listings...
                        </p>
                      )}
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handleViewMore}
                      >
                        View More
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Active Biddings */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">
                      Active Biddings
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                      {activeBiddings.map((bidding) => (
                        <SearchCard
                          key={bidding.listing_id}
                          image={
                            `https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${bidding.Media[0]?.mediaUrl}` ||
                            "/default.jpg"
                          }
                          description={bidding.description}
                          price={`Current Bid: €${bidding.rent // || bidding.starting_price
                            }`}
                          poster={`${bidding.property.landlord.first_name} ${bidding.property.landlord.last_name}`}
                          onClick={() => handleSelectProperty(bidding, true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pb-16"></div>
    </div>
  );
};

export default Home;
