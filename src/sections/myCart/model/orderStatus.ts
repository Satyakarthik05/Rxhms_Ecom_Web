export enum OrderStatus {
  PENDING = "PENDING",
  ORDER_PLACED = "ORDER_PLACED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURN_IN_PROGRESS = "RETURN_IN_PROGRESS",
  RETURNED = "RETURNED",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

export const OrderStatusDisplay = {
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.ORDER_PLACED]: "Order Placed",
  [OrderStatus.PROCESSING]: "Processing",
  [OrderStatus.SHIPPED]: "Shipped",
  [OrderStatus.DELIVERED]: "Delivered",
  [OrderStatus.CANCELLED]: "Cancelled",
  [OrderStatus.RETURN_IN_PROGRESS]: "Return In Progress",
  [OrderStatus.RETURNED]: "Returned",
  [OrderStatus.COMPLETED]: "Completed",
  [OrderStatus.ABANDONED]: "Abandoned",
};
