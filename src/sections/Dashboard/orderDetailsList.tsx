import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { OrderMaster } from "../myCart/model/orderMaster";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { OrdersUri } from "./profileService/profileService";

interface OrderItem {
  id: number;
  imageUrl: string;
  deliveryDate: string;
  productCount: number;
}

const orderItems: OrderItem[] = [
  {
    id: 1,
    imageUrl: "https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg",
    deliveryDate: "May 17, 2025",
    productCount: 10,
  },
  {
    id: 2,
    imageUrl: "https://images.pexels.com/photos/3651125/pexels-photo-3651125.jpeg",
    deliveryDate: "May 17, 2025",
    productCount: 10,
  },
  {
    id: 3,
    imageUrl: "https://images.pexels.com/photos/593824/pexels-photo-593824.jpeg",
    deliveryDate: "May 17, 2025",
    productCount: 10,
  },
  {
    id: 4,
    imageUrl: "https://images.pexels.com/photos/1069798/pexels-photo-1069798.jpeg",
    deliveryDate: "May 17, 2025",
    productCount: 10,
  },
];

const OrderDetailsList: React.FC = () => {
  const username = useSelector((store: RootState) => store.jwtToken.username);

    const {
        data: orders,
        isLoading,
        error,
        fetchData,
      } = useFetchByQuery<OrderMaster[]>(OrdersUri, { username });


  return (
    <Box px={2} py={3}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Order ID - #23462567885432
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        Order Placed Thu 29 March 25
      </Typography>

      {orderItems.map((item, index) => (
        <Box
          key={item.id}
          display="flex"
          alignItems="flex-start"
          gap={2}
          py={2}
          borderBottom={index !== orderItems.length - 1 ? "1px dashed #EEE" : "none"}
        >
          <Avatar
            variant="rounded"
            src={item.imageUrl}
            alt={`Product ${item.id}`}
            sx={{ width: 70, height: 70 }}
          />
          <Box>
            <Typography variant="body2">
              Delivered on {item.deliveryDate}, {item.productCount}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default OrderDetailsList;
