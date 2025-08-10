import React, { useEffect, useRef, useState } from 'react';
import MapComponent from './MapComponent';
import MapUtils from './MapUtils';
import {
  getCustomerOrders,
  createOrder,
  getOrderDetails,
  getCustomerLocation,
  getAllItems,
} from '../api/api';
import { ShopDetailScreenStyles, getStatusBadgeStyle } from '../styles/ShopDetailScreenStyles';
import { Customer, Shop, LatLng } from '../api/types';

interface Props {
  shop: Shop;
  customer: Customer;
  onBack: () => void;
}

const ShopDetailScreen: React.FC<Props> = ({ shop, customer, onBack }) => {
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [deliveryRouteCoords, setDeliveryRouteCoords] = useState<LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance_text: string;
    duration_text: string;
    start_address: string;
    end_address: string;
  } | null>(null);

  const [customerLocation, setCustomerLocation] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState<LatLng | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deliveryRouteInfo, setDeliveryRouteInfo] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const DEFAULT_LOCATION = {
    lat: customer?.latitude || 17.385,
    lng: customer?.longitude || 78.4867,
  };

  const shopLocation = shop?.coordinates?.[0] ? {
    lat: parseFloat(shop.coordinates[0].lat.toString()),
    lng: parseFloat(shop.coordinates[0].lng.toString()),
  } : null;

  const isValidLatLng = (loc: any) =>
    loc &&
    typeof loc.lat === "number" &&
    typeof loc.lng === "number" &&
    !isNaN(loc.lat) &&
    !isNaN(loc.lng);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        setItems(response.data);
        if (response.data.length > 0) setSelectedItemId(response.data[0].id);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };
    fetchItems();
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!customer?.id || !shop?.id) return;
    const fetchOrders = async () => {
      try {
        const response = await getCustomerOrders(customer.id, shop.id);
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, [customer?.id, shop?.id, orderPlaced]);

  // Fetch customer location
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const fetchLoc = async () => {
      try {
        const response = await getCustomerLocation(customer.id);
        const coords = {
          lat: response.data.lat,
          lng: response.data.lng,
        };
        setCustomerLocation(isValidLatLng(coords) ? coords : DEFAULT_LOCATION);
      } catch {
        setCustomerLocation(DEFAULT_LOCATION);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLoc();
    return () => {
      mounted = false;
    };
  }, [customer.id]);

  // Fetch route between customer and shop
  useEffect(() => {
    if (!customerLocation || !shopLocation) return;

    const fetchRoute = async () => {
      try {
        const route = await MapUtils.getRoute(customerLocation, shopLocation);
        setRouteCoords([customerLocation, shopLocation]);
        setRouteInfo({
          distance_text: route.distance_text,
          duration_text: route.duration_text,
          start_address: route.start_address,
          end_address: route.end_address,
        });
      } catch (error) {
        console.error("Failed to fetch route:", error);
        setRouteCoords([customerLocation, shopLocation]);
        setRouteInfo({
          distance_text: "N/A",
          duration_text: "N/A",
          start_address: "Your Location",
          end_address: shop.location || "Shop",
        });
      }
    };

    fetchRoute();
  }, [customerLocation, shopLocation]);

  const handleOrderSelect = async (orderId: number) => {
    try {
      const response = await getOrderDetails(orderId);
      setSelectedOrder(response.data);
      
      if (response.data.deliveryBoyLocation) {
        const deliveryLoc = {
          lat: response.data.deliveryBoyLocation.deliveryBoyLat,
          lng: response.data.deliveryBoyLocation.deliveryBoyLng,
        };
        setDeliveryLocation(deliveryLoc);
        
        if (response.data.status !== "PENDING" && response.data.customerLocation) {
          const customerLoc = {
            lat: response.data.customerLocation.customerLat,
            lng: response.data.customerLocation.customerLng,
          };
          
          try {
            const route = await MapUtils.getRoute(deliveryLoc, customerLoc);
            setDeliveryRouteCoords([deliveryLoc, customerLoc]);
            setDeliveryRouteInfo({
              distance_text: route.distance_text,
              duration_text: route.duration_text,
            });
          } catch (error) {
            console.error("Failed to fetch delivery route:", error);
            setDeliveryRouteCoords([deliveryLoc, customerLoc]);
            setDeliveryRouteInfo({
              distance_text: "N/A",
              duration_text: "N/A",
            });
          }
        }
      } else {
        setDeliveryLocation(null);
        setDeliveryRouteCoords([]);
      }
      
      setModalVisible(true);
    } catch (err) {
      setOrderError("Failed to load order details");
    }
  };

  const handlePlaceOrder = async () => {
    if (!customer || !shop || !selectedItemId) return;
    setOrderLoading(true);
    setOrderError("");
    try {
      await createOrder({
        itemIds: [selectedItemId],
        customerId: customer.id,
        shopId: shop.id,
        customerLat: customerLocation?.lat || DEFAULT_LOCATION.lat,
        customerLng: customerLocation?.lng || DEFAULT_LOCATION.lng,
        customerAddress: routeInfo?.start_address || "Unknown",
      });
      setOrderPlaced((prev) => !prev);
    } catch (err: any) {
      setOrderError(err.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div style={ShopDetailScreenStyles.container}>
      {/* Header */}
      <header style={ShopDetailScreenStyles.header}>
        <button onClick={onBack} style={ShopDetailScreenStyles.backBtn}>
          ←
        </button>
        <h1 style={ShopDetailScreenStyles.headerTitle}>{shop?.name || "Shop Details"}</h1>
      </header>

      {/* Main Map */}
      <div style={ShopDetailScreenStyles.mapContainer}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading map...</p>
          </div>
        ) : (
          <MapComponent
            center={{
              lat: customerLocation?.lat || DEFAULT_LOCATION.lat,
              lng: customerLocation?.lng || DEFAULT_LOCATION.lng,
            }}
            zoom={14}
            markers={[
              ...(customerLocation ? [{
                position: customerLocation,
                title: "You",
                color: "#1e90ff"
              }] : []),
              ...(shopLocation ? [{
                position: shopLocation,
                title: shop.name,
                color: "#ff6347"
              }] : []),
              ...(deliveryLocation ? [{
                position: deliveryLocation,
                title: "Delivery Boy",
                color: "#32cd32"
              }] : [])
            ]}
            polylines={[
              ...(routeCoords.length > 0 ? [{
                path: routeCoords,
                color: "#1e90ff"
              }] : []),
              ...(deliveryRouteCoords.length > 0 ? [{
                path: deliveryRouteCoords,
                color: "#32cd32"
              }] : [])
            ]}
          />
        )}
      </div>

      {/* Route Info */}
      {routeInfo && (
        <p style={ShopDetailScreenStyles.routeInfo}>
          Distance: {routeInfo.distance_text} | Duration: {routeInfo.duration_text}
        </p>
      )}

      {/* Content Scroll */}
      <div style={ShopDetailScreenStyles.contentContainer}>
        {/* Items Section */}
        <section style={ShopDetailScreenStyles.section}>
          <h2 style={ShopDetailScreenStyles.sectionTitle}>Available Items</h2>
          {items.length === 0 ? (
            <p style={ShopDetailScreenStyles.emptyText}>No items available.</p>
          ) : (
            <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    ...ShopDetailScreenStyles.itemCard,
                    ...(selectedItemId === item.id ? ShopDetailScreenStyles.itemCardSelected : {})
                  }}
                  onClick={() => setSelectedItemId(item.id)}
                >
                  <h3 style={ShopDetailScreenStyles.itemName}>{item.name}</h3>
                  <p style={ShopDetailScreenStyles.itemPrice}>₹{item.price}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Orders Section */}
        <section style={ShopDetailScreenStyles.section}>
          <h2 style={ShopDetailScreenStyles.sectionTitle}>Your Orders</h2>
          {orders.length === 0 ? (
            <p style={ShopDetailScreenStyles.emptyText}>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                style={ShopDetailScreenStyles.orderCard}
                onClick={() => handleOrderSelect(order.id)}
              >
                <p style={ShopDetailScreenStyles.orderIdText}>Order #{order.id}</p>
                <div style={getStatusBadgeStyle(order.status)}>
                  <p style={ShopDetailScreenStyles.orderStatusText}>{order.status}</p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Place Order Button */}
      <div style={ShopDetailScreenStyles.footer}>
        <button
          style={{
            ...ShopDetailScreenStyles.placeOrderBtn,
            ...((orderLoading || items.length === 0) ? ShopDetailScreenStyles.placeOrderBtnDisabled : {})
          }}
          onClick={handlePlaceOrder}
          disabled={orderLoading || items.length === 0}
        >
          {orderLoading ? 'Placing Order...' : 'Place New Order'}
        </button>
      </div>

      {/* Order Details Modal */}
      {modalVisible && (
        <div style={ShopDetailScreenStyles.modalContainer}>
          <div style={ShopDetailScreenStyles.modalContent}>
            <div style={ShopDetailScreenStyles.modalHeader}>
              <h2 style={ShopDetailScreenStyles.modalTitle}>Order #{selectedOrder?.id}</h2>
              <button 
                onClick={() => setModalVisible(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span style={ShopDetailScreenStyles.closeModalText}>✕</span>
              </button>
            </div>

            {selectedOrder && (
              <>
                <div style={getStatusBadgeStyle(selectedOrder.status)}>
                  <p style={ShopDetailScreenStyles.orderStatusText}>
                    {selectedOrder.status.toUpperCase()}
                  </p>
                </div>

                {/* Order Map */}
                <div style={ShopDetailScreenStyles.modalMapContainer}>
                  <MapComponent
                    center={{
                      lat: customerLocation?.lat || DEFAULT_LOCATION.lat,
                      lng: customerLocation?.lng || DEFAULT_LOCATION.lng,
                    }}
                    zoom={14}
                    markers={[
                      ...(selectedOrder.customerLocation ? [{
                        position: {
                          lat: selectedOrder.customerLocation.customerLat,
                          lng: selectedOrder.customerLocation.customerLng
                        },
                        title: "Customer",
                        color: "#1e90ff"
                      }] : []),
                      ...(shopLocation ? [{
                        position: shopLocation,
                        title: shop.name,
                        color: "#ff6347"
                      }] : []),
                      ...(deliveryLocation ? [{
                        position: deliveryLocation,
                        title: "Delivery Boy",
                        color: "#32cd32"
                      }] : [])
                    ]}
                    polylines={[
                      ...(selectedOrder.status !== "PENDING" && deliveryRouteCoords.length > 0 ? [{
                        path: deliveryRouteCoords,
                        color: "#32cd32"
                      }] : []),
                      ...(selectedOrder.status === "PENDING" && routeCoords.length > 0 ? [{
                        path: routeCoords,
                        color: "#1e90ff"
                      }] : [])
                    ]}
                  />
                </div>

                {/* Route Info */}
                {selectedOrder.status !== "PENDING" && deliveryRouteInfo && (
                  <p style={ShopDetailScreenStyles.modalRouteInfo}>
                    Delivery Distance: {deliveryRouteInfo.distance_text} | 
                    Estimated Time: {deliveryRouteInfo.duration_text}
                  </p>
                )}

                {/* Items */}
                <h3 style={ShopDetailScreenStyles.modalSectionTitle}>Items:</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item: any) => (
                    <p key={item.id} style={ShopDetailScreenStyles.modalText}>
                      • {item.name} x {item.quantity} (₹{item.price * item.quantity})
                    </p>
                  ))
                ) : (
                  <p style={ShopDetailScreenStyles.modalText}>No item details available.</p>
                )}

                {/* Customer Address */}
                {selectedOrder.customerLocation?.customerAddress && (
                  <>
                    <h3 style={ShopDetailScreenStyles.modalSectionTitle}>Delivery Address:</h3>
                    <p style={ShopDetailScreenStyles.modalText}>
                      {selectedOrder.customerLocation.customerAddress}
                    </p>
                  </>
                )}

                {/* Estimated Delivery Time */}
                {selectedOrder.estimatedDeliveryTime && (
                  <>
                    <h3 style={ShopDetailScreenStyles.modalSectionTitle}>Estimated Delivery Time:</h3>
                    <p style={ShopDetailScreenStyles.modalText}>
                      {selectedOrder.estimatedDeliveryTime}
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {orderError && (
        <div style={ShopDetailScreenStyles.errorContainer}>
          <p style={ShopDetailScreenStyles.errorText}>{orderError}</p>
        </div>
      )}
    </div>
  );
};

export default ShopDetailScreen;