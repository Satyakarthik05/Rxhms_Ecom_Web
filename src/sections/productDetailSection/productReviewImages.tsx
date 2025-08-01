import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ItemDetails } from "../inventoryProduct/model/ItemDetails";
import { useNavigate, useParams } from "react-router-dom";
import { ProductReviews } from "../inventoryProduct/model/ProductReviews";

interface ReviewImageMeta {
  imageUrl: string;
  title: string;
  description: string;
  username: string;
}

const ProductReviewImages: React.FC<{
  reviews: ProductReviews[];
  itemDetails: ItemDetails;
}> = ({ reviews, itemDetails }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { slug } = useParams();

  const images: ReviewImageMeta[] = reviews.flatMap(
    (review) =>
      review.productReviewGalleryList?.map((gallery) => ({
        imageUrl: gallery.imageUrl,
        title: review.title,
        description: review.description,
        username: review.username,
      })) || []
  );

  const visibleImages = images.slice(0, 6);
  const remainingCount = images.length - visibleImages.length;

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOpenAllImages = () => {
    navigate(`/product/reviews/gallery/${slug}`, { state: { itemDetails } });
  };
  

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, color: "#334F3E" }}
      >
        GALLERY
      </Typography>
      <Grid container spacing={1}>
        {visibleImages.map((img, index) => (
          <Grid item xs={4} key={index}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                overflow: "hidden",
                borderRadius: 1,
                cursor: "pointer",
              }}
              onClick={() =>
                index === 5 && remainingCount > 0
                  ? handleOpenAllImages()
                  : handleOpen(index)
              }
            >
              <Box
                component="img"
                src={img.imageUrl}
                alt={img.title}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {index === 5 && remainingCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  +{remainingCount}
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: "relative", p: 3 }}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={handlePrev}>
              <ArrowBackIosNewIcon />
            </IconButton>

            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Box
                component="img"
                src={images[currentIndex].imageUrl}
                alt={images[currentIndex].title}
                sx={{ maxHeight: 400, maxWidth: "100%", borderRadius: 2 }}
              />
              <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
                {images[currentIndex].title}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {images[currentIndex].description}
              </Typography>
              <Typography variant="caption" sx={{ color: "green" }}>
                Posted by: {images[currentIndex].username}
              </Typography>
            </Box>

            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductReviewImages;
