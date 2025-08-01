import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { setLocalText } from "../web-constants/constants";

interface PaymentRetryProps {
  placedOn: string; // "2025-05-20T11:02:23"
  retryPaymentTime: string; // "2025-05-20T11:02:23"
}

const PaymentTimer: React.FC<PaymentRetryProps> = ({
  placedOn,
  retryPaymentTime,
}) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState<{
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  // const handleRetryPayment = () => {
  //   if (!timeRemaining.isExpired) {
  //     setTimeout(() => {
  //       navigate("/overview/orders");
  //     }, 10);
  //   }
  // };

  // useEffect(() => {
  //   handleRetryPayment();
  // }, [timeRemaining]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      try {
        const placedDate = new Date(
          placedOn.endsWith("Z") ? placedOn : placedOn + "Z"
        );

        if (isNaN(placedDate.getTime())) {
          console.error("Invalid date format:", placedOn);
          return { minutes: 0, seconds: 0, isExpired: true };
        }

        const expiryTime = new Date(
          retryPaymentTime.endsWith("Z")
            ? retryPaymentTime
            : retryPaymentTime + "Z"
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
    };

    const initialTime = calculateTimeRemaining();
    setTimeRemaining(initialTime);

    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining();
      setTimeRemaining(newTime);

      if (newTime.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [placedOn]);

  // Don't render if expired
  if (timeRemaining.isExpired) {
    return null;
  }

  const formatTime = (minutes: number, seconds: number): string => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <span>
      <Typography
        variant="body2"
        sx={{
          color: "error.main",
          fontWeight: 500,
        }}
      >
        Your payment session will expire in{" "}
        {formatTime(timeRemaining.minutes, timeRemaining.seconds)}
      </Typography>
    </span>
  );
};

export default PaymentTimer;
