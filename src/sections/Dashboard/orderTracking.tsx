import React, { useState } from "react";
import { Box, Grid, Card, Typography, Button, InputBase } from "@mui/material";
import { getOrderItems } from "./profileService/profileService";
import { useNavigate } from "react-router-dom";
import { ReactComponent as OrdersIcon } from "../../assets/media/icons/Orders.svg";
import { ReactComponent as CardsIcon } from "../../assets/media/icons/savedCard.svg";
import { ReactComponent as SupportIcon } from "../../assets/media/icons/helpsupport.svg";
import { ReactComponent as AddressIcon } from "../../assets/media/icons/address.svg";
import { ReactComponent as ProfileIcon } from "../../assets/media/icons/pencil-alt.svg";

import { ReactComponent as TicketIcon } from "../../assets/media/icons/doc.svg";

const cardData = [
  {
    icon: <OrdersIcon width={42} height={42} />,
    title: "ORDERS",
    desc: "Manage your Orders",
    path: "/overview/orders",
  },
  {
    icon: <CardsIcon width={42} height={42} />,
    title: "SAVED CARDS",
    desc: "Manage your payment methods",
    path: "/overview/profile",
  },
  {
    icon: <SupportIcon width={42} height={42} />,
    title: "HELP & SUPPORT",
    desc: "Reach out to us anytime",
    path: "/overview/help",
  },
  {
    icon: <AddressIcon width={42} height={42} />,
    title: "ADDRESSES",
    desc: "Manage your Addresses",
    path: "/overview/profile",
  },
  {
    icon: <ProfileIcon width={42} height={42} />,
    title: "PROFILE DETAILS",
    desc: "Manage your Profile information",
    path: "/overview/profile",
  },

  {
    icon: <TicketIcon width={30} height={30} />,
    title: "MY TICKETS",
    desc: "See your all Tickets information",
    path: "/overview/view-tickets",
  },
];

const Overview: React.FC = () => {
  const [orderNum, setOrderNum] = useState("");
  const [orderNumError, setOrderNumError] = useState("");
  const [fetchedOrderSummary, setFetchedOrderSummary] = useState<any>(null);
  const navigate = useNavigate();

  const handleTrackOrder = async () => {
    setFetchedOrderSummary(null);
    if (orderNum === "") {
      setOrderNumError("Please enter your Order Id/Track Id");
    } else if (orderNum.length < 22) {
      setOrderNumError("Order Id/Track Id must be at least 22 digits");
    } else {
      setOrderNumError("");
      try {
        if (!orderNum.trim()) return;

        const result = await getOrderItems(orderNum);
        if (result.id === null) {
          setOrderNumError(
            "No order found for this Order Id/Track Id. Please check and try again."
          );
        } else {
          setFetchedOrderSummary(result);
          console.log("Fetched Order Summary:", result);
        }
      } catch (error) {
        console.error("Error fetching order summary", error);
        setFetchedOrderSummary(null);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "1100px", mx: "auto", p: 3 }}>
      <Typography
        sx={{
          fontWeight: "500px",
          fontSize: "30px",
          lineHeight: "38px",
          mb: 2,
        }}
      >
        Overview
      </Typography>
      {fetchedOrderSummary && fetchedOrderSummary?.orderNum && (
        <Card
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            border: "2px solid",
            borderColor: (theme) => theme.palette.info.main,
          }}
        >
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h6" fontWeight={600}>
                Your order will be delivered by{" "}
                <span style={{ color: "black" }}>5 pm today!</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Order #{fetchedOrderSummary?.orderNum}
              </Typography>
            </Grid>
          </Grid>

          {/* Order Items */}
          <Grid container direction="column" spacing={2} mt={2}>
            {fetchedOrderSummary?.productCards.map(
              (product: any, index: number) => (
                <Grid item key={index}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={3} sm={2}>
                      <img
                        src={product.itemImage}
                        alt={product.itemTitle}
                        width="70"
                        height="70"
                        style={{ borderRadius: 8 }}
                      />
                    </Grid>
                    <Grid item xs={9} sm={10}>
                      <Typography fontSize={{ xs: 14, sm: 16 }}>
                        {product.itemTitle}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              )
            )}
          </Grid>
        </Card>
      )}

      {/* Track Order */}
      <Card
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 2,
          border: "2px solid",
          borderColor: (theme) => theme.palette.info.main,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
          fontSize={{ xs: 16, sm: 20 }}
        >
          Track your order
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { sm: "row" },
            border: "1px solid #1E2C24",
            borderRadius: 1,
            overflow: "hidden",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <InputBase
            // fullWidth
            placeholder="Enter your Order Id/Track Id"
            inputProps={{
              maxLength: 24,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            sx={{
              px: 2,
              py: 1.5,
              flex: 1,
              fontSize: { xs: 14, sm: 16 },
              borderBottom: { xs: "1px solid #1E2C24", sm: "none" },
            }}
            value={orderNum}
            onChange={(e) => {
              const inputValue = e.target.value;
              const onlyNumbers = inputValue.replace(/[^0-9]/g, "");

              if (inputValue !== onlyNumbers) {
                setOrderNumError("Only numbers are allowed");
              } else {
                setOrderNumError("");
              }
              setOrderNum(onlyNumbers);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleTrackOrder()}
          />

          <Button
            variant="contained"
            onClick={handleTrackOrder}
            sx={{
              borderRadius: 0,
              bgcolor: "#334F3E",
              px: { xs: 0, sm: 4 },

              py: { xs: 1.5, sm: "auto" },
              width: { sm: "auto" },
              textTransform: "none",
              fontSize: { xs: 14, sm: 16 },
              "&:hover": {
                bgcolor: "#1e2f2f",
              },
            }}
          >
            Track
          </Button>
        </Box>
        {orderNumError && (
          <Typography sx={{ color: (theme) => theme.palette.error.main }}>
            Please enter valid order number
          </Typography>
        )}

        <Typography
          color="text.secondary"
          mt={2}
          fontSize={{ xs: 12, sm: 14 }}
          textAlign={{ xs: "center", sm: "left" }}
        >
          Track your order by entering your Order Id or Tracking Id
        </Typography>
      </Card>

      {/* Profile Sections */}
      <Grid container spacing={1}>
        {cardData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              variant="outlined"
              sx={{
                height: 160,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,
                textAlign: "center",
                cursor: "pointer",
                border: "2px solid #F1EAE4",
                borderColor: (theme) => theme.palette.info.main,
                transition: "0.2s",
                "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
              }}
              onClick={() => navigate(item.path)}
            >
              <Box>{item.icon}</Box>
              <Typography fontWeight="bold" mt={1} fontSize="14px">
                {item.title}
              </Typography>
              <Typography color="text.secondary" fontSize="13px">
                {item.desc}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Overview;
