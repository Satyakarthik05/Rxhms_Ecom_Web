import { useEffect, useState, useCallback } from 'react';
import { updateCustomerLocation } from '../api/api';

export const useGpsTracking = (customerId: number) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          updateCustomerLocation(customerId, {
            latitude: coords.lat,
            longitude: coords.lng,
          }).catch(() => {});
        },
        (err) => {
          console.error('Location error:', err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }, [customerId]);

  const setManualLocation = (coords: { lat: number; lng: number }) => {
    setLocation(coords);
    updateCustomerLocation(customerId, {
      latitude: coords.lat,
      longitude: coords.lng,
    }).catch(() => {});
  };

  useEffect(() => {
    getCurrentLocation();
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          updateCustomerLocation(customerId, {
            latitude: coords.lat,
            longitude: coords.lng,
          }).catch(() => {});
        },
        (err) => console.error('Watch error:', err),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [customerId, getCurrentLocation]);

  return { location, setManualLocation };
};