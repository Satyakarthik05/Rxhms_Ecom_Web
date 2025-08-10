import React, { useEffect, useState, useRef, useCallback } from "react";
import MapComponent from "./MapComponent";
import MapUtils from "./MapUtils";
import { GoogleMap } from '@react-google-maps/api';
import {
  fetchShopsForCustomer,
  updateCustomerAddress,
  getCustomerLocation,
} from "../api/api";
import styles from "../styles/CustomerHomeStyles";
import { useGpsTracking } from "../hooks/useGpsTracking";
import { Shop, Customer } from "../api/types";

interface Props {
  customer: Customer;
  onLogout: () => void;
  onDetail: (shop: Shop) => void;
}

interface RawShop {
  id: number;
  name: string;
  location: string;
  pincode: string;
  coordinatesJson: string;
  isInside?: boolean;
}

const CustomerHomeScreen: React.FC<Props> = ({
  customer,
  onLogout,
  onDetail,
}) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [address, setAddress] = useState("");
  const [routeDistances, setRouteDistances] = useState<{
    [key: number]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapError, setMapError] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [draggableMarkerCoord, setDraggableMarkerCoord] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const { location, setManualLocation } = useGpsTracking(customer.id);
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialLoadDone.current) return;

      setLoading(true);
      try {
        const res = await getCustomerLocation(customer.id);
        if (res.data.latitude && res.data.longitude) {
          const initialLoc = {
            lat: res.data.latitude,
            lng: res.data.longitude,
          };
          setManualLocation(initialLoc);
          setDraggableMarkerCoord(initialLoc);
          setAddress(res.data.location || "");
          await fetchShops(initialLoc);
        }
      } catch (err) {
        setError("Failed to load initial data");
        console.error(err);
      } finally {
        setLoading(false);
        initialLoadDone.current = true;
      }
    };

    loadInitialData();
  }, [customer.id, setManualLocation]);

  const fetchShops = async (loc: { lat: number; lng: number }) => {
    setLoading(true);
    try {
      const res = await fetchShopsForCustomer(customer.id);
      const raw: RawShop[] = Array.isArray(res.data) ? res.data : [];

      const shopsWithCoords: Shop[] = raw
        .map((s) => {
          let coords: { lat: number; lng: number }[] = [];
          try {
            const parsed = JSON.parse(s.coordinatesJson);
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (typeof parsed[0] === "object" && "lat" in parsed[0]) {
                coords = parsed as { lat: number; lng: number }[];
              } else if (Array.isArray(parsed[0]) && parsed[0].length >= 2) {
                coords = (parsed as any[]).map((p) => ({
                  lat: p[1],
                  lng: p[0],
                }));
              }
            }
          } catch {
            coords = [];
          }
          return {
            id: s.id,
            name: s.name,
            location: s.location,
            pincode: s.pincode,
            coordinates: coords,
            isInside: s.isInside ?? false,
          };
        })
        .filter((sh) => sh.coordinates.length > 0)
        .filter((shop) => {
          const shopLoc = shop.coordinates[0];
          const distance = MapUtils.straightDist(
            { lat: loc.lat, lng: loc.lng },
            { lat: shopLoc.lat, lng: shopLoc.lng }
          );
          return distance <= 10000;
        });

      setShops(shopsWithCoords);
      setError("");

      const distances: { [key: number]: string } = {};
      await Promise.all(
        shopsWithCoords.map(async (shop) => {
          try {
            const routeInfo = await MapUtils.getRoute(
              { lat: loc.lat, lng: loc.lng },
              { lat: shop.coordinates[0].lat, lng: shop.coordinates[0].lng }
            );
            distances[shop.id] = routeInfo.distance_text;
          } catch {
            distances[shop.id] = "N/A";
          }
        })
      );
      setRouteDistances(distances);
    } catch (err) {
      console.error("fetchShops error", err);
      setError("Failed to load shops.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
    setAddressLoading(true);
    try {
      const geo = await MapUtils.geocodeAddress(address);
      const newLoc = { lat: geo.latitude, lng: geo.longitude };
      await updateCustomerAddress(customer.id, {
        latitude: geo.latitude,
        longitude: geo.longitude,
        location: geo.formatted_address,
        pincode:
          geo.components.find((c: any) => c.types.includes("postal_code"))
            ?.long_name || "000000",
      });
      setManualLocation(newLoc);
      setDraggableMarkerCoord(newLoc);
      setAddress(geo.formatted_address);
      await fetchShops(newLoc);
    } catch (err: any) {
      setError(err.message || "Failed to geocode address");
      setMapError("Failed to update map location");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleMarkerDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const newCoord = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setDraggableMarkerCoord(newCoord);
      setIsUpdatingLocation(true);

      try {
        const geo = await MapUtils.reverseGeocode({
          lat: newCoord.lat,
          lng: newCoord.lng,
        });
        setAddress(geo.address);
        await fetchShops(newCoord);
        await updateCustomerAddress(customer.id, {
          latitude: newCoord.lat,
          longitude: newCoord.lng,
          location: geo.address,
          pincode:
            geo.components.find((c: any) => c.types.includes("postal_code"))
              ?.long_name || "000000",
        });
        setManualLocation(newCoord);
      } catch (err) {
        console.error("Error updating location:", err);
        setError("Failed to update location");
      } finally {
        setIsUpdatingLocation(false);
      }
    },
    [customer.id, setManualLocation]
  );

  const handleMapClick = async (latLng: { lat: number; lng: number }) => {
    setDraggableMarkerCoord(latLng);
    setIsUpdatingLocation(true);

    try {
      const geo = await MapUtils.reverseGeocode({
        lat: latLng.lat,
        lng: latLng.lng,
      });
      setAddress(geo.address);
      await fetchShops(latLng);
      await updateCustomerAddress(customer.id, {
        latitude: latLng.lat,
        longitude: latLng.lng,
        location: geo.address,
        pincode:
          geo.components.find((c: any) => c.types.includes("postal_code"))
            ?.long_name || "000000",
      });
      setManualLocation(latLng);
    } catch (err) {
      console.error("Error updating location:", err);
      setError("Failed to update location");
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const handleRecenter = async () => {
    if (!location) return;

    try {
      setDraggableMarkerCoord(location);
      const geo = await MapUtils.reverseGeocode({
        lat: location.lat,
        lng: location.lng,
      });
      setAddress(geo.address);
      await fetchShops(location);
      await updateCustomerAddress(customer.id, {
        latitude: location.lat,
        longitude: location.lng,
        location: geo.address,
        pincode:
          geo.components.find((c: any) => c.types.includes("postal_code"))
            ?.long_name || "000000",
      });

      if (mapRef.current) {
        mapRef.current.panTo(location);
      }
    } catch (err) {
      console.error("Error recentering:", err);
      setError("Failed to recenter to current location");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Shop Locator</h1>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </header>

      {/* Address Search */}
      <section style={styles.searchSection}>
        <label style={styles.label}>Enter your address</label>
        <div style={styles.inputGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g., Vijayawada, Gudiwada"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={handleAddressSubmit}
            disabled={addressLoading}
          >
            {addressLoading ? "Searching..." : "Search"}
          </button>
          <button
            style={{
              ...styles.button,
              marginLeft: 8,
              backgroundColor: "#28a745",
            }}
            onClick={handleRecenter}
            disabled={!location}
          >
            📍
          </button>
        </div>
      </section>

      {error && <p style={styles.error}>{error}</p>}
      {mapError && <p style={styles.warning}>{mapError}</p>}

      {/* Map */}
      <div style={styles.mapSection}>
        {location ? (
          <MapComponent
            ref={mapRef as React.Ref<GoogleMap | null>}
            center={location}
            zoom={14}
            markers={shops.map((shop) => ({
              position: {
                lat: shop.coordinates[0].lat,
                lng: shop.coordinates[0].lng,
              },
              title: shop.name,
              color: shop.isInside ? "green" : "red",
            }))}
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
            draggableMarker={draggableMarkerCoord || undefined}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <p>Loading map...</p>
          </div>
        )}
      </div>

      {/* Shops List */}
      <div style={styles.listContainer}>
        <h2 style={styles.sectionTitle}>Nearby Shops ({shops.length})</h2>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Loading shops...</p>
          </div>
        ) : shops.length === 0 ? (
          <p style={styles.noShops}>No shops found in your area</p>
        ) : (
          shops.map((shop) => (
            <div
              key={shop.id}
              style={styles.shopCard}
              onClick={() => onDetail(shop)}
            >
              <div style={styles.shopCardHeader}>
                <div
                  style={{
                    ...styles.statusIndicator,
                    backgroundColor: shop.isInside ? "#28a745" : "#dc3545",
                  }}
                />
                <h3 style={styles.shopName}>{shop.name}</h3>
              </div>
              <p style={styles.shopLocation}>
                {shop.location} ({shop.pincode})
              </p>
              <div style={styles.distanceRow}>
                <p style={styles.distanceText}>
                  Straight-line:{" "}
                  {draggableMarkerCoord
                    ? `${Math.round(
                        MapUtils.straightDist(
                          {
                            lat: draggableMarkerCoord.lat,
                            lng: draggableMarkerCoord.lng,
                          },
                          {
                            lat: shop.coordinates[0].lat,
                            lng: shop.coordinates[0].lng,
                          }
                        )
                      )} m`
                    : "N/A"}
                </p>
                <p style={styles.distanceText}>
                  Route: {routeDistances[shop.id] || "Calculating..."}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerHomeScreen;
