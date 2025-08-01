import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Button } from "antd";

type OtpTimerProps = {
  onExpire?: () => void;
  resendOtp?: (val?: any) => void;
};

const OtpTimer: React.FC<OtpTimerProps> = ({ onExpire, resendOtp }) => {
  const [timer, setTimer] = useState<number>(90);
  const [resetTrigger, setResetTrigger] = useState<number>(0); // to force timer restart

  useEffect(() => {
    let isMounted = true;
    setTimer(90); // Reset timer to 90

    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (isMounted && onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, [resetTrigger]);

  const handleResend = () => {
    resendOtp?.();
    setResetTrigger(Date.now());
  };

  if (timer <= 0)
    return (
      <Button onClick={handleResend} type="link">
        <Typography className="text-danger" variant="body2" sx={{ mt: 2 }}>
          Resend OTP
        </Typography>
      </Button>
    );

  return (
    <Typography className="text-start" variant="body2" sx={{ mt: 2 }}>
      Time Remaining: {Math.floor(timer / 60)}:
      {(timer % 60).toString().padStart(2, "0")}
    </Typography>
  );
};

export default OtpTimer;
