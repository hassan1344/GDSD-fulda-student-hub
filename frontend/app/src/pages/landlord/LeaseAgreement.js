import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import LandlordNavbar from '../../components/LandlordNavbar';
import { generateLease } from "../../services/leaseService";
import { getApplicationByID } from "../../services/applicationServices";
import { fetchPropertyById } from "../../services/propertyServices";

const LeaseAgreement = (props) => {
  const location = useLocation();
  const { applicationId } = location.state || {};
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
  const [tenantUserName, setTenantUserName] = useState('');
  const [landlordId, setLandlordId] = useState('');
  const [listingId, setListingId] = useState('');

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [leaseData, setLeaseData] = useState(null);

  const accessToken = localStorage.getItem("accessToken");
  const decodedToken = jwtDecode(accessToken);
  const { userType } = decodedToken;

  useEffect(() => {
      const fetchApplications = async () => {
        setIsLoading(true);
        setError(null);
  
        try {
          let leaseData = {};
          const applicationData = await getApplicationByID(applicationId, userType);
          const listing = applicationData.listing;
          setListingId(listing.listing_id);
          leaseData = {...leaseData, studentName: applicationData.full_name, rent: listing.rent};
          const propertyId = listing.property_id;
          const propertyData = await fetchPropertyById(propertyId);
          const landlord = propertyData.landlord;
          setLandlordId(landlord.landlord_id);
          setTenantUserName(applicationData.student_id);
          // setApplication(applicationData);
          leaseData = {...leaseData, landlordName: `${landlord.first_name} ${landlord.last_name}`, address: propertyData.address, landlordAddress: landlord.address};
          console.log(applicationData);
          console.log(propertyData);
          // setLeaseData(leaseData);

          setFormData({...formData, ...leaseData});
        } catch (error) {
          console.error("Error loading applications:", error);
          setError("Failed to load application details.");
        } finally {
          setIsLoading(false);
        }
      };
  
      if (applicationId) fetchApplications();
    }, [applicationId]);

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
      leaseFormData.append("landlordId", landlordId);
      leaseFormData.append("tenantUserName", tenantUserName);

      try {
        const pdfUrl = await generateLease(leaseFormData);
        setPreviewUrl(pdfUrl);
      } catch (error) {
        console.error(error.message);
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