import apiClient from "./apiClient";

export const fetchProperties = async (location, priceRange, advancedFilters) => {
  const params = {
    address: location,
    minRent: priceRange[0],
    maxRent: priceRange[1],
  };

  if (Object.keys(advancedFilters).some((key) => advancedFilters[key])) {
    params.amenities = Object.keys(advancedFilters)
      .filter((key) => advancedFilters[key])
      .join(",");
  }

  const response = await apiClient.get(`/properties`, { params });
  return Array.isArray(response.data) ? response.data : [];
};
