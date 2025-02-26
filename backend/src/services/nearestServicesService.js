import axios from "axios";

const UNIVERSITY_COORDINATES = { lat: 50.5651, lon: 9.6868 };

export const getNearestServices = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: "Address required" });

    const coords = await geocodeAddress(address);
    if (!coords) return res.json({});

    const services = await fetchAllServices(coords);
    
    res.json({
      ...services,
      location: {
        latitude: coords.lat,
        longitude: coords.lon
      },
      distanceFromUniversity: calculateUniversityDistance(coords)
    });

  } catch (error) {
    console.error("Service Error:", error.message);
    res.json({});
  }
};

// Helper functions
const geocodeAddress = async (address) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  if (!response.data.length) return null;
  return { lat: parseFloat(response.data[0].lat), lon: parseFloat(response.data[0].lon) };
};

const fetchAllServices = async ({ lat, lon }) => {
  const [supermarket, hospital, busStop, railwayStation] = await Promise.all([
    findService(lat, lon, "shop", "supermarket", 5000),
    findService(lat, lon, "amenity", "hospital", 5000),
    findService(lat, lon, "highway", "bus_stop", 3000),
    findService(lat, lon, "railway", "station", 10000)
  ]);

  return {
    supermarket: formatResult(supermarket, "Unknown Supermarket"),
    hospital: formatResult(hospital, "Unknown Hospital"),
    busStop: formatResult(busStop, "Unnamed Bus Stop"),
    railwayStation: formatResult(railwayStation, "Unnamed Railway Station"),
    location: {
      latitude: lat,
      longitude: lon
    }
  };
};

const findService = async (lat, lon, key, value, radius) => {
  for (let r = radius; r <= 15000; r += 5000) {
    try {
      const response = await axios.post("https://overpass-api.de/api/interpreter", `
        [out:json];
        (
          node["${key}"="${value}"](around:${r},${lat},${lon});
          way["${key}"="${value}"](around:${r},${lat},${lon});
          relation["${key}"="${value}"](around:${r},${lat},${lon});
        );
        out center;
      `);

      const elements = response.data.elements
        .map(e => ({
          ...e,
          lat: e.lat || e.center.lat,
          lon: e.lon || e.center.lon,
          distance: calculateDistance(lat, lon, e.lat || e.center.lat, e.lon || e.center.lon)
        }))
        .sort((a, b) => a.distance - b.distance);

      if (elements.length) return elements[0];
    } catch (error) {
      console.error(`Overpass API Error (${value}):`, error.message);
    }
  }
  return null;
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2 - lat1) * Math.PI/180;
  const Δλ = (lon2 - lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

const calculateUniversityDistance = ({ lat, lon }) => 
  `${calculateDistance(lat, lon, UNIVERSITY_COORDINATES.lat, UNIVERSITY_COORDINATES.lon).toFixed(2)} meters`;

const formatResult = (result, defaultName) => 
  result ? {
    name: result.tags.name || defaultName,
    lat: result.lat,
    lon: result.lon,
    distance: `${result.distance.toFixed(2)} meters`
  } : `No ${defaultName.toLowerCase()} found nearby`;

import express from "express";
import * as nearestServices from "../services/nearestServicesService.js";

const router = express.Router();

router.get("/nearest-services", nearestServices.getNearestServices);

export default router;
