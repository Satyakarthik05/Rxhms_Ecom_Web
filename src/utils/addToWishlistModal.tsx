import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { usePostByBody } from "../customHooks/usePostByBody";
import { WishlistItem } from "../sections/Dashboard/model/wishlistItem";
import { CreateWishlistItemUri } from "../sections/Dashboard/profileService/profileService";
import { Wishlist } from "../sections/Dashboard/model/wishlist";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ProductCard } from "../sections/inventoryProduct/model/productCard";

type AddToWishlistModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  wishlistName: string | null;
  product: { title: string; image: string } | null;
  productCard:ProductCard;
  wishlists: Wishlist[]; 
};

const AddToWishlistModal: React.FC<AddToWishlistModalProps> = ({
  open,
  onClose,
  wishlistName,
  product,
  wishlists,
  productCard,
}) => {
  const {  executePost } = usePostByBody();

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

      const selectedWishlist = wishlists.find(w => w.name === wishlistName);
  const wishlistId: number | null = selectedWishlist ? selectedWishlist.id : null;
    
  
    const wishlistItem: WishlistItem = {
      id: null,
      wishlistId: wishlistId, 
      productCode: productCard.productCode || "", 
      itemId: productCard.itemId,  
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
  

  return (

    <>

    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold" mt={1}>
            Add to Wish List
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />

      <DialogContent>
        <Typography variant="h6" gutterBottom>
          One item added to{" "}
          <Link href="#" underline="hover" color="primary" fontWeight="bold">
            {wishlistName}
          </Link>
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 2 }}>
          <Box
            component="img"
            src={product?.image}
            alt="Product"
            sx={{ width: 60, height: 60 }}
          />
          <Typography variant="body1">{product?.title}</Typography>
        </Stack>
      </DialogContent>
      <Divider sx={{ my: 1 }} />

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ textTransform: "none", bgcolor: "#334F3E",
          }}
          onClick={handleAddToWishlistItem}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>

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

export default AddToWishlistModal;
