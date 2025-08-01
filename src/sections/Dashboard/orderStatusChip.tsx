import React from "react";
import { Chip } from "@mui/material";
import { OrderStatus, OrderStatusDisplay } from "../myCart/model/orderStatus";
const OrderStatusStyles: Record<OrderStatus, { bg: string; color: string }> = {
  [OrderStatus.PENDING]: { bg: "#FFF3CD", color: "#856404" },
  [OrderStatus.ORDER_PLACED]: { bg: "#D1ECF1", color: "#0C5460" },
  [OrderStatus.PROCESSING]: { bg: "#CCE5FF", color: "#004085" },
  [OrderStatus.SHIPPED]: { bg: "#E2E3E5", color: "#383D41" },
  [OrderStatus.DELIVERED]: { bg: "#D4EDDA", color: "#155724" },
  [OrderStatus.CANCELLED]: { bg: "#F8D7DA", color: "#721C24" },
  [OrderStatus.RETURN_IN_PROGRESS]: { bg: "#FFF3CD", color: "#856404" },
  [OrderStatus.RETURNED]: { bg: "#F8D7DA", color: "#721C24" },
  [OrderStatus.COMPLETED]: { bg: "#C3E6CB", color: "#155724" },
  [OrderStatus.ABANDONED]: { bg: "#C3E6CB", color: "#721C24" },
};

interface OrderStatusChipProps {
  status: OrderStatus;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ status }) => {
  const { bg, color } = OrderStatusStyles[status];
  const label = OrderStatusDisplay[status];

  return (
    <Chip
      label={label}
      sx={{
        height: { xs: "28px", md: "32px" },
        backgroundColor: bg,
        color: color,
        fontWeight: 500,
        fontSize: { xs: "0.6rem", md: "0.8rem" },
      }}
    />
  );
};

export default OrderStatusChip;
