import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";
import apiClient from "../services/apiClient";
import { getReviewsForALandlord } from "../services/reviewServices";

import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const PropertyDetails = ({ listing, onBack }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true); // tracks if location data is being fetched

  const navigate = useNavigate();
  const location = useLocation(); //
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      setLoadingLocation(true);
      try {
        if (!listing?.property?.address) {
          setLocationData(null);
          setLoadingLocation(false);
          return;
        }

        const response = await apiClient.get(
          `/services/nearest-services?address=${listing.property.address}`
        );

        if (!response.data || Object.keys(response.data).length === 0) {
          setLocationData(null);
          setLoadingLocation(false);
          return;
        }

        setLocationData(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
        setLocationData(null);
      }
      setLoadingLocation(false);
    };

    fetchLocationData();

    const fetchReviews = async () => {
      try {
        const response = await getReviewsForALandlord(listing.listing_id);
        setReviewData(response);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };
    fetchReviews();
  }, [listing]);

  if (!listing) {
    return (
      <div className="text-center text-red-500">
        No property details available.
      </div>
    );
  }

  // Ensure we have media array to work with
  const images = listing.Media ?? [];

  // Handle showing the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle showing the previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Render content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div>
            <p><span className="mt-4 font-semibold">Description:</span> {listing.description}</p>
            <p className="mt-4 font-semibold">Amenities:</p>
            <ul className="list-disc ml-5">
              {listing.property.PropertyAmenity &&
                listing.property.PropertyAmenity.map((amenity, index) => (
                  <li key={index}>{amenity.Amenity?.amenity_name}</li>
                ))}
            </ul>
          </div>
        );

      case "reviews":
        return (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-yellow-500 text-lg font-semibold">
              Trust Score: {listing.trustScore} ⭐
            </p>
            <p
              className={`mt-2 text-sm font-medium ${listing.trustScore >= 0.7
                  ? "text-green-600"
                  : listing.trustScore >= 0.4
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
            >
              {listing.decisionMessage}
            </p>

            {/* reviews section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>
              <div className="mt-4">
                {reviewData.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  reviewData.map((review, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white mb-4 rounded-lg shadow-sm"
                    >
                      <p className="font-medium text-gray-700">
                        {review.reviewerName}
                      </p>
                      <p className="text-yellow-500">{review.rating} ⭐</p>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "location":
        if (loadingLocation) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-center flex-col">
              {/* Spinner */}
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
              <p className="text-gray-600 font-medium">Fetching map data...</p>
              <style>
                {`
                  .loader {
                    border-top-color: #3498db;
                    animation: spinner 1.5s linear infinite;
                  }
                  @keyframes spinner {
                    0% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}
              </style>
            </div>
          );
        }

        if (!locationData) {
          return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">
                We were unable to retrieve location data for this address.
                Please verify the address or contact support if the problem persists.
              </p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <style>
              {`
                    .property-marker {
                      font-size: 32px;
                      line-height: 1;
                      transform: translateY(-50%);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    }
                    .marker-text {
                      font-size: 12px;
                      background: rgba(255, 255, 255, 0.9);
                      padding: 2px 6px;
                      border-radius: 4px;
                      margin-top: -8px;
                      font-weight: 500;
                      white-space: nowrap;
                    }
                    .amenity-marker {
                      width: 20px;
                      height: 20px;
                      font-size: 12px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: white;
                      border-radius: 50%;
                      border: 1px solid #ccc;
                      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    }
                    .marker-label {
                      position: absolute;
                      white-space: nowrap;
                      font-size: 12px;
                      background: rgba(255,255,255,0.9);
                      padding: 2px 6px;
                      border-radius: 4px;
                      margin-left: 8px;
                      pointer-events: none;
                    }
                  `}
            </style>
            <div>
              <h3 className="text-lg font-semibold mb-4"></h3>
              <ul className="space-y-3">
                {locationData && (
                  <>
                    <li>
                      🏪 Supermarket: {locationData.supermarket.distance} (
                      {locationData.supermarket.name})
                    </li>
                    <li>
                      🏥 Hospital: {locationData.hospital.distance} (
                      {locationData.hospital.name})
                    </li>
                    <li>
                      🚌 Bus Stop: {locationData.busStop.distance} (
                      {locationData.busStop.name})
                    </li>
                    <li>
                      🚆 Bahnhof: {locationData.railwayStation.distance} (
                      {locationData.railwayStation.name})
                    </li>
                    <li>
                      🎓 University: {locationData.distanceFromUniversity}
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              {locationData?.location && (
                <Map
                  initialViewState={{
                    latitude: locationData.location.latitude,
                    longitude: locationData.location.longitude,
                    zoom: 14,
                  }}
                  mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=yh2OTlBPkPrwSMlLTl9e"
                >
                  {/* Main Property Marker */}
                  <Marker
                    latitude={locationData.location.latitude}
                    longitude={locationData.location.longitude}
                  >
                    <div className="property-marker">
                      📍
                      <span className="marker-text">Property</span>
                    </div>
                  </Marker>

                  {/* Amenity Markers */}
                  <Marker
                    latitude={locationData.supermarket.lat}
                    longitude={locationData.supermarket.lon}
                  >
                    <div className="amenity-marker">🛒</div>
                    <div className="marker-label">
                      Supermarket ({locationData.supermarket.distance})
                    </div>
                  </Marker>

                  <Marker
                    latitude={locationData.hospital.lat}
                    longitude={locationData.hospital.lon}
                  >
                    <div className="amenity-marker">🏥</div>
                    <div className="marker-label">
                      Hospital ({locationData.hospital.distance})
                    </div>
                  </Marker>

                  <Marker
                    latitude={locationData.busStop.lat}
                    longitude={locationData.busStop.lon}
                  >
                    <div className="amenity-marker">🚌</div>
                    <div className="marker-label">
                      Bus Stop ({locationData.busStop.distance})
                    </div>
                  </Marker>

                  <Marker
                    latitude={locationData.railwayStation.lat}
                    longitude={locationData.railwayStation.lon}
                  >
                    <div className="amenity-marker">🚆</div>
                    <div className="marker-label">
                      Bahnhof ({locationData.railwayStation.distance})
                    </div>
                  </Marker>

                  {/* University Marker */}
                  <Marker
                    latitude={50.5667} // Replace with actual university coordinates from your API
                    longitude={9.6833}
                  >
                    <div className="amenity-marker">🎓</div>
                    <div className="marker-label">
                      University ({locationData.distanceFromUniversity})
                    </div>
                  </Marker>
                </Map>
              )}
            </div>
          </div>
        );

      case "contact":
        return (
          <div>
            <p className="font-semibold">
              Landlord Name: {listing.property.landlord.first_name}
            </p>
            <p>Phone: {listing.property.landlord.phone_number}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-2"
              onClick={() => {
                // Store the landlord's user ID in localStorage to access on the Messages page
                localStorage.setItem(
                  "receiverId",
                  listing.property.landlord.user_id
                );
                window.location.href = "/app/messages";
              }}
            >
              Contact
            </button>
          </div>
        );
      case "apply":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Application Form</h3>
            <ApplicationForm listing_id={listing.listing_id} />
          </div>
        );
      case "bid":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bid Now</h3>
            <button
              className={`px-6 py-2 text-white font-semibold rounded-md shadow`}
              onClick={navigate(
                `/bidding/BiddingStudent/${listing.listing_id}`,
                {
                  state: { from: location.pathname }, // Store previous path
                }
              )}
            >
              Bid Now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
  <button onClick={onBack} className="text-blue-600 mb-4">
    Back to Results
  </button>
  <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>

  {/* Image Gallery */}
  <div className="mb-6 flex flex-col sm:flex-row">
    {/* Main Image */}
    <div className="w-full sm:w-3/4 sm:pr-4 mb-4 sm:mb-0">
      <div className="relative h-96">
        <img
          src={
            `https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${images[currentImageIndex]?.mediaUrl}` ??
            "/assets/images/room1.jpg"
          }
          alt="Property"
          className="w-full h-full object-cover rounded-md shadow-md"
        />

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={handlePreviousImage}
            >
              ◀
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              onClick={handleNextImage}
            >
              ▶
            </button>
          </>
        )}
      </div>
    </div>

    {images.length > 1 && (
      <div className="w-full sm:w-1/4 space-y-2 overflow-y-auto max-h-96">
        {images.map((image, index) => (
          <img
            key={index}
            src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${image.mediaUrl}`}
            alt={`Thumbnail ${index + 1}`}
            className={`w-full h-24 object-cover rounded-md cursor-pointer ${
              index === currentImageIndex ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    )}
  </div>

  {/* Property Details */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div>
      <p>
        <strong>Address:</strong> {listing.property.address}
      </p>
      <p>
        <strong>Total Rent:</strong> €{listing.rent}
      </p>
    </div>
  </div>

  {/* Tabs */}
  <div className="flex flex-wrap mb-6 border-b">
    <button
      onClick={() => setActiveTab("about")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "about"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
    >
      About
    </button>
    <button
      onClick={() => setActiveTab("reviews")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "reviews"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
    >
      Reviews
    </button>
    <button
      onClick={() => setActiveTab("location")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "location"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
    >
      Nearby Services
    </button>
    <button
      onClick={() => setActiveTab("contact")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "contact"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
    >
      Contact
    </button>
    <button
      onClick={() => setActiveTab("apply")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "apply"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
      style={{ display: listing.isBidding === false ? "block" : "none" }}
    >
      Apply Now
    </button>
    <button
      onClick={() => setActiveTab("bid")}
      className={`py-2 px-4 transition-all duration-200 ${
        activeTab === "bid"
          ? "border-b-2 border-blue-600 font-bold text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:font-medium"
      }`}
      style={{ display: listing.isBidding === true ? "block" : "none" }}
    >
      Bid Now
    </button>
  </div>

  {/* Tab Content */}
  <div className="bg-gray-100 p-4 rounded-md shadow-md">{renderContent()}</div>
</div>

  );
};

export default PropertyDetails;
