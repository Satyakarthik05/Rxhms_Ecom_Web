"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store/store";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { usePostByBody } from "../../customHooks/usePostByBody";
import { CreateAddressUri } from "../myCart/service/myCartService";
import PhoneInput from "react-phone-input-2";
import { AddressType } from "../Dashboard/enum/addressType";
import type { AddressMaster } from "../Dashboard/model/addressMaster";
import type { CheckoutAddress } from "./model/checkoutAddress";
import type { CustomerAddress } from "../Dashboard/model/customerAddress";
import type { LocationDetails } from "../Dashboard/model/locationDetails";
import { getLocationData } from "../Dashboard/profileService/profileService";
import { Box, Button } from "@mui/material";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  setCheckoutAddress: (val: any) => void;
  isDefaultAddressPresent: boolean | null;
  setDefaultAddressPresent: (val: boolean | null) => void;
}

const CheckoutAddressDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  setCheckoutAddress,
  isDefaultAddressPresent,
  setDefaultAddressPresent,
}) => {
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const {
    data: createAddressResponse,
    executePost,
    loading: creating,
  } = usePostByBody<CustomerAddress>();

  // Form data state
  const [formData, setFormData] = useState<CustomerAddress>({
    title: "",
    addressType: "" as AddressType,
    address: {
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    isDefault: false,
    username: username,
    addressTypes: [],
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });

  // Form validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focusing error fields
  const fullNameRef = useRef<HTMLInputElement>(null);
  const addressLine1Ref = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<any>(null);

  // Focus on first error field when validation fails
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const fieldRefs: Record<string, React.RefObject<any>> = {
        fullName: fullNameRef,
        addressLine1: addressLine1Ref,
        city: cityRef,
        state: stateRef,
        country: countryRef,
        postalCode: postalCodeRef,
        title: titleRef,
      };

      const targetRef = fieldRefs[firstErrorField];
      if (targetRef?.current) {
        if (firstErrorField === "phoneNumber") {
          // For PhoneInput, we need to focus on the input element inside
          const phoneInput = targetRef.current.querySelector("input");
          if (phoneInput) {
            phoneInput.focus();
          }
        } else {
          targetRef.current.focus();
        }
      }
    }
  }, [errors]);

  useEffect(() => {
    console.log("Received address in AddressDrawer:", null);
    if (!isDefaultAddressPresent) {
      handleCheckboxChange();
    }
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (
      Array.isArray(createAddressResponse) &&
      createAddressResponse.length > 0
    ) {
      setSnackbar({
        open: true,
        message: "Address created successfully!",
        severity: "success",
      });

      setCheckoutAddress((prev: CheckoutAddress) => {
        const newState: CheckoutAddress = prev
          ? { ...prev }
          : {
              billingAddress: {} as AddressMaster,
              shippingAddress: {} as AddressMaster,
            };

        createAddressResponse.forEach((addressObj) => {
          if (addressObj.addressType === AddressType.SHIPPING) {
            newState.shippingAddress = addressObj.address;
          } else if (addressObj.addressType === AddressType.BILLING) {
            newState.billingAddress = addressObj.address;
          }
        });

        return newState;
      });

      onClose();
    }
  }, [createAddressResponse, setCheckoutAddress]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev: any) => {
      if (name === "addressType") {
        return { ...prev, addressType: value as AddressType };
      } else if (name === "title") {
        return { ...prev, title: value };
      } else {
        return {
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        };
      }
    });
  };

  const handleCheckboxChange = (type?: AddressType) => {
    if (!isDefaultAddressPresent) {
      setFormData((prev: any) => ({
        ...prev,
        addressTypes: [AddressType.BILLING, AddressType.SHIPPING],
        isDefault: true,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        addressTypes: prev.addressTypes?.includes(type)
          ? prev.addressTypes.filter((t: any) => t !== type)
          : [...(prev.addressTypes || []), type],
      }));
    }

    // Clear address types error when user selects an option
    if (errors.addressTypes) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.addressTypes;
        return newErrors;
      });
    }
  };

  // Enhanced validation function that returns field-specific errors
  const validateForm = (): Record<string, string> => {
    const { title, address } = formData;
    const {
      fullName,
      phoneNumber,
      addressLine1,
      city,
      country,
      state,
      postalCode,
    } = address;

    const newErrors: Record<string, string> = {};
    const alphaPattern = /^[A-Za-z\s]+$/;
    const postalCodePattern = /^[0-9]{6}$/;

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    else if (!alphaPattern.test(fullName))
      newErrors.fullName = "Only alphabets and spaces allowed.";

    if (!title.trim()) newErrors.title = "Address title is required.";

    if (!addressLine1.trim())
      newErrors.addressLine1 = "Address Line 1 is required.";

    if (!city.trim()) newErrors.city = "City is required.";
    else if (!alphaPattern.test(city))
      newErrors.city = "Only alphabets and spaces allowed.";

    if (!state.trim()) newErrors.state = "State is required.";
    else if (!alphaPattern.test(state))
      newErrors.state = "Only alphabets and spaces allowed.";

    if (!country.trim()) newErrors.country = "Country is required.";
    else if (!alphaPattern.test(country))
      newErrors.country = "Only alphabets and spaces allowed.";

    if (!postalCode.trim()) newErrors.postalCode = "Zip Code is required.";
    else if (!postalCodePattern.test(postalCode))
      newErrors.postalCode = "Must be exactly 6 digits.";

    const trimmedPhone = phoneNumber.replace(/\D/g, "");

    if (!trimmedPhone) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (trimmedPhone.startsWith("91") && trimmedPhone.length === 12) {
      const nationalNumber = trimmedPhone.slice(2); // Remove country code
      if (nationalNumber === "0000000000") {
        newErrors.phoneNumber = "Phone number cannot be all zeros.";
      } else if (nationalNumber.length !== 10) {
        newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
      }
    } else {
      newErrors.phoneNumber = "Invalid phone number format.";
    }

    if ((formData.addressTypes || []).length === 0)
      newErrors.addressTypes = "Select at least one address type.";

    return newErrors;
  };

  console.log("formData", formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("in the  handleSubmit");

    // Validate form and get field-specific errors
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    const updatedFormData: any = {
      customerId: formData.customerId,
      address: {
        ...formData.address,
        fullName: formData.address.fullName,
      },
      title: formData.title,
      addressTypes: formData.addressTypes,
      isDefault: formData.isDefault,
      username: formData.username,
    };

    console.log("updatedFormData", updatedFormData);

    try {
      const response = await executePost(CreateAddressUri, updatedFormData);

      console.log("Add Address Drawer response", response);
      resetForm();
      setDefaultAddressPresent(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create address.",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    resetForm();
    onClose(); // This is the actual drawer close function passed from parent
  };

  const resetForm = () => {
    setFormData({
      id: null,
      customerId: null,
      title: "HOME",
      addressType: "" as AddressType,
      address: {
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
      isDefault: false,
      username: username,
      addressTypes: [],
    });
    setErrors({});
  };

  console.log("isDefaultAddressPresent", isDefaultAddressPresent);

  return (
    <>
      <Drawer
        placement={placement}
        onClose={handleClose}
        open={open}
        width={500}
        className="custom-drawer p-3"
        style={{ zIndex: 1050, position: "absolute" }}
        closable={false}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold m-0">Add Address</h4>
          <button className="btn btn-light border-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <hr className="my-3" />
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              Full Name
              <span className="text-danger">*</span>
            </label>
            <input
              ref={fullNameRef}
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              name="fullName"
              value={formData.address.fullName}
              onChange={handleChange}
              onKeyPress={(e) => {
                const char = String.fromCharCode(e.which);
                const isValid = /^[a-zA-Z\s]*$/.test(char);
                if (!isValid) e.preventDefault();
              }}
              required
              minLength={3}
              maxLength={50}
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number <span className="text-danger">*</span>
            </label>
            <div ref={phoneNumberRef}>
              <PhoneInput
                enableSearch={true}
                country={"in"}
                value={formData.address.phoneNumber
                  .replace("+", "")
                  .replace("-", "")}
                inputStyle={{ width: "100%" }}
                inputProps={{
                  className: "form-control custom-phone-address ",
                }}
                onChange={(value: string, data: any) => {
                  const countryCode = data.dialCode;
                  let nationalNumber = value.startsWith(countryCode)
                    ? value.slice(countryCode.length)
                    : value;

                  const formattedNumber = `+${countryCode}-${nationalNumber}`;

                  setFormData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      phoneNumber: formattedNumber,
                    },
                  }));
                }}
              />

              {errors.phoneNumber && (
                <div className="invalid-feedback d-block">
                  {errors.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Address Line 1<span className="text-danger">*</span>
            </label>
            <input
              ref={addressLine1Ref}
              type="text"
              className={`form-control ${
                errors.addressLine1 ? "is-invalid" : ""
              }`}
              name="addressLine1"
              onChange={handleChange}
              required
              value={formData?.address.addressLine1 || ""}
              minLength={3}
              maxLength={50}
            />
            {errors.addressLine1 && (
              <div className="invalid-feedback">{errors.addressLine1}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Address Line 2</label>
            <input
              type="text"
              className="form-control"
              name="addressLine2"
              onChange={handleChange}
              value={formData?.address.addressLine2}
            />
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">
                Pin Code
                <span className="text-danger">*</span>
              </label>
              <input
                ref={postalCodeRef}
                type="text"
                className={`form-control ${
                  errors.postalCode ? "is-invalid" : ""
                }`}
                name="postalCode"
                maxLength={6}
                onChange={async (e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        postalCode: value,
                      },
                    }));

                    // Clear postal code error when user starts typing
                    if (errors.postalCode) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.postalCode;
                        return newErrors;
                      });
                    }

                    if (value.length === 6) {
                      try {
                        const locationData: LocationDetails =
                          await getLocationData(Number(value));
                        setFormData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            city: locationData.city,
                            state: locationData.state,
                            country: locationData.country,
                          },
                        }));
                      } catch (error) {
                        console.error(
                          "Failed to fetch location data for pincode:",
                          error
                        );
                      }
                    }
                  }
                }}
                required
                value={formData?.address.postalCode || ""}
              />
              {errors.postalCode && (
                <div className="invalid-feedback">{errors.postalCode}</div>
              )}
            </div>
            <div className="col-6">
              <label className="form-label">
                City
                <span className="text-danger">*</span>
              </label>
              <input
                ref={cityRef}
                type="text"
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                name="city"
                onChange={handleChange}
                required
                value={formData?.address.city || ""}
                minLength={3}
                maxLength={50}
              />
              {errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">
                State
                <span className="text-danger">*</span>
              </label>
              <input
                ref={stateRef}
                type="text"
                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                name="state"
                onChange={handleChange}
                required
                value={formData?.address.state}
                minLength={3}
                maxLength={50}
              />
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>

            <div className="col-6">
              <label className="form-label">
                Country
                <span className="text-danger">*</span>
              </label>
              <input
                ref={countryRef}
                type="text"
                className={`form-control ${errors.country ? "is-invalid" : ""}`}
                name="country"
                onChange={handleChange}
                value={formData?.address.country}
                minLength={3}
                maxLength={50}
              />
              {errors.country && (
                <div className="invalid-feedback">{errors.country}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Address Title
              <span className="text-danger">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              name="title"
              value={formData.title}
              placeholder="ex:- Home or Work"
              onChange={handleChange}
              minLength={3}
              maxLength={10}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title}</div>
            )}
          </div>

          <div className="mb-3">
            <label
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={!isDefaultAddressPresent || formData.isDefault}
                onChange={(e) => {
                  if (!isDefaultAddressPresent) {
                    setFormData({ ...formData, isDefault: true });
                  } else {
                    setFormData({ ...formData, isDefault: e.target.checked });
                  }
                }}
                className="me-2"
                style={{
                  width: "15px",
                  height: "15px",
                  border: "2px solid #334F3E",
                  accentColor: "#334F3E",
                  cursor: "pointer",
                  marginRight: "6px",
                }}
              />
              Make this my default address
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Address Type
              <span className="text-danger">*</span>
            </label>
            <div className="d-flex gap-4">
              <label
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    !isDefaultAddressPresent ||
                    (formData.addressTypes || []).includes(AddressType.SHIPPING)
                  }
                  onChange={() => handleCheckboxChange(AddressType.SHIPPING)}
                  style={{
                    width: "15px",
                    height: "15px",
                    border: "2px solid #334F3E",
                    accentColor: "#334F3E",
                    cursor: "pointer",
                    marginRight: "6px",
                  }}
                />
                Shipping
              </label>

              <label
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    !isDefaultAddressPresent ||
                    (formData.addressTypes || []).includes(AddressType.BILLING)
                  }
                  onChange={() => handleCheckboxChange(AddressType.BILLING)}
                  style={{
                    width: "15px",
                    height: "15px",
                    border: "2px solid #334F3E",
                    accentColor: "#334F3E",
                    cursor: "pointer",
                    marginRight: "6px",
                  }}
                />
                Billing
              </label>
            </div>
            {errors.addressTypes && (
              <div className="text-danger mt-1">{errors.addressTypes}</div>
            )}
          </div>

          <div className="d-flex justify-content-between gap-2 mt-4">
            <Box flex={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
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

export default CheckoutAddressDrawer;
