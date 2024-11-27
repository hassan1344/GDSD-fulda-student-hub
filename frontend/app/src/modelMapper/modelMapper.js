import Property from "./models/Property";
import Listing from "./models/Listing";
import Landlord from "./models/Landlord";

export const mapToProperty = (data) => {
  return new Property(
    data.property_id,
    data.landlord_id,
    data.address,
    data.rent,
    data.amenities,
    data.created_at,
    data.updated_at
  );
};

export const mapToListing = (data) => {
  return new Listing(
    data.listing_id,
    data.property_id,
    data.title,
    data.description,
    data.images,
    data.status,
    data.createdAt,
    data.updatedAt
  );
};

export const mapToLandlord = (data) => {
  return new Landlord(
    data.landlord_id,
    data.name,
    data.phone_number,
    data.address,
    data.trust_score,
    data.profile_picture,
    data.created_at,
    data.updated_at
  );
};
