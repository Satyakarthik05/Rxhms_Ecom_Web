import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { OrderMaster } from "../myCart/model/orderMaster";
import { OrdersByOrderNum } from "./profileService/profileService";
import AddProductReviewDrawer from "../productDetailSection/addProductReviewDrawer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

const OrderedProductRatings = () => {
  const { orderNum } = useParams<{ orderNum: string }>();

  const {
    data: order,
    isLoading,
    error,
  } = useFetchByQuery<OrderMaster>(OrdersByOrderNum, { orderNum });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openReviewDrawer, setOpenReviewDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: number;
    itemImage: string;
  } | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddReview = (productId: number, itemImage: string) => {
    setSelectedProduct({ productId, itemImage });
    setOpenReviewDrawer(true);
    dispatch(removeSticky());
  };

  const handleReviewSubmitted = (newReview: ProductReviews) => {};

  if (isLoading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={3}>
        <Typography color="error">Failed to load order details.</Typography>
      </Box>
    );
  }

  return (
    <>
      {!isMobile && (
        <Box
          sx={{
            padding: 1,
            backgroundColor: (theme) => theme.palette.info.main,
          }}
        >
          <div className="container">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={
                <NavigateNextOutlinedIcon
                  fontSize="small"
                  sx={{ color: "#77878F" }}
                />
              }
            >
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate("/overview/orders")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },

                  fontWeight: 500,
                }}
              >
                Orders
              </Link>
              <Link
                underline="hover"
                color="inherit"
                sx={{
                  cursor: "default",
                  "&:hover": {
                    textDecoration: "none",
                  },
                  color: (theme) => theme.palette.success.light,
                  fontWeight: 500,
                }}
              >
                Product Rating
              </Link>
            </Breadcrumbs>
          </div>
        </Box>
      )}
      <Box
        className="container d-flex flex-row justify-content-center"
        sx={{ minHeight: "85vh", py: { xs: 3, md: 5 } }}
      >
        <Box sx={{ minWidth: { xs: "100%", md: "70%" } }}>
          <Box
            className="gap-4 mb-3 d-flex flex-row justify-content-start align-items-center"
            sx={{ color: (theme) => theme.palette.success.main }}
          >
            <Typography
              sx={{ color: (theme) => theme.palette.success.light }}
              fontWeight="600"
              fontSize="1.8rem"
            >
              Order ID - #{order.orderNum}
            </Typography>

            <Typography
              sx={{ color: (theme) => theme.palette.success.light }}
              fontWeight="400"
              fontSize="0.9rem"
            >
              Order Placed {new Date(order.placedOn).toDateString()}
            </Typography>
          </Box>

          <Box>
            {order.orderItems.map((each) => (
              <Card
                key={each.id}
                variant="outlined"
                sx={{
                  maxWidth: "100%",
                  my: 1,
                  border: "1.5px solid #F1EAE4",
                }}
              >
                <Box className="p-3 d-flex flex-row justify-content-between align-items-center">
                  <Box className="d-flex">
                    <Box
                      sx={{
                        borderRadius: "0.4375rem",
                        backgroundColor: "#f5f5f5",
                        width: "6.25rem",
                        height: "6.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={each.productCard.itemImage}
                        alt={each.productCard.productTitle}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>

                    <Box className="ms-3 mt-2">
                      <Typography
                        sx={{
                          color: "#1E2C24",
                          fontFamily: "Inter",
                          fontSize: "1rem",
                          fontWeight: 500,
                          lineHeight: "1.375rem",
                          letterSpacing: "-0.01rem",
                        }}
                      >
                        {each.productCard.itemTitle}
                      </Typography>

                      <Button
                        sx={{
                          mt: 1,
                          px: 0,
                          fontSize: "14px",

                          color: "red",
                          textTransform: "none",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          handleAddReview(
                            each.productCard.productId!,
                            each.productCard.itemImage
                          )
                        }
                      >
                        Write a Review
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>

        <AddProductReviewDrawer
          open={openReviewDrawer}
          onClose={() => {
            setOpenReviewDrawer(false);
            dispatch(addSticky());
          }}
          productImage={selectedProduct?.itemImage || ""}
          productId={selectedProduct?.productId || 0}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </Box>
    </>
  );
};

export default OrderedProductRatings;
