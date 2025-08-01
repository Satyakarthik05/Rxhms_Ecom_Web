import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import { usePostByBody } from "../../customHooks/usePostByBody";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { CreateWishlistItemUri, getWishlists } from "../Dashboard/profileService/profileService";
import { Wishlist } from "../Dashboard/model/wishlist";
import { ProductCard } from "../inventoryProduct/model/productCard";
import { WishlistItem } from "../Dashboard/model/wishlistItem";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  productCard: ProductCard;  

  
}

const AddWishlistItem: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  productCard
}) => {
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const { data, executePost } = usePostByBody();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<string>("");


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToWishlistItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedWishlistObj = wishlists.find(wishlist => wishlist.name === selectedWishlist);

    const wishlistId = selectedWishlistObj ? selectedWishlistObj.id : null;


    if (!wishlistId && selectedWishlist !== "new") {
      setSnackbar({
        open: true,
        message: "Please select a valid wishlist.",
        severity: "error",
      });
      return;
    }

  const wishlistItem: WishlistItem = {
    id: null,
    wishlistId: wishlistId, 
    productCode: productCard.productCode || "", 
    itemId: productCard.itemId ?? 0,  
    addedOn: new Date().toISOString(),
    productCard: productCard,
  };




    try {
      const response = await executePost(CreateWishlistItemUri, wishlistItem);
      console.log("API Response:", response);
        setSnackbar({
        open: true,
        message: "Product has been added to Wishlist!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error while creating wishlist:", error);

      setSnackbar({
        open: true,
        message: "Failed to create wishlist.",
        severity: "error",
      });
    }

    onClose();
  };

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const content = await getWishlists(username);
        setWishlists(content);
      } catch (error) {
        console.error("Error fetching wishlists:", error);
      }
    };

    if (username) {
      fetchWishlists();
    }
  }, [username]);

  return (
    <>
      <Drawer
        placement={placement}
        onClose={onClose}
        open={open}
        width={570}
        className="custom-drawer p-3"
        style={{ zIndex: 1050, position: "absolute" }}
        closable={false}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold m-0">Add Wishlist</h4>
          <button className="btn btn-light border-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <hr className="my-3" />
        <form onSubmit={handleAddToWishlistItem}>
          <div className="mb-3">
            <label htmlFor="wishlistSelect" className="form-label fw-bold">
              Select Wishlist
            </label>
            <select
              className="form-select"
              id="wishlistSelect"
              value={selectedWishlist}
              onChange={(e) => setSelectedWishlist(e.target.value)}
              required
            >
              <option value="">Choose wishlist</option>
              {wishlists.map((wishlist) => (
                <option key={wishlist.id} value={wishlist.name}>
                  {wishlist.name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-warning w-100" type="submit">
            Add to Wishlist
          </button>
        </form>
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

export default AddWishlistItem;
