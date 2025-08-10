import { CSSProperties } from 'react';

interface ShopDetailScreenStyles {
  container: CSSProperties;
  header: CSSProperties;
  backBtn: CSSProperties;
  headerTitle: CSSProperties;
  mapContainer: CSSProperties;
  routeInfo: CSSProperties;
  contentContainer: CSSProperties;
  section: CSSProperties;
  sectionTitle: CSSProperties;
  emptyText: CSSProperties;
  itemCard: CSSProperties;
  itemCardSelected: CSSProperties;
  itemName: CSSProperties;
  itemPrice: CSSProperties;
  orderCard: CSSProperties;
  orderIdText: CSSProperties;
  orderStatus: CSSProperties;
  orderStatusText: CSSProperties;
  statusPending: CSSProperties;
  statusAccepted: CSSProperties;
  statusInTransit: CSSProperties;
  statusDelivered: CSSProperties;
  statusCancelled: CSSProperties;
  statusDefault: CSSProperties;
  footer: CSSProperties;
  placeOrderBtn: CSSProperties;
  placeOrderBtnDisabled: CSSProperties;
  modalContainer: CSSProperties;
  modalContent: CSSProperties;
  modalHeader: CSSProperties;
  modalTitle: CSSProperties;
  closeModalText: CSSProperties;
  modalMapContainer: CSSProperties;
  modalRouteInfo: CSSProperties;
  modalSectionTitle: CSSProperties;
  modalText: CSSProperties;
  errorContainer: CSSProperties;
  errorText: CSSProperties;
}

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export const ShopDetailScreenStyles: ShopDetailScreenStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: "#f9fbfd",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e90ff",
    padding: "14px 18px",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.25)",
  },
  backBtn: {
    marginRight: 20,
    padding: 6,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.25)",
    border: 'none',
    color: '#fff',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 40,
  },
  mapContainer: {
    height: 260,
    width: "90%",
    margin: "14px auto",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e1e8f0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  routeInfo: {
    backgroundColor: "#d9ecff",
    margin: "0 20px 16px",
    padding: 10,
    borderRadius: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#0f3d91",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  contentContainer: {
    paddingBottom: 100,
    overflowY: 'auto',
    flex: 1,
  },
  section: {
    padding: "0 20px",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
    color: "#0f3d91",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 12,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "18px 20px",
    marginRight: 14,
    minWidth: 140,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
    cursor: 'pointer',
  },
  itemCardSelected: {
    border: "2px solid #1e90ff",
    backgroundColor: "#dbe9ff",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f3d91",
    textAlign: "center",
  },
  itemPrice: {
    fontWeight: "700",
    marginTop: 6,
    fontSize: 14,
    color: "#1e90ff",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "18px 22px",
    marginBottom: 18,
    border: "1px solid #e3e7eb",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.12)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: 'pointer',
  },
  orderIdText: {
    fontWeight: "700",
    fontSize: 18,
    color: "#0f3d91",
  },
  orderStatus: {
    borderRadius: 14,
    minWidth: 100,
    padding: "6px 14px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderStatusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textTransform: "capitalize",
    textAlign: "center",
  },
  statusPending: { backgroundColor: "#ff9800" },
  statusAccepted: { backgroundColor: "#2196f3" },
  statusInTransit: { backgroundColor: "#9c27b0" },
  statusDelivered: { backgroundColor: "#4caf50" },
  statusCancelled: { backgroundColor: "#f44336" },
  statusDefault: { backgroundColor: "#999" },
  footer: {
    position: "fixed",
    bottom: 15,
    width: "100%",
    padding: "0 20px",
  },
  placeOrderBtn: {
    backgroundColor: "#1e90ff",
    padding: "18px 0",
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    boxShadow: "0 5px 8px rgba(30, 144, 255, 0.5)",
    color: '#fff',
    fontWeight: 800,
    fontSize: 20,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  placeOrderBtnDisabled: {
    backgroundColor: "#a0cfff",
    cursor: 'not-allowed',
  },
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
  modalContent: {
    width: "90%",
    maxWidth: 800,
    maxHeight: "80vh",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    overflowY: 'auto',
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f3d91",
  },
  closeModalText: {
    fontSize: 24,
    color: "#666",
  },
  modalMapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    margin: "15px 0",
  },
  modalRouteInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 3,
  },
  errorContainer: {
    position: "fixed",
    bottom: 80,
    width: "100%",
    display: 'flex',
    alignItems: "center",
  },
  errorText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
  },
};

export const getStatusBadgeStyle = (status: string): CSSProperties => {
  switch (status?.toLowerCase()) {
    case "pending":
      return ShopDetailScreenStyles.statusPending;
    case "accepted":
      return ShopDetailScreenStyles.statusAccepted;
    case "in_transit":
      return ShopDetailScreenStyles.statusInTransit;
    case "delivered":
      return ShopDetailScreenStyles.statusDelivered;
    case "cancelled":
      return ShopDetailScreenStyles.statusCancelled;
    default:
      return ShopDetailScreenStyles.statusDefault;
  }
};