import React, { use, useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Typography,
  InputAdornment,
  Select,
  MenuItem,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import {
  addressDeleleData,
  AvatarUri,
  createAvatar,
  CustomerDetailsUri,
  DeleteProfile,
  getaddressData,
  SetIsDefaultAddress,
  updateAvatar,
} from "./profileService/profileService";
import { Customer } from "../register/model/customer";
import { CustomerAddress } from "./model/customerAddress";
import AddressDrawer from "./addressDrawer";
import { addSticky, removeSticky } from "../../Redux/slices/headerStickyToggle";
import { clearAvatar, setAvatarUrl } from "../../Redux/slices/avatarSlice";
import { GenderType } from "../register/model/genderType";
import CustomerProfileDrawer from "./customerProfileDrawer";
import { Snackbar, Alert } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { ReactComponent as TrashIcon } from "../../assets/media/icons/redTrash.svg";
import { useTheme } from "@mui/material/styles";
import "./css/customerProfileDrawer.css";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CloseIcon from "@mui/icons-material/Close";

const CustomerProfile: React.FC = () => {
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const [ImageUrl, setImageUrl] = useState<string | null>(null);

  const { data: imageUrlOnLoad } = useFetchByQuery<string>(AvatarUri, {
    username,
  });

  const {
    data: customer,
    isLoading,
    error,
    setData,
  } = useFetchByQuery<Customer>(CustomerDetailsUri, { username });
  console.log("customer", customer);

  // setImageUrl(imageUrl?.imageUrl || null);

  const [tabIndex, setTabIndex] = React.useState(0);
  const image: any = imageUrlOnLoad || "";
  const [addressData, setAddressData] = useState<CustomerAddress[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState<Customer | null>(
    null
  );

  const [isConfirmDefaultOpen, setConfirmDefaultOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState<CustomerAddress | null>(
    null
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<number | null>(
    null
  );

  console.log("address", addressData);
  console.log("imageUrl", imageUrlOnLoad);
  const dispatch = useDispatch();
  const theme = useTheme();

  const fetchAddressData = async () => {
    try {
      const address = await getaddressData(username);
 setAddressData(address || []);
    } catch (error) {
      console.error("Error fetching Address:", error);
       setAddressData([]);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      let response;
      if (ImageUrl) {
        response = await updateAvatar(username, file);
      } else {
        response = await createAvatar(username, file);
      }

      console.log("Image___>response", response);
      if (response) {
        setImageUrl(response);
        dispatch(setAvatarUrl(response));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const openDeleteConfirmation = (addressId: number) => {
    setAddressToDeleteId(addressId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setAddressToDeleteId(null);
    setDeleteDialogOpen(false);
  };

  const confirmDeleteAddress = async () => {
    if (addressToDeleteId !== null) {
      try {
        const response = await addressDeleleData(addressToDeleteId);
        if (response === true) {
          await fetchAddressData();
          setSnackbarMessage("Address deleted successfully.");
        } else {
          setSnackbarMessage("Failed to delete address.");
        }
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error deleting address:", error);
        setSnackbarMessage("Error deleting address.");
        setOpenSnackbar(true);
      } finally {
        closeDeleteConfirmation();
      }
    }
  };

  const handleEditAddress = (address: CustomerAddress) => {
    console.log("Editing address:", address);

    setSelectedAddress(address);
    setIsDrawerOpen(true);
    dispatch(removeSticky());
  };

  const handleDeleteAvatar = async () => {
    try {
      const response: any = await DeleteProfile(username);
      console.log("Delete Response", response);
      if (response === true) {
        setImageUrl(null);
        dispatch(clearAvatar());
      }
    } catch (error) {
      console.error("Error deleting avatar:", error);
    }
  };
  useEffect(() => {
    if (imageUrlOnLoad) {
      setImageUrl(imageUrlOnLoad);
      dispatch(setAvatarUrl(imageUrlOnLoad));
    }
  }, [imageUrlOnLoad]);
  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsDrawerOpen(true);
    dispatch(removeSticky());
  };

  const handleProfileDrawer = () => {
    setEditCustomerData(customer);
    setIsProfileDrawerOpen(true);
    dispatch(removeSticky());
  };

  const handleSetDefaultClick = (address: CustomerAddress) => {
    setDefaultAddress(address);
    setConfirmDefaultOpen(true);
  };

  const confirmSetDefault = async () => {
    setConfirmDefaultOpen(false);
    if (defaultAddress?.id != null) {
      try {
        const response = await SetIsDefaultAddress(defaultAddress.id);
        if (!response.errorPresent) {
         
          setOpenSnackbar(true);
          setSnackbarMessage("Default address updated successfully!");

          await fetchAddressData();
        } else {
          let errorMessage = "Failed to set default address.";
          if (response?.message) {
            errorMessage = response.message;
          }
          setSnackbarMessage(errorMessage);
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error setting default address:", error);
        setSnackbarMessage("Error setting default address.");
        setOpenSnackbar(true);
      }
    }

    setDefaultAddress(null);
  };

  useEffect(() => {
    fetchAddressData();
  }, [username]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading profile</Typography>;
  }

  return (
    <>
      {addressData && (
        <Box
          sx={{
            p: { sm: 0.5, md: 3 },
            maxWidth: "1100px",
            mx: "auto",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Profile
              <IconButton
                size="small"
                onClick={handleProfileDrawer}
                sx={{ p: 0.5 }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Typography>

            <Button
              variant="outlined"
              onClick={handleAddAddress}
              startIcon={<AddCircleOutlineRoundedIcon />}
              sx={{
                borderRadius: 2,
                py: { xs: 0.5, sm: 1 },
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                textTransform: "none", // matches screenshot style
              }}
            >
              Add New Address
            </Button>
          </Box>

          <Box
            sx={{
              p: { xs: 1, md: 3 },
              mx: "auto",
              border: "2px solid #EED9CB",
              borderRadius: "16px",
            }}
          >
            <div className="container">
              <div className="row">
                {/* Avatar - show first on mobile, right side on desktop */}
                <div className="col-12 col-md-4 order-1 order-md-2 d-flex flex-column justify-content-start align-items-center mb-4 mb-md-0">
                  <Box
                    sx={{
                      position: "relative",
                      width: 150,
                      height: 150,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "2px solid #f5ede7",
                      bgcolor: "#f5ede7",
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      if (ImageUrl) {
                        setAvatarModalOpen(true);
                      } else {
                        document.getElementById("avatar-upload")?.click();
                      }
                    }}
                  >
                    {ImageUrl ? (
                      <Avatar
                        src={ImageUrl}
                        alt="profile"
                        sx={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%" }}
                      >
                        <CameraAltIcon
                          sx={{ fontSize: 30, color: "gray", mb: 1 }}
                        />
                        <Typography variant="body2">ADD PHOTO</Typography>
                      </Box>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setImageError("");
                        if (
                          file?.type === "image/jpeg" ||
                          file?.type === "image/png" ||
                          file?.type === "image/jpg"
                        ) {
                          console.log("IIImage", file);
                          handleFileUpload(file);
                        } else {
                          setImageError("Only JPG or PNG files are allowed.");
                          setTimeout(() => {
                            setImageError("");
                          }, 3000);
                        }
                      }}
                    />
                  </Box>
                  {imageError && <p className="text-danger">{imageError}</p>}
                </div>

                {/* Form - below avatar on mobile, left of avatar on desktop */}
                <div className="col-12 col-md-8 order-2 order-md-1">
                  <form className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control custom-names"
                        id="firstName"
                        value={customer?.firstName || ""}
                        readOnly
                        style={{ backgroundColor: theme.palette.info.main }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control custom-names"
                        id="lastName"
                        value={customer?.lastName || ""}
                        readOnly
                        style={{ backgroundColor: theme.palette.info.main }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label d-block mb-2">Gender</label>

                      <div className="d-flex  gap-3">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="male"
                            value={GenderType.MALE}
                            checked={customer?.gender === GenderType.MALE}
                            readOnly
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="female"
                            value={GenderType.FEMALE}
                            checked={customer?.gender === GenderType.FEMALE}
                            readOnly
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id="other"
                            value={GenderType.OTHER}
                            checked={customer?.gender === GenderType.OTHER}
                            readOnly
                          />
                          <label className="form-check-label" htmlFor="other">
                            Other
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="dob" className="form-label">
                        Date of Birth
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="dob"
                        value={customer?.dob || ""}
                        readOnly
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Phone Number</label>
                      <PhoneInput
                        enableSearch={true}
                        value={`${customer?.mobileNumber}`}
                        disabled
                        placeholder="Enter your mobile number"
                        inputProps={{
                          className: "form-control  custom-phone-address",

                          style: {
                            width: "100%",
                            backgroundColor: "transparent",
                          },
                          id: "mobile",
                        }}
                      />
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={customer?.emailId || ""}
                        readOnly
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Tabs
              value={tabIndex}
              onChange={(_, newValue) => setTabIndex(newValue)}
              sx={{ mt: 3, mb: 2, borderBottom: "1px solid #EEE" }}
            >
              <Tab
                label="Saved Address"
                sx={{ textTransform: "none", fontWeight: "bold" }}
              />
              <Tab label="Saved Cards" sx={{ textTransform: "none" }} />
            </Tabs>
          </Box>

          {tabIndex === 0 && (
            <Box p={2}>
              {addressData && addressData.length > 0 ? (
                [...addressData]
                  .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
                  .map((address, index) => (
                    <Box
                      key={index}
                      p={2}
                      sx={{
                        border: "2px solid #EED9CB",
                        mb: 2,
                        borderRadius: "8px",
                        backgroundColor: address.isDefault
                          ? (theme) => theme.palette.info.main
                          : "transparent",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          rowGap: 1,
                          columnGap: 2,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            fontSize: { xs: "12px", sm: "14px" },
                            borderRadius: "5px",
                            px: 1,
                            py: 0.5,
                            backgroundColor: "#20ED571A",
                            fontWeight: "bold",
                            color: "#0AA44F",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {address.isDefault}
                          {address.title}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            fontSize: { xs: "12px", sm: "14px" },
                            flexShrink: 0,
                          }}
                        >
                          {!address.isDefault && (
                            <>
                              <Typography
                                sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                                onClick={() => handleSetDefaultClick(address)}
                              >
                                Set as default
                              </Typography>
                              <Typography>|</Typography>
                            </>
                          )}
                          <EditOutlinedIcon
                            sx={{ cursor: "pointer", fontSize: "18px" }}
                            onClick={() => handleEditAddress(address)}
                          />
                          <Typography>|</Typography>
                          <TrashIcon
                            onClick={() =>
                              address.id !== null &&
                              address.id !== undefined &&
                              openDeleteConfirmation(address.id)
                            }
                            style={{
                              cursor: "pointer",
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        </Box>
                      </Box>

                      <Box>{address?.address?.fullName}</Box>

                      {address?.address && (
                        <Typography variant="body2">
                          <strong>
                            {Array.isArray(address?.addressType)
                              ? address?.addressType.join(" / ")
                              : address?.addressType}
                          </strong>{" "}
                          {`${address?.address?.addressLine1}, ${address?.address?.addressLine2}, ${address?.address?.city}, ${address?.address?.state}, ${address?.address?.country} - ${address?.address?.postalCode}`}
                        </Typography>
                      )}
                    </Box>
                  ))
              ) : (
                <Typography variant="body2" mt={1}>
                  No address available
                </Typography>
              )}
            </Box>
          )}

          {tabIndex === 1 && (
            <Box p={2}>
              {/* Define savedCards as an empty array or fetch from API/store as needed */}
              {(() => {
                // Replace this mock with actual data fetching logic if needed
                type SavedCard = { cardType: string; last4: string };
                const savedCards: SavedCard[] = [];
                return savedCards && savedCards.length > 0 ? (
                  <Box>
                    {/* Replace below with your actual card list rendering */}
                    {savedCards.map((card, i) => (
                      <Box
                        key={i}
                        p={2}
                        sx={{
                          border: "1px solid #DDD",
                          borderRadius: 2,
                          mb: 2,
                          fontSize: { xs: "14px", sm: "16px" },
                        }}
                      >
                        {card.cardType} - **** **** **** {card.last4}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: "14px", sm: "16px" },
                      mt: 2,
                      color: "#777",
                    }}
                  >
                    No saved cards available
                  </Typography>
                );
              })()}
            </Box>
          )}
        </Box>
      )}

      <AddressDrawer
        fetchAddressData={fetchAddressData}
        key={selectedAddress?.id || "new"}
        open={isDrawerOpen}
        setEdit={setEdit}
        onClose={() => {
          setIsDrawerOpen(false);
          dispatch(addSticky());
        }}
        allAddress={addressData}
        address={selectedAddress}
        onUpdate={(updatedAddress) => {
          setAddressData((prev) =>
            prev.map((addr) =>
              addr.id === updatedAddress.id ? updatedAddress : addr
            )
          );
        }}
      />

      <Dialog
        open={isAvatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        disableScrollLock
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit Profile Photo
          <IconButton
            onClick={() => setAvatarModalOpen(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Choose what you want to do with your profile picture.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                handleDeleteAvatar();
                setAvatarModalOpen(false);
              }}
              sx={{
                textTransform: "none",
                borderColor: (theme) => theme.palette.success.main,
              }}
            >
              Remove
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                document.getElementById("avatar-upload")?.click();
                setAvatarModalOpen(false);
              }}
              sx={{
                backgroundColor: (theme) => theme.palette.success.light,
                textTransform: "none",
              }}
            >
              Upload New
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isConfirmDefaultOpen}
        onClose={() => setConfirmDefaultOpen(false)}
        disableScrollLock
      >
        <DialogTitle>Set as Default Address</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to set this address as your default address?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDefaultOpen(false)}>No</Button>
          <Button onClick={confirmSetDefault} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <CustomerProfileDrawer
        open={isProfileDrawerOpen}
        setData={setData}
        onClose={() => {
          setIsProfileDrawerOpen(false);
          dispatch(addSticky());
        }}
        customerData={editCustomerData}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarMessage.includes("Failed") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={closeDeleteConfirmation}
        disableScrollLock
      >
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this address?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button onClick={() => confirmDeleteAddress()} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerProfile;
