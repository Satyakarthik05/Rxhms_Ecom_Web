import { LatLng } from '../api/types';

// Your Google Maps API key — must be enabled for Geocoding + Directions
const GOOGLE_MAPS_API_KEY = 'AIzaSyAos0trl6AOzlk5jHrMTxmPBM4BhRUQH3A';

function haversineDistance(from: LatLng, to: LatLng): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (from.lat * Math.PI) / 180;
  const φ2 = (to.lat * Math.PI) / 180;
  const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
  const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const MapUtils = {
  /**
   * Straight-line distance between two points in meters
   */
  straightDist(from: LatLng, to: LatLng) {
    return haversineDistance(from, to); // in meters
  },

  /**
   * Get route details between two coordinates
   * Returns distance_text, duration_text, start_address, end_address
   */
  async getRoute(from: LatLng, to: LatLng) {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const leg = data.routes[0].legs[0];
      return {
        distance_text: leg.distance.text,
        duration_text: leg.duration.text,
        start_address: leg.start_address,
        end_address: leg.end_address,
        polyline: data.routes[0].overview_polyline.points,
      };
    } else {
      throw new Error('Failed to get directions: ' + data.status);
    }
  },

  /**
   * Reverse geocode: LatLng -> Address
   */
  async reverseGeocode(latLng: LatLng) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return {
        address: data.results[0].formatted_address,
        components: data.results[0].address_components,
      };
    } else {
      throw new Error('Reverse geocode failed: ' + data.status);
    }
  },

  /**
   * Geocode: Address -> LatLng
   */
  async geocodeAddress(address: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        components: data.results[0].address_components,
        formatted_address: data.results[0].formatted_address,
      };
    } else {
      throw new Error('Geocode failed: ' + data.status);
    }
  },
};

export default MapUtils;