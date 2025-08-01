import type React from "react";
import { useEffect, useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/store/store";
import type { Wishlist } from "./model/wishlist";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  deleteWishlistAsync,
  getWishlistAsync,
  moveWishlistItemsAsync,
  updateWishlistAsync,
} from "../../Redux/slices/wishListSlice";
import { PageState } from "../../web-constants/constants";
import { DefaultUri } from "./profileService/profileService";
import { Box, Button, IconButton, Typography } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Frame from "../../assets/media/icons/Frame.svg";
import { ReactComponent as TrashIcon } from "../../assets/media/icons/Union.svg";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  wishlistData?: Wishlist | null;
  wishlistlength: number;
}

const ManageWishlistDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  wishlistData = null,
  wishlistlength,
}) => {
  const dispatch = useDispatch();
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const wishlistStatus = useSelector(
    (store: RootState) => store.wishlist.status
  );
  const wishlists = useSelector((store: RootState) => store.wishlist.wishlist);
  const [selectedWishlistId, setSelectedWishlistId] = useState<any>(null);

  const [formData, setFormData] = useState<Wishlist>({
    id: null,
    customerId: null,
    username: "",
    name: "",
    sharable: false,
    isDefault: true,
    wishlistItem: [] as any,
  });
  const alternativeWishlists = wishlists.filter((w) => w.id !== formData.id);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  console.log("##wishlistData", wishlistData);

  useEffect(() => {
    setSelectedWishlistId(null);
  }, []);

  useEffect(() => {
    if (open) {
      if (wishlistData) {
        setFormData((prev) => ({
          ...prev,
          id: wishlistData.id ?? null,
          customerId: wishlistData.customerId ?? null,
          username: username,
          name: wishlistData.name ?? "",
          sharable: wishlistData.sharable,
          isDefault: wishlistData.isDefault ?? true,
          wishlistItem: wishlistData.wishlistItem ?? [],
        }));
      }
    } else {
      setFormData({
        id: null,
        customerId: null,
        username,
        name: "",
        sharable: true,
        isDefault: true,
        wishlistItem: [],
      });
        setSelectedWishlistId(null);
    }
  }, [open, wishlistData, username]);

  const handleAddToNewWishlist = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(updateWishlistAsync(formData) as any);

      if (updateWishlistAsync.fulfilled.match(resultAction)) {
        await dispatch(getWishlistAsync({ username }) as any);
        setSnackbar({
          open: true,
          message: "Wishlist updated successfully!",
          severity: "success",
        });
        onClose();
      } else {
        throw new Error(resultAction.payload || "Failed to update wishlist.");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: (error as Error).message || "Failed to update wishlist.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (formData.id !== null && selectedWishlistId !== null) {
        console.log("Moving items from wishlist");
        await dispatch(
          moveWishlistItemsAsync({
            sourceWishlistId: formData.id,
            destinationWishlistId: selectedWishlistId,
          }) as any
        );
        await dispatch(deleteWishlistAsync({ wishlistId: formData.id }) as any);
        await dispatch(getWishlistAsync({ username }) as any);
        if (wishlistStatus === PageState.SUCCESS) {
          setSelectedWishlistId(null);
          setSnackbar({
            open: true,
            message: "Wishlist deleted successfully!",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete wishlist.",
            severity: "error",
          });
        }
        setDeleteDialogOpen(false);
        onClose();
      } else if (formData.id !== null) {
        console.log("Deleting wishlist without moving items");
        await dispatch(deleteWishlistAsync({ wishlistId: formData.id }) as any);
        await dispatch(getWishlistAsync({ username }) as any);
        if (wishlistStatus === PageState.SUCCESS) {
          setSelectedWishlistId(null);
          setSnackbar({
            open: true,
            message: "Wishlist deleted successfully!",
            severity: "success",
          });
        } else {
          setSnackbar({
            open: true,
            message: "Failed to delete wishlist.",
            severity: "error",
          });
        }
        setDeleteDialogOpen(false);
        onClose();
      }
    } catch (error) {
      if (wishlistStatus === PageState.ERROR) {
        setSnackbar({
          open: true,
          message: "Failed to delete wishlist.",
          severity: "error",
        });
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: any = type === "checkbox" ? checked : value;
    if (name === "name") {
      newValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "isDefault" && formData.id !== null) {
      try {
        await DefaultUri(formData.id, checked);
      } catch (error) {
        console.error("Error calling DefaultUri:", error);
      }
    }
  };

  return (
    <>
      <Drawer
        placement={placement}
        onClose={onClose}
        open={open}
        width={500}
        className="custom-drawer p-3"
        style={{ zIndex: 1050, position: "absolute" }}
        closable={false}
        height={"100vh"}
      >
        <div style={{ height: "90%" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold m-0">Manage Wishlist</h4>
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
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter wishlist name"
                      required
                      minLength={3}
                      maxLength={15}
                    />
                  </div>
                </div>
                <div className="form-check mb-2">
                  <label
                    className="form-check-label fw-bold"
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      name="sharable"
                      checked={formData.sharable}
                      onChange={handleChange}
                    />
                    Sharable
                  </label>
                </div>

                {wishlistlength > 1 && (
                  <>
                    <div className="form-check">
                      <label
                        className="form-check-label fw-bold"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          name="isDefault"
                          checked={formData.isDefault}
                          onChange={handleChange}
                        />
                        Set as Default Wishlist
                      </label>
                    </div>

                    <Box>
                      <Button
                        variant="outlined"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={!formData.id}
                        sx={{
                          mt: 2,
                          borderColor: "#334F3E",
                          color: "#334F3E",
                          textTransform: "none",
                          border: "1px solid #334F3E",
                          "&:hover": {
                            backgroundColor: "#334F3E",
                            color: "#fff",
                            borderColor: "#334F3E",
                          },
                          "&.Mui-disabled": {
                            borderColor: "#ccc",
                            color: "#ccc",
                          },
                        }}
                        fullWidth
                      >
                        Delete
                      </Button>
                    </Box>
                  </>
                )}
              </div>

              <div className="d-flex justify-content-between gap-2 mt-4">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onClose}
                  sx={{
                    borderColor: "#334F3E",
                    color: "#334F3E",
                    textTransform: "none",
                    border: "1px solid #334F3E",
                    "&:hover": {
                      backgroundColor: "#334F3E",
                      color: "#fff",
                      borderColor: "#334F3E",
                    },
                  }}
                >
                  Cancel
                </Button>
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
                      borderColor: "#334F3E",
                    },
                  }}
                >
                  Save Changes
                </Button>
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            width: 360,
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
          <IconButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <img
              src={Frame}
              alt="delete icon"
              style={{ width: 80, height: 80 }}
            />
          </Box>
          <Typography variant="h6" mt={2}>
            Confirm Delete?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ overflow: "visible", textAlign: "center", px: 3 }}>
          <DialogContentText>
            Before deleting this wishlist, please select another wishlist to
            move its items.
          </DialogContentText>

          <div className="text-start mt-3">
            <label htmlFor="move-to-wishlist-select" className="form-label ">
              Move To Wishlist
            </label>
          </div>
          <select
            id="move-to-wishlist-select"
            className="form-select"
            value={selectedWishlistId ?? ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              setSelectedWishlistId(selectedId);

              if (formData.id !== null && selectedId) {
                // dispatch(
                //   moveWishlistItemsAsync({
                //     sourceWishlistId: formData.id,
                //     destinationWishlistId: selectedId,
                //   }) as any
                // );
              }
            }}
            disabled={alternativeWishlists.length === 0}
          >
            <option value="">
              Select wishlist
            </option>
            {alternativeWishlists.length > 0 ? (
              alternativeWishlists.map((wishlist) => (
                <option key={wishlist.id} value={wishlist.id ?? ""}>
                  {wishlist.name}
                </option>
              ))
            ) : (
              <option disabled>No other wishlists available</option>
            )}
          </select>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedWishlistId(null);
            }}
            sx={{ color: "#334F3E", borderColor: "#F1F5F9" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            endIcon={
              <Box component={TrashIcon} sx={{ width: 18, height: 18 }} />
            }
            sx={{
              textTransform: "none",
              backgroundColor: "#FFEBEE",
              color: "#EC2D30",
            }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageWishlistDrawer;
