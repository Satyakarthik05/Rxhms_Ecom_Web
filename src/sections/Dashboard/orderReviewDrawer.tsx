"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Snackbar, Rating, Box } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import type { ProductReviews } from "../inventoryProduct/model/ProductReviews";
import type { OrderRatingsDetails } from "./model/orderRatingsDetails";
import { useFetch } from "../../customHooks/useFetch";
import {
  addRatingsDetailsUri,
  createReview,
  reviewElements,
} from "./profileService/profileService";
import type { OrderRatingElements } from "./model/orderRatingElements";
import { usePostByBody } from "../../customHooks/usePostByBody";
import type { OrderReviews } from "./model/orderReviews";
import { OrderReviewRequest } from "./model/orderReviewRequest";
import { OrderMaster } from "../myCart/model/orderMaster";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  productImage?: string;
  orderId: number | false | null;
  productId: number;
  orders : OrderMaster[];
  setOrders : ( orders : OrderMaster[]) => void;
  onReviewSubmitted: (review: ProductReviews) => void;
}

const OrderReviewDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  productImage,
  orderId,
  productId,
  orders,
   setOrders,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<OrderRatingsDetails[]>([]);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const { data: orderReviewElementesData } =
    useFetch<OrderRatingElements[]>(reviewElements);
  console.log("orderReviewElementesData", orderReviewElementesData);

 useEffect(() => {
  if (orderReviewElementesData) {
    const ratingElements: OrderRatingsDetails[] = orderReviewElementesData.map((each) => ({
      elementId: each.id,
      rating: 0,
    }));
    setRating(ratingElements);
  }
}, [orderReviewElementesData]);



  const { error, executePost } = usePostByBody();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseDrawer = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setRating([]);
    setTitle("");
    setReview("");
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const ratedOnly = rating.filter((r) => r.rating > 0);

  if (!ratedOnly.length || !title.trim() || !review.trim()) {
    setSnackbar({
      open: true,
      message: "Please provide at least one rating and fill all fields",
      severity: "warning",
    });
    return;
  }


  try {
    const ratingsMap: Record<number, number> = {};
    ratedOnly.forEach((r) => {
      ratingsMap[r.elementId] = r.rating;
    });

    const orderReviewRequest: OrderReviewRequest = {
      orderId: Number(orderId), 
      title: title.trim(),
      description: review.trim(),
      ratings: ratingsMap,
    };

    console.log("###orderReviewRequest", orderReviewRequest);

    const response = await executePost(createReview, orderReviewRequest);

    if (response !== null && !error) {
      setSnackbar({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
      const newOrders = orders.map((order) => order.id === orderId ? { ...order, isReviewed: true } : order);
      setOrders(newOrders);
      handleCloseDrawer();
    } else {
      throw new Error("Failed to submit review");
    }
  } catch (error: any) {
    console.error("Submission Error:", error);
    setSnackbar({
      open: true,
      message: `Error submitting: ${error.message}`,
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
        style={{ zIndex: 1050, position: "absolute",  }}
        closable={false}
        height={"100vh"}
        maskStyle={{  backgroundColor: "rgba(0, 0, 0, 0.1)", }}
      >
        <div style={{ height: "90%" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold m-0">Order Review</h4>
            <button className="btn btn-light border-0" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <hr className="my-3" />
          <form className="h-100" onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="mb-0">
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      {orderReviewElementesData &&
                        orderReviewElementesData?.length > 0 &&
                        orderReviewElementesData.map(
                          (item: OrderRatingElements) => (
                            <Box key={item.id}>
                              <label className="form-label fw-semibold">
                                {item.title}
                              </label>
                              <Rating
                                onChange={(_, newValue) => {
                                  if (typeof orderId === "number") {
                                    setRating((prev: OrderRatingsDetails[]) => {
                                      const index = prev.findIndex(
                                        (each: OrderRatingsDetails) =>
                                          each.elementId === item.id
                                      );
                                      if (index >= 0) {
                                        const copy = [...prev];
                                        copy[index].rating = newValue ?? 0;
                                        return copy;
                                      } else {
                                        return [
                                          ...prev,
                                          {
                                            orderId: orderId,
                                            elementId: item.id,
                                            rating: newValue ?? 0,
                                          },
                                        ];
                                      }
                                    });
                                  }
                                }}
                                size="large"
                                className="mb-3"
                                precision={0.5}
                              />
                              <br />
                            </Box>
                          )
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
                    className="form-control"
                    id="reviewTitle"
                    placeholder="What's most important to know?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
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
                    className="form-control"
                    rows={4}
                    placeholder="Add your review..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-between gap-2 mt-4">
                  <Button
                    variant="outlined"
                    onClick={handleCloseDrawer}
                    sx={{
                      borderColor: "#334F3E",
                      color: "#334F3E",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ backgroundColor: "#334F3E", textTransform: "none" }}
                  >
                    Submit Review
                  </Button>
                </div>
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

export default OrderReviewDrawer;
