import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { RootState } from "../../Redux/store/store";
import { GiftFilled } from "@ant-design/icons";
import {
  ChevronRight,
  ChevronRightOutlined,
  ChevronRightRounded,
  ChevronRightSharp,
} from "@mui/icons-material";
// import {
//   decrementCart,
//   incrementCart,
//   removeFromCart,
// } from "../../Redux/slices/cartSlice";

function App() {
  const cart = useSelector((state: RootState) => state.cart);
  // const { customerId } = cart;
  const dispatch = useDispatch();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", gap: 3 }}>
        {/* Left Section - Cart Items */}
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 2, mb: 2, bgcolor: "#FFF5F5" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <GiftFilled size={20} />
              <Typography variant="body1">Pick your free samples</Typography>
              {/* <ChevronRightSharp size={20} /> */}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Click here to explore free samples.
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {/* My Bag ( item{totalQuantity !== 1 ? "s" : ""}) */}
            </Typography>

            {/* {cartlist.map((item: any) => (
              <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" gutterBottom>
                        {item.title}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="h6">{item.price}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ₹{item.originalPrice}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          (15% OFF)
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <div className="d-flex flex-row justify-content-between align-items-center">
                          <Button
                            onClick={() => dispatch(decrementCart(item.id))}
                          >
                            -
                          </Button>
                          <Typography sx={{ mx: 2 }}>
                            {item.quantity}
                          </Typography>
                          <Button
                            onClick={() => dispatch(incrementCart(item.id))}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          sx={{ ml: 2 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))} */}
          </Paper>
        </Box>

        {/* Right Section - Price Details */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coupons & Bank Offers
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography>View All</Typography>
              {/* <ChevronRightRounded size={20} /> */}
            </Box>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              RxHMS Points
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              ✓ Earn 68 points with this purchase
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Price Details
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Total MRP</Typography>
                {/* <Typography>₹{totalMRP}</Typography> */}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Discount</Typography>
                {/* <Typography color="success.main">-₹{totalDiscount}</Typography> */}
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight="bold">Total</Typography>
                {/* <Typography fontWeight="bold">₹{finalTotal}</Typography> */}
              </Box>
            </Stack>
          </Paper>

          <FormControlLabel
            control={<Checkbox />}
            label="Receive notification regarding the order in your WhatsApp"
            sx={{ mt: 2 }}
          />

          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            {/* Woohoo! You save ₹{totalDiscount}.00 on this order. */}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "black",
              color: "white",
              "&:hover": {
                bgcolor: "black",
              },
            }}
          >
            Add Address
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
