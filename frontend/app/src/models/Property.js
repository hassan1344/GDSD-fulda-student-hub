class Property {
  constructor(
    property_id,
    landlord_id,
    address,
    rent,
    amenities,
    created_at,
    updated_at
  ) {
    this.property_id = property_id;
    this.landlord_id = landlord_id;
    this.address = address;
    this.rent = rent;
    this.amenities = amenities;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
