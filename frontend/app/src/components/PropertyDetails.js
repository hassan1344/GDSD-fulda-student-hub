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
              {
                property.amenities && property.amenities.split(',').map((amenity, index) => (
                <li key={index}>{amenity.trim()}</li>
                ))
              }
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
    <div className="p-8 max-w-6xl mx-auto">
      <button onClick={onBack} className="text-blue-600 mb-4">Back to Results</button>
      <h1 className="text-2xl font-bold mb-4">{property.title}</h1>

      {/* Image Gallery */}
      <div className="mb-6 flex">
        {/* Main Image */}
        <div className="w-3/4 pr-4">
          <div className="relative h-96">
            <img
              src={images[currentImageIndex]?.mediaUrl ?? "/assets/images/room1.jpg"}
              alt="Property"
              className="w-full h-full object-cover rounded-md shadow-md"
            />
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
          </div>
          
          {/* Image Preview Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail Sidebar */}
        <div className="w-1/4 space-y-2 overflow-y-auto max-h-96">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.mediaUrl}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full h-24 object-cover rounded-md cursor-pointer ${
                index === currentImageIndex ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
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