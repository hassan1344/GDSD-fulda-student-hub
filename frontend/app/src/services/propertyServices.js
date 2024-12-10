export const fetchProperties = async (location, priceRange, advancedFilters) => {
    const params = new URLSearchParams({
      address: location,
      minRent: priceRange[0],
      maxRent: priceRange[1],
    });
  
    if (Object.keys(advancedFilters).some((key) => advancedFilters[key])) {
      params.append(
        "amenities",
        Object.keys(advancedFilters)
          .filter((key) => advancedFilters[key])
          .join(",")
      );
    }
  
    const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://16.171.165.15/api/v1";
    const apiUrl = `${BASE_URL}/properties?${params.toString()}`;
  
    const response = await fetch(apiUrl);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
  
    const data = await response.json();
  
    return Array.isArray(data) ? data : [];
  };
  