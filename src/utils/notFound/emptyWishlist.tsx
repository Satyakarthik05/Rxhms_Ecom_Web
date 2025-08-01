import React from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmptyWishlistImage from "../../assets/media/icons/Frame.svg"; 

const EmptyWishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box
        component="img"
        src={EmptyWishlistImage}
        alt="Empty Wishlist"
        sx={{
          width: isMobile ? "50%" : "160px",
          height: "auto",
          maxHeight: isMobile ? "140px" : "160px",
          objectFit: "contain",
          mb: 2,
        }}
      />

      <Typography variant="h5" fontWeight="600" gutterBottom>
        Your Wishlist is Empty
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: "480px" }}
      >
        Tap the heart icon to start saving items you love. You can find them all
        here anytime.
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: "#334F3E",
          borderRadius: 1,
          px: 4,
          py: 1.5,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#2f3e30",
          },
        }}
        onClick={() => navigate("/")}
      >
        Add Now
      </Button>
    </Box>
  );
};

export default EmptyWishlistPage;
