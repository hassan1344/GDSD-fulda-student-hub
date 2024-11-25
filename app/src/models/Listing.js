class Listing {
  constructor(
    listing_id,
    property_id,
    title,
    description,
    images,
    status,
    createdAt,
    updatedAt
  ) {
    this.listing_id = listing_id;
    this.property_id = property_id;
    this.title = title;
    this.description = description;
    this.images = images;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Optionally, you can add methods here to manipulate the data if needed
  getImageUrl() {
    return this.images.length > 0 ? this.images[0] : "/default-image.jpg";
  }
}
