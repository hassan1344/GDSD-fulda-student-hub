import React, { useState } from "react";

const ApplicationForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    contactNumber: "",
    currentAddress: "",
    enrollmentCertificate: null,
    governmentId: null,
    financialProof: null,
    otherDocuments: [],
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [actAccepted, setActAccepted] = useState(false);

  const isButtonDisabled = !(termsAccepted && actAccepted);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, [key]: file }));
    } else {
      alert("Please upload a valid PDF document.");
      e.target.value = ""; // Reset file input if invalid
    }
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type === "application/pdf");
    if (validFiles.length !== files.length) {
      alert("Only PDF files are allowed.");
    }
    setFormData((prev) => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, ...validFiles],
    }));
  };

  const removeOtherDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      otherDocuments: prev.otherDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Application Form
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 space-y-8"
      >
        {/* User Details Section */}
        <div className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Please fill in your details.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="studentId"
                className="block text-sm font-medium text-gray-700"
              >
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="currentAddress"
                className="block text-sm font-medium text-gray-700"
              >
                Current Address
              </label>
              <input
                type="text"
                id="currentAddress"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="border border-gray-300 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Please upload your documents.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="enrollmentCertificate"
                className="block text-sm font-medium text-gray-700"
              >
                Enrollment Certificate (Required)
              </label>
              <input
                type="file"
                id="enrollmentCertificate"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "enrollmentCertificate")}
                className="mt-1 block w-full text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="governmentId"
                className="block text-sm font-medium text-gray-700"
              >
                Government ID (Required)
              </label>
              <input
                type="file"
                id="governmentId"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "governmentId")}
                className="mt-1 block w-full text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="financialProof"
                className="block text-sm font-medium text-gray-700"
              >
                Financial Proof (Required)
              </label>
              <input
                type="file"
                id="financialProof"
                accept="application/pdf"
                onChange={(e) => handleFileChange(e, "financialProof")}
                className="mt-1 block w-full text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="otherDocuments"
                className="block text-sm font-medium text-gray-700"
              >
                Other Documents (Optional - Multiple)
              </label>
              <input
                type="file"
                id="otherDocuments"
                accept="application/pdf"
                multiple
                onChange={handleMultipleFilesChange}
                className="mt-1 block w-full text-sm"
              />
              <ul className="mt-2 list-disc pl-5 text-sm">
                {formData.otherDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{doc.name}</span>
                    <button
                      type="button"
                      onClick={() => removeOtherDocument(index)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="termsAccepted"
              className="ml-2 block text-sm text-gray-600"
            >
              I agree that the details provided are authentic. If false,
              necessary actions will be taken.
            </label>
          </div>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="actAccepted"
              checked={actAccepted}
              onChange={(e) => setActAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="actAccepted"
              className="ml-2 block text-sm text-gray-600"
            >
              I agree with Act 41 & 43 German resident law for residence for
              tenants.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`px-6 py-2 text-white font-semibold rounded-md shadow ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Apply Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
