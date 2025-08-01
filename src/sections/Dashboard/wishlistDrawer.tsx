import React, { useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { Wishlist } from "./model/wishlist";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  createWishlistAsync,
  getWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import { PageState } from "../../web-constants/constants";
import { Box, Button } from "@mui/material";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
}

const CustomDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
}) => {
  const dispatch = useDispatch();
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const wishlistStatus = useSelector(
    (store: RootState) => store.wishlist.status
  );

  const [wishlistData, setWishlistData] = useState<Wishlist>({
    id: null,
    customerId: null,
    username: "",
    name: "",
    sharable: true,
    isDefault: true,
    wishlistItem: {} as any,
  });

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

  const handleAddToNewWishlist = async (e: React.FormEvent) => {
    e.preventDefault();

    const wishlistPayload = {
      username: username,
      name: wishlistData.name.trim(),
      sharable: wishlistData.sharable,
      isDefault: wishlistData.isDefault,
    };

    try {
      const resultAction = await dispatch(
        createWishlistAsync(wishlistPayload) as any
      );

      if (createWishlistAsync.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload as string;
        setSnackbar({
          open: true,
          message: errorPayload || "Failed to create wishlist.",
          severity: "error",
        });
      } else {
        await dispatch(getWishlistAsync({ username }) as any);
        setSnackbar({
          open: true,
          message: "Wishlist created successfully!",
          severity: "success",
        });
        resetForm();
        onClose();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseDrawer = () => {
    resetForm();
    onClose();
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;

  if (name === "name") {
    // Allow only letters (a-zA-Z) and numbers (0-9)
    const alphanumericValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
    setWishlistData((prev) => ({
      ...prev,
      [name]: alphanumericValue,
    }));
  } else {
    setWishlistData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }
};


  const resetForm = () => {
    setWishlistData({
      id: null,
      customerId: null,
      username: "",
      name: "",
      sharable: true,
      isDefault: true,
      wishlistItem: {} as any,
    });
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
            <h4 className="fw-bold m-0">Create New Wishlist</h4>
            <button className="btn btn-light border-0" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <hr className="my-3" />
          <form className="h-100" onSubmit={handleAddToNewWishlist}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="mb-3">
                  <label htmlFor="wishlistName" className="form-label fw-bold">
                    Wishlist Name
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="wishlistName"
                      name="name"
                      value={wishlistData.name}
                      onChange={handleChange}
                      placeholder="Enter wishlist name"
                      required
                      minLength={3}
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sharable"
                    name="sharable"
                    checked={wishlistData.sharable}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="sharable"
                  >
                    Sharable
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={wishlistData.isDefault}
                    onChange={handleChange}
                   
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="isDefault"

                  >
                    Set as Default Wishlist
                  </label>
                </div>
              </div>

              <div className="d-flex justify-content-between gap-2 mt-4">
                <Box flex={1}> 
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCloseDrawer}
                    sx={{
                      borderColor: "#334F3E",
                      color: "#334F3E",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#334F3E",
                        color: "#fff",
                        borderColor: "#334F3E",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box flex={1}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: "#334F3E",
                      color: "#fff",
                      textTransform: "none",
                       border: "1px solid #334F3E",
                      "&:hover": {
                        backgroundColor: "#fff",
                        color: "#334F3E",
                        border: "1px solid #334F3E",
                          boxShadow: "none",
                      },
                    }}
                  >
                    Save
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

export default CustomDrawer;
