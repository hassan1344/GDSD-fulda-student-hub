import React from "react";
import Navbar from "../components/NavBar";

const LandlordViewTenants = () => {
  // Mock data for tenants
  const tenants = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "123-456-7890",
      propertyTitle: "Modern Apartment",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "987-654-3210",
      propertyTitle: "Cozy Studio",
      leaseStart: "2024-02-01",
      leaseEnd: "2025-01-31",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "456-789-0123",
      propertyTitle: "Spacious House",
      leaseStart: "2024-03-01",
      leaseEnd: "2025-02-28",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">View Tenants</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{tenant.name}</h3>
              <p className="text-gray-600">📧 Email: {tenant.email}</p>
              <p className="text-gray-600">📞 Phone: {tenant.phone}</p>
              <p className="text-gray-600">🏠 Property: {tenant.propertyTitle}</p>
              <p className="text-gray-600">
                🗓️ Lease Start: {new Date(tenant.leaseStart).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                🗓️ Lease End: {new Date(tenant.leaseEnd).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandlordViewTenants;
