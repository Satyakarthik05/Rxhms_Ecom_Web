import React from "react";
import "./headerOffer.css";
import { Box } from "@mui/material";

export const HeaderOffer = () => {
  return (
    <div>
      <Box
        sx={{ fontSize: { xs: "10px", md: "15px" } }}
        className="offer-text text-center"
      >
        Flat ₹100 off on your first order | Get up to ₹500 off on orders between
        ₹1000–₹2000!
      </Box>
    </div>
  );
};
