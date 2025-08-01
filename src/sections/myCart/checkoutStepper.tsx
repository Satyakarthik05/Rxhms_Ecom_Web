import React from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const steps = ["Cart", "Checkout", "Payment"];
const stepRoutes = [
  "/cart/bag",
  "/cart/bag/checkout",
  "/cart/bag/ordersummary",
];

const CheckoutStepper: React.FC = () => {
  const location = useLocation();
  const activeStep = stepRoutes.indexOf(location.pathname);
  const summaryPath = location.pathname === stepRoutes[2];

  const cart = useSelector((state: any) => state.cart.cart);
  console.log("cart", cart);

  const hasItems = cart.cartItems?.length > 0;
  console.log("hasItems", hasItems);

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      {hasItems && !summaryPath && (
        <Stepper alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel
                icon={
                  <CheckCircleIcon
                    sx={{
                      color: index <= activeStep ? "#00c853" : "#c8e6c9",
                    }}
                  />
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      <Box sx={{ mt: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default CheckoutStepper;
