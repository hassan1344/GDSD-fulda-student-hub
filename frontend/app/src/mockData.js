import room1 from './assets/images/room1.jpg';


export const mockLandlordData = {
  landlord: {
    id: 1,
    name: "Karl Gustav",
    email: "karlgustav@example.com",
    phone_number: "123-456-7890",
    trust_score: 4.5
  },

 

  listings: [
    {
      listing_id: 1,
      title: "Modern Apartment in City Center",
      description: "A stylish one-bedroom apartment with city views.",
      images: [
        room1 // Example image
      ],
      status: "available",
      property: {
        address: "123 Main Street, Cityville",
        rent: 1200,
        amenities: ["balcony", "heater", "parking"]
      },
      created_at: "2023-11-15T10:00:00Z",
      updated_at: "2023-11-15T10:00:00Z"
    },
    {
      listing_id: 2,
      title: "Cozy Studio near University",
      description: "Perfect for students, close to campus.",
      images: [
        "https://th.bing.com/th/id/OIP.UB7BT3YPQjpidUcKh6Rp-gExDM?w=253&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // Example image
      ],
      status: "rented",
      property: {
        address: "456 College Ave, Edutown",
        rent: 800,
        amenities: ["wifi", "laundry"]
      },
      created_at: "2023-10-20T14:30:00Z",
      updated_at: "2023-11-01T09:15:00Z"
    },
    {
      listing_id: 3,
      title: "Spacious Family Home",
      description: "3-bedroom house with a large backyard.",
      images: [
        "https://th.bing.com/th/id/OIP.Tlz12n_XT0XAUl8ssV5vbQHaK5?w=131&h=193&c=7&r=0&o=5&dpr=1.3&pid=1.7", // Example image
      ],
      status: "available",
      property: {
        address: "789 Oak Road, Suburbia",
        rent: 2000,
        amenities: ["garden", "garage", "fireplace"]
      },
      created_at: "2023-11-05T11:45:00Z",
      updated_at: "2023-11-05T11:45:00Z"
    }
  ],
  stats: {
    new_requests:2
    /*total_listings: 3,
    available_listings: 2,
    rented_listings: 1,
    total_income: 2000  */
  }
};