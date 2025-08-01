import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { setLocalText } from "../web-constants/constants";
import { RootState } from "../Redux/store/store";
import { useSelector } from "react-redux";

interface PaymentRetryProps {
  orderNum: string;
  placedOn: string; // "2025-05-20T11:02:23"
  expiredOn: string; // "2025-05-20T11:02:23"
}

const PaymentRetry: React.FC<PaymentRetryProps> = ({
  orderNum,
  placedOn,
  expiredOn,
}) => {
  const navigate = useNavigate();
  const { ENABLE_RETRY_PAYMENT_MINUTES } = useSelector(
    (store: RootState) => store.retryPaymentTerm
  );

  console.log(
    "##$code ENABLE_RETRY_PAYMENT_MINUTES",
    ENABLE_RETRY_PAYMENT_MINUTES
  );
  const [timeRemaining, setTimeRemaining] = useState<{
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  const handleRetryPayment = () => {
    if (timeRemaining.isExpired) {
      return;
    }

    setLocalText("orderNum", orderNum);

    setTimeout(() => {
      navigate("/cart/bag/checkout", {
        state: { retryPayment: true },
      });
    }, 10);
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (ENABLE_RETRY_PAYMENT_MINUTES) {
        try {
          const placedDate = new Date(
            placedOn.endsWith("Z") ? placedOn : placedOn + "Z"
          );
          const startTimer = new Date(
            placedDate.getTime() +
              parseInt(ENABLE_RETRY_PAYMENT_MINUTES) * 60 * 1000
          );

          if (isNaN(startTimer.getTime())) {
            console.error("Invalid date format:", placedOn);
            return { minutes: 0, seconds: 0, isExpired: true };
          }

          const expiryTime = new Date(
            expiredOn.endsWith("Z") ? expiredOn : expiredOn + "Z"
          );

          const now = new Date();
          const timeDiff = expiryTime.getTime() - now.getTime();

          console.log("$1Placed Date:", placedDate);
          console.log("$2Expiry Time (30 min later):", expiryTime);
          console.log("$3Current Date:", now);
          console.log("$4Time Difference (ms):", timeDiff);
          console.log("$5Within 30 minutes:", timeDiff > 0);

          if (timeDiff <= 0) {
            return { minutes: 0, seconds: 0, isExpired: true };
          }

          const minutes = Math.floor(timeDiff / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          return { minutes, seconds, isExpired: false };
        } catch (error) {
          console.error("Error calculating time remaining:", error);
          return { minutes: 0, seconds: 0, isExpired: true };
        }
      } else {
        return { minutes: 0, seconds: 0, isExpired: true };
      }
    };

    const initialTime = calculateTimeRemaining();
    console.log("initialTime", initialTime);
    setTimeRemaining(initialTime);

    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);

      if (newTime?.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [placedOn]);

  if (timeRemaining.isExpired) {
    return null;
  }

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {!isNaN(timeRemaining.minutes) && (
        <>
          <Divider
            sx={{
              my: 2,
              borderColor: "#F1EAE4",
              borderBottomWidth: 3,
            }}
          />

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,

              //   backgroundColor: "#FFF8E1",
              backgroundColor: "#FFF",
              borderRadius: 1,
              //   border: "1px solid #FFE0B2",
            }}
          >
            {/* Timer Display */}
            <Typography
              variant="body2"
              sx={{
                color: "#E65100",
                fontWeight: 500,
              }}
            >
              Payment retry expires in:{" "}
              {formatTime(timeRemaining.minutes, timeRemaining.seconds)}
            </Typography>

            {/* Retry Button */}
            <Button
              variant="outlined"
              startIcon={<AutorenewIcon />}
              sx={{
                backgroundColor: "#FFCC80",
                color: "#000",
                borderColor: "#FFB74D",
                fontWeight: 500,
                whiteSpace: "nowrap",
                fontSize: 14,
                width: { xs: "100%", sm: "auto" },
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#FFB74D",
                  borderColor: "#FF9800",
                },
              }}
              onClick={handleRetryPayment}
            >
              Retry Payment
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default PaymentRetry;
