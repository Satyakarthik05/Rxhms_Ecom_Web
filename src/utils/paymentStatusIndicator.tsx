import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  PaymentStatus,
  PaymentStatusDisplay,
} from "../sections/myCart/model/paymentStatus";

interface PaymentStatusChipProps {
  status: PaymentStatus;
}

const statusStyles: Record<
  PaymentStatus,
  { color: string; bgColor?: string; dotColor?: string }
> = {
  [PaymentStatus.PENDING]: {
    color: "#FFA500",
    bgColor: "rgba(255, 152, 0, 0.1)",
    dotColor: "#FFA500",
  },
  [PaymentStatus.COMPLETED]: { color: "#28A745" },
  [PaymentStatus.FAILED]: { color: "#DC3545" },
  [PaymentStatus.REFUND_IN_PROGRESS]: {
    color: "#FF6B6B",
    bgColor: "rgba(244, 67, 54, 0.1)",
    dotColor: "#FF6B6B",
  },
  [PaymentStatus.REFUNDED]: { color: "#28A745" },
};

const PaymentStatusIndicator: React.FC<PaymentStatusChipProps> = ({
  status,
}) => {
  console.log(status, "payment Status@@@");
  const style = statusStyles[status];
  if (!style) return null;

  const renderIcon = () => {
    if (
      status === PaymentStatus.PENDING ||
      status === PaymentStatus.REFUND_IN_PROGRESS
    ) {
      return (
        <Box
          sx={{
            width: 20,
            height: 20,
            bgcolor: style.bgColor,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              bgcolor: style.dotColor,
              borderRadius: "50%",
            }}
          />
        </Box>
      );
    }

    if (
      status === PaymentStatus.COMPLETED ||
      status === PaymentStatus.REFUNDED
    ) {
      return (
        <CheckCircleIcon sx={{ color: style.color, fontSize: 18, mr: 0.5 }} />
      );
    }

    if (status === PaymentStatus.FAILED) {
      return <CancelIcon sx={{ color: style.color, fontSize: 18, mr: 0.5 }} />;
    }

    return null;
  };

  return (
    <Stack direction="row" alignItems="center">
      {renderIcon()}
      <Typography
        variant="body2"
        sx={{
          color: style.color,
          fontWeight: 500,
          fontSize: "13px",
        }}
      >
        {PaymentStatusDisplay[status]}
      </Typography>
    </Stack>
  );
};

export default PaymentStatusIndicator;
