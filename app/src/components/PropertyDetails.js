import React, { useState } from "react";

const PropertyDetails = ({ property, onBack }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images ?? [];
  const { address, rent, amenities } = property.property;
  const { name, phone_number, trust_score } = property.landlord;

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div>
            <p>{property.description}</p>
            <p className="mt-4 font-semibold">Amenities:</p>
            <ul className="list-disc ml-5">
              {amenities?.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              )) || <li>No amenities listed</li>}
            </ul>
          </div>
        );
      case "reviews":
        return (
          <div>
            <p className="text-yellow-500">Trust Score: {trust_score} ⭐</p>
          </div>
        );
      case "contact":
        return (
          <div>
            <p className="font-semibold">Landlord Name: {name}</p>
            <p>Phone: {phone_number}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="p-8">
      <button onClick={onBack} className="text-blue-600 mb-4">Back to Results</button>
      <h1 className="text-2xl font-bold mb-4">{property.title}</h1>

      {/* Image Gallery */}
      <div className="flex justify-center items-center mb-6">
        <div className="w-full max-w-2xl h-64 relative">
          <img
            src={images[currentImageIndex] || "/assets/images/room1.jpg"}
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
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Total Rent:</strong> €{rent}</p>
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
