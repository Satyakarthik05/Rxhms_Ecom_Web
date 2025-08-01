import React, { useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Snackbar,
  TextField,
  Typography,
  Rating,
  IconButton,
  Box,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";
import { AddProductReview } from "./service/getitemsDetails";
import { ProductReviewGallery } from "../inventoryProduct/model/productReviewGallery";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  productImage: string;
  productId: number;
  onReviewSubmitted: (review: ProductReviews) => void;
}

const AddProductReviewDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  productImage,
  productId,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const username = useSelector((store: RootState) => store.jwtToken.username);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [errors, setErrors] = useState({
    title: "",
    displayName: "",
    review: "",
    rating: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {
      title: "",
      displayName: "",
      review: "",
      rating: "",
    };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      valid = false;
    }

    if (!displayName.trim()) {
      newErrors.displayName = "Display name is required";
      valid = false;
    } else if (displayName.trim().length < 3) {
      newErrors.displayName = "Display name must be at least 3 characters";
      valid = false;
    }

    if (!review.trim()) {
      newErrors.review = "Review is required";
      valid = false;
    } else if (review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters";
      valid = false;
    }

    if (!rating || rating < 0.5) {
      newErrors.rating = "Please give a rating";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCloseDrawer = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setDisplayName("");
    setReview("");
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const productReviewGalleryListItems: ProductReviewGallery[] = images.map(
        (image, index) => ({
          id: index,
          productId: productId,
          reviewId: 1,
          fileId: index + 1,
          imageUrl: URL.createObjectURL(image),
        })
      );

      const newReview: ProductReviews = {
        id: null,
        productId: productId,
        username: username,
        title: title,
        displayName: displayName,
        description: review,
        rating: rating,
        generatedOn: new Date().toISOString(),
        displayable: true,
        productReviewGalleryList: productReviewGalleryListItems,
      };

      const response = await AddProductReview(newReview, images);
      console.log("Review submitted successfully:", response);
      onReviewSubmitted(newReview);

      setSnackbar({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
      handleCloseDrawer();
      console.log("Review submission response:", response);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setSnackbar({
        open: true,
        message: `Error submitting review: ${error.message}`,
        severity: "error",
      });
    }
  };

  return (
    <>
      <Drawer
        placement={placement}
        onClose={handleCloseDrawer}
        open={open}
        width={500}
        className="custom-drawer p-3"
        style={{ zIndex: 1050, position: "absolute" }}
        closable={false}
        height={"100vh"}
      >
        <div style={{ height: "90%" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold m-0">Write Review</h4>
            <button className="btn btn-light border-0" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <hr className="my-3" />
          <form className="h-100" onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <img
                    src={productImage}
                    alt="Product"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 4,
                      border: "1px solid #ddd",
                    }}
                  />
                  <label className="form-label fw-semibold">
                    How was the item?
                  </label>
                </Box>

                <label className="form-label fw-semibold">
                  Add your rating and review!{" "}
                  <span className="text-danger fs-5">*</span>
                </label>

                <div className="mb-0">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <Rating
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue ?? 0);
                          setErrors((prev) => ({ ...prev, rating: "" }));
                        }}
                        size="large"
                        className="mb-3"
                        precision={0.5}
                      />
                      {errors.rating && (
                        <p
                          className="text-danger mt-1 mb-3"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {errors.rating}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="reviewTitle"
                    className="form-label fw-semibold"
                  >
                    Title your review{" "}
                    <span className="text-danger fs-5">*</span>
                  </label>
                  <input
                    type="text"
className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    id="reviewTitle"
                    placeholder="What's most important to know?"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (e.target.value.trim().length >= 3) {
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                  />
                  {errors.title && (
                    <p
                      className="text-danger mt-1"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="displayName"
                    className="form-label fw-semibold"
                  >
                    Display Name <span className="text-danger fs-5">*</span>
                  </label>
                  <input
                    type="text"
    className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                    id="displayName"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (e.target.value.trim().length >= 3) {
                        setErrors((prev) => ({ ...prev, displayName: "" }));
                      }
                    }}
                  />
                  {errors.displayName && (
                    <div className="text-danger mt-1">{errors.displayName}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="reviewText"
                    className="form-label fw-semibold"
                  >
                    Write a review <span className="text-danger fs-5">*</span>
                  </label>
                  <textarea
                    id="reviewText"
    className={`form-control ${errors.review ? "is-invalid" : ""}`}
                    rows={4}
                    placeholder="Add your review..."
                    value={review}
                    onChange={(e) => {
                      setReview(e.target.value);
                      if (e.target.value.trim().length >= 10) {
                        setErrors((prev) => ({ ...prev, review: "" }));
                      }
                    }}
                  />
                  {errors.review && (
                    <div className="text-danger mt-1">{errors.review}</div>
                  )}
                </div>
                <div className="mb-5">
                  <label className="form-label fw-semibold">
                    Share a Photo
                  </label>
                  <div
                    className="border mb-5 rounded d-flex flex-column justify-content-center align-items-center p-5 bg-light"
                    style={{
                      height: "150px",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    onClick={() =>
                      document.getElementById("imageUploadInput")?.click()
                    }
                  >
                    <input
                      type="file"
                      id="imageUploadInput"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="d-none"
                      multiple
                    />
                    {images.length === 0 ? (
                      <>
                        <ImageOutlinedIcon
                          style={{ fontSize: "30px", color: "#6c757d" }}
                        />
                        <span className="text-muted mt-2">Upload</span>
                      </>
                    ) : (
                      <div className="d-flex mt-3 flex-wrap gap-2">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="position-relative"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={image.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                color: "#fff",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    backgroundColor: "#fff",
                    width: "85%",
                  }}
                  className=" py-2 d-flex justify-content-between gap-5 mt-4"
                >
                  <Button
                    variant="outlined"
                    onClick={handleCloseDrawer}
                    fullWidth
                    sx={{
                      borderColor: "#334F3E",
                      color: "#334F3E",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#334F3E",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                  >
                    Submit Review
                  </Button>
                </Box>
              </div>
            </div>
          </form>
        </div>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default AddProductReviewDrawer;
