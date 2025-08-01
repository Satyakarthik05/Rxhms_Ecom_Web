import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Collapse,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import AddProductReviewDrawer from "./addProductReviewDrawer";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import { useDispatch } from "react-redux";
import ProductReviewImages from "./productReviewImages";
import { useNavigate } from "react-router-dom";
import { ItemDetails } from "../inventoryProduct/model/ItemDetails";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { getItemDetails, RatingsSummary } from "./service/getitemsDetails";
import { DataSection } from "../header/model/dataSection";
import { ProductReviewSummary } from "../inventoryProduct/model/productReviewSummary";

interface reviewsProp {
  productReviews?: ProductReviews[] | null;
  description: string;
  productImage: string;
  productId: number;
  slug: string;
  itemDetails: ItemDetails;
  productData: DataSection[];
  productCode: string;
}

const ReviewSection: React.FC<reviewsProp> = ({
  productReviews,
  description,
  productImage,
  productId,
  slug,
  itemDetails,
  productData,
  productCode,
}) => {
  const [openReviewDrawer, setOpenReviewDrawer] = useState(false);
  const [showReviews, setShowReviews] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [showBenifits, sethowBenifits] = useState(true);
  const [reviews, setReviews] = useState<ProductReviews[]>(
    [...(productReviews ?? [])].sort(
      (a, b) =>
        new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime()
    )
  );

  const { data: fetchedItemDetails } = useFetchByQuery<ItemDetails>(
    getItemDetails,
    {
      itemSlug: slug,
    }
  );
  const { data: ProductReviewSummary } = useFetchByQuery<ProductReviewSummary>(
    RatingsSummary,
    {
      productCode: productCode,
    }
  );

  console.log("ProductReviewSummary", ProductReviewSummary);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  const [visibleCount, setVisibleCount] = useState(5);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleAddReview = () => {
    setOpenReviewDrawer(true);
    dispatch(removeSticky());
  };

  const toggleReviews = () => {
    setShowReviews((prev) => !prev);
  };

  const handleReviewSubmitted = (newReview: ProductReviews) => {
    setReviews((prev) =>
      [newReview, ...prev].sort(
        (a, b) =>
          new Date(b.generatedOn).getTime() - new Date(a.generatedOn).getTime()
      )
    );
  };

  const handleViewMore = () => {
    navigate(`/product/reviews/${slug}`, { state: { itemDetails } });
  };

  const handleImageClick = (img: any, review: ProductReviews) => {
    setSelectedImage({
      ...img,
      username: review.username,
      title: review.title,
      description: review.description,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };
  if (ProductReviewSummary) {
    var ratings = [
      ProductReviewSummary?.fiveStar,
      ProductReviewSummary?.fourStar,
      ProductReviewSummary?.threeStar,
      ProductReviewSummary?.twoStar,
      ProductReviewSummary?.oneStar,
    ];
  }

  return (
    <Box
      className="container"
      sx={{ margin: "auto", padding: { xs: 2, lg: 0 }, pt: { xs: 0, lg: 1.5 } }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => sethowBenifits((prev) => !prev)}
            variant="h6"
            fontWeight="bold"
          >
            BENEFITS
          </Typography>
        </Box>
        <Box onClick={() => sethowBenifits((prev) => !prev)}>
          <IconButton
            size="small"
            sx={{
              backgroundColor: (theme) => theme.palette.success.main,
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              mt: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.main,
                color: "#fff",
              },
            }}
          >
            {showBenifits ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showBenifits}>
        {Array.isArray(productData) &&
          productData.map((each) => (
            <Box key={each.id}>
              <Typography sx={{ fontWeight: "600" }} variant="body2" mt={1}>
                {each.title}
              </Typography>
              <Typography variant="body2" mt={1}>
                {each.description}
              </Typography>
            </Box>
          ))}
        {/* <Button
          sx={{ textTransform: "none", color: "#d4a017", mt: 1 }}
          startIcon={<ExpandMore />}
        >
          Read More
        </Button> */}
      </Collapse>

      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{ cursor: "pointer" }}
            onClick={() => setShowDescription((prev) => !prev)}
            variant="h6"
            fontWeight="bold"
          >
            DESCRIPTION
          </Typography>
        </Box>
        <Box onClick={() => setShowDescription((prev) => !prev)}>
          <IconButton
            size="small"
            sx={{
              backgroundColor: (theme) => theme.palette.success.main,
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              mt: 0.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.main,
                color: "#fff",
              },
            }}
          >
            {showDescription ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showDescription}>
        <Typography variant="body2" mt={1}>
          {description}
        </Typography>
        {/* <Button
          sx={{ textTransform: "none", color: "#d4a017", mt: 1 }}
          startIcon={<ExpandMore />}
        >
          Read More
        </Button> */}
      </Collapse>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: "pointer" }}
          onClick={toggleReviews}
        >
          <Typography variant="h6" fontWeight="bold">
            REVIEWS
          </Typography>
        </Box>
        <Box onClick={toggleReviews}>
          <IconButton
            size="small"
            sx={{
              backgroundColor: (theme) => theme.palette.success.main,
              color: "#fff",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.main,
                color: "#fff",
              },
            }}
          >
            {showReviews ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={showReviews}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          mt={1}
        >
          {reviews.length > 0 && (
            <Typography variant="subtitle1">
              Ratings( {ProductReviewSummary?.customerCount} customers)
            </Typography>
          )}

          <Typography
            sx={{
              cursor: "pointer",
              color: "#334F3E",
              textDecoration: "underline",
              fontWeight: 500,
            }}
            onClick={handleAddReview}
          >
            Write Review
          </Typography>
        </Box>

        {ProductReviewSummary && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  {/* Left Side: Rating Summary */}
                  <Box>
                    <Typography variant="h2" fontWeight="bold" lineHeight={1.2}>
                      {ProductReviewSummary?.avgRating}
                    </Typography>
                    <Rating
                      value={ProductReviewSummary?.avgRating}
                      precision={0.1}
                      readOnly
                      size="large"
                    />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {ProductReviewSummary?.ratingTitle}
                    </Typography>
                  </Box>

                  {/* Right Side: Ratings Breakdown */}
                  <Box sx={{ ml: 2, flex: 1 }}>
                    {[5, 4, 3, 2, 1].map((star, idx) => (
                      <Box key={star} display="flex" alignItems="center" mt={1}>
                        <Typography fontSize="14px" minWidth="16px">
                          {star}
                        </Typography>
                        <Box sx={{ color: "#fbc02d", mx: 0.5 }}>★</Box>
                        <Box
                          sx={{
                            flexGrow: 1,
                            backgroundColor: "#f5f5f5",
                            height: 6,
                            borderRadius: 3,
                            mx: 1,
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              height: "100%",
                              width: `${
                                (ratings[idx] /
                                  ProductReviewSummary.customerCount) *
                                100
                              }%`,
                              backgroundColor: "#000",
                              borderRadius: 3,
                            }}
                          />
                        </Box>
                        <Typography
                          fontSize="14px"
                          minWidth="30px"
                          textAlign="right"
                        >
                          {ratings[idx]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Optional: Product review images */}
                <Box mt={2}>
                  {reviews?.some(
                    (r) => r.productReviewGalleryList?.length > 0
                  ) && (
                    <ProductReviewImages
                      reviews={reviews}
                      itemDetails={itemDetails}
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box
                sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}
                onScroll={(e) => {
                  const target = e.currentTarget;
                  if (
                    target.scrollTop + target.clientHeight >=
                    target.scrollHeight - 10
                  ) {
                    setVisibleCount((prev) => prev + 5);
                  }
                }}
              >
                {reviews.slice(0, visibleCount).map((review) => (
                  <Box
                    key={review.id}
                    sx={{ my: 2, pl:3 , borderBottom: "1px solid #ddd", pb: 2 }}
                  >
                    <CardContent sx={{ px: 0 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {review.title}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        precision={0.5}
                      />
                      <Typography variant="body2" mt={1}>
                        {review.description}
                      </Typography>
                      {review.productReviewGalleryList?.length > 0 && (
                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                          {review.productReviewGalleryList.map((img) => (
                            <Box
                              key={img.id}
                              component="img"
                              src={img.imageUrl}
                              alt="review"
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                objectFit: "cover",
                                cursor: "pointer",
                              }}
                              onClick={() => handleImageClick(img, review)}
                            />
                          ))}
                        </Box>
                      )}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        mt={1}
                      >
                        {review.username} | Posted on{" "}
                        {new Date(review.generatedOn).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Kolkata",
                          }
                        )}
                      </Typography>
                    </CardContent>
                  </Box>
                ))}
              </Box>
              {reviews.length > 0 && (
                <Button
                  size="small"
                  sx={{
                    mt: 1,
                    ml:2,
                    color: "#d4a017",
                    textTransform: "none",
                    fontWeight: 500,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={handleViewMore}
                >
                  View More
                </Button>
              )}
            </Grid>
          </Grid>
        )}

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button sx={{ textTransform: "none", color: "#d4a017", mt: 2 }}>
            View more
          </Button>
        </Box> */}
      </Collapse>

      <AddProductReviewDrawer
        open={openReviewDrawer}
        onClose={() => {
          setOpenReviewDrawer(false);
          dispatch(addSticky());
        }}
        productImage={productImage}
        productId={productId}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 3 }}>
          <IconButton
            onClick={handleDialogClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                sx={{ maxHeight: 400, maxWidth: "100%", borderRadius: 2 }}
              />
              <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
                {selectedImage.title}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {selectedImage.description}
              </Typography>
              <Typography variant="caption" sx={{ color: "green" }}>
                Posted by: {selectedImage.username}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReviewSection;
