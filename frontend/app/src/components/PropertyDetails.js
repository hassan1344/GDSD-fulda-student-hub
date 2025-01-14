import React, { useState } from "react";
import ApplicationForm from "./ApplicationForm";

const PropertyDetails = ({ listing, onBack }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            <p>{listing.title}</p>
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
          <div>
            <p className="text-yellow-500">
              Trust Score: {listing.property.landlord.trust_score} ⭐
            </p>
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
      <div className="mb-6 flex">
        {/* Main Image */}
        <div className="w-3/4 pr-4">
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
          <>
            {/* Thumbnail Sidebar */}
            <div className="w-1/4 space-y-2 overflow-y-auto max-h-96">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`https://fulda-student-hub.s3.eu-north-1.amazonaws.com/public/uploads/images/${image.mediaUrl}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-md cursor-pointer ${
                    index === currentImageIndex
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
      <div className="flex space-x-4 mb-6 border-b">
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
        >
          Apply Now
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default PropertyDetails;
