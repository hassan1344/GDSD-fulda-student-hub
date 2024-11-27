import React, { useState } from 'react';

const PropertyDetails = ({ property, onBack }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ensure we have media array to work with
  const images = property.Media ?? [];

  // Handle showing the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Handle showing the previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Render content for each tab
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div>
            <p>{property.description}</p>
            <p className="mt-4 font-semibold">Amenities:</p>
            <ul className="list-disc ml-5">
              {Array.isArray(property.amenities) && property.amenities.length > 0 ? (
                property.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))
              ) : (
                <li>No amenities listed</li>
              )}
            </ul>
          </div>
        );
      case "reviews":
        return (
          <div>
            <p className="text-yellow-500">Trust Score: {property.landlord.trust_score} ⭐</p>
          </div>
        );
      case "contact":
        return (
          <div>
            <p className="font-semibold">Landlord Name: {property.landlord.name}</p>
            <p>Phone: {property.landlord.phone_number}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <button onClick={onBack} className="text-blue-600 mb-4">Back to Results</button>
      <h1 className="text-2xl font-bold mb-4">{property.title}</h1>

      {/* Image Gallery */}
      <div className="flex justify-center items-center mb-6">
        <div className="w-full max-w-2xl h-64 relative">
          {/* Show the current image from the Media array */}
          <img
            src={images[currentImageIndex]?.mediaUrl ?? "/assets/images/room1.jpg"} // Default image if no media found
            alt="Property"
            className="w-full h-full object-cover rounded-md shadow-md"
          />
          {/* Previous button */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            onClick={handlePreviousImage}
          >
            ◀
          </button>
          {/* Next button */}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            onClick={handleNextImage}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p><strong>Address:</strong> {property.address}</p>
          <p><strong>Total Rent:</strong> €{property.rent}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button onClick={() => setActiveTab("about")} className={`py-2 px-4 ${activeTab === "about" ? "border-b-2 border-blue-600 font-bold" : ""}`}>About</button>
        <button onClick={() => setActiveTab("reviews")} className={`py-2 px-4 ${activeTab === "reviews" ? "border-b-2 border-blue-600 font-bold" : ""}`}>Reviews</button>
        <button onClick={() => setActiveTab("contact")} className={`py-2 px-4 ${activeTab === "contact" ? "border-b-2 border-blue-600 font-bold" : ""}`}>Contact</button>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-100 p-4 rounded-md shadow-md">{renderContent()}</div>
    </div>
  );
};

export default PropertyDetails;
