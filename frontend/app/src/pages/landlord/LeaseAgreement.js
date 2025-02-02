import React, { useState } from "react";
import LandlordNavbar from '../../components/LandlordNavbar';
import apiClient from "../../services/apiClient";

const LeaseAgreement = ({listingId='1234567890'}) => {
  const [formData, setFormData] = useState({
    landlordName: "",
    studentName: "",
    address: "",
    rent: "",
    security: "",
    leaseStartDate: "",
    leaseEndDate: "",
    landlordAddress: "",
    landlordSignature: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, landlordSignature: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Send the form data to generate the lease agreement
      // const response = await apiClient.post("/application/generate-lease", {
      //   landlordName: formData.landlordName,
      //   studentName: formData.studentName,
      //   address: formData.address,
      //   rent: formData.rent,
      //   security: formData.security,
      //   leaseStartDate: formData.leaseStartDate,
      //   leaseEndDate: formData.leaseEndDate,
      //   landlordAddress: formData.landlordAddress,
      // },{
      //   requireToken: true,
      //   responseType: 'blob'
      // });

      // Upload the landlord's signature
      const leaseFormData = new FormData();
      leaseFormData.append("landlord_signature", formData.landlordSignature);
      leaseFormData.append("landlordName", formData.landlordName);
      leaseFormData.append("studentName", formData.studentName);
      leaseFormData.append("address", formData.address);
      leaseFormData.append("rent", formData.rent);
      leaseFormData.append("security", formData.security);
      leaseFormData.append("leaseStartDate", formData.leaseStartDate);
      leaseFormData.append("leaseEndDate", formData.leaseEndDate);
      leaseFormData.append("landlordAddress", formData.landlordAddress);
      leaseFormData.append("listingId", listingId);

      const response = await apiClient.post("/application/generate-lease", leaseFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        requireToken: true,
        responseType: 'blob'
      });

      if (response.statusText !== "OK") {
        throw new Error(`Failed to download PDF: ${response.statusText}`);
      }

      if (response.data) {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPreviewUrl(pdfUrl);
      } else {
        throw new Error("Empty PDF data received");
      }

      alert("Lease agreement generated successfully.");
    } catch (error) {
      console.error("Error generating lease agreement:", error);
      alert("Failed to generate lease agreement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <LandlordNavbar />
      <div className="container mx-auto px-4 py-8">
        <button
          // onClick={() => navigate('/landlord/home')}
          className="mb-6 flex items-center text-green-700 hover:text-green-800 font-semibold transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </button>

        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Generate Lease Agreement</h1>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Landlord's Name</label>
              <input
                type="text"
                name="landlordName"
                value={formData.landlordName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Tenant's Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Address of Property</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Rent</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Security</label>
              <input
                type="number"
                name="security"
                value={formData.security}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Lease Start Date</label>
              <input
                type="date"
                name="leaseStartDate"
                value={formData.leaseStartDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Lease End Date</label>
              <input
                type="date"
                name="leaseEndDate"
                value={formData.leaseEndDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Landlord's Address</label>
              <input
                type="text"
                name="landlordAddress"
                value={formData.landlordAddress}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Landlord's Signature</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                // onClick={() => }
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                disabled={submitting}
              >
                {submitting ? "Generating..." : "Generate Lease Agreement"}
              </button>
            </div>
          </div>
        </form>

        {previewUrl && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-center text-green-700 mb-4">Lease Agreement Preview</h3>
            <iframe src={previewUrl} width="100%" height="600px" className="border border-gray-300 rounded-lg"></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaseAgreement;