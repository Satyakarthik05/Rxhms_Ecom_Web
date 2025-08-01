import React, { useEffect, useState } from "react";
import { Ticket } from "../Models/support/tiket";
import {
  TicketCategory,
  TicketCategoryDisplay,
} from "../Models/support/ticketCategory";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";

import PhoneInput from "react-phone-input-2";
import { usePostByBody } from "../../customHooks/usePostByBody";
import {
  CreateTicketUri,
  CustomerDetailsUri,
} from "./profileService/profileService";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useFetchByQuery } from "../../customHooks/useFetchByQuery";
import { Customer } from "../register/model/customer";
import Box from "@mui/material/Box";
import { Button, Drawer } from "@mui/material";
import { Style } from "@mui/icons-material";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  orderNum?: number;
  placement?: "left" | "right";
  onSubmitSuccess?: () => void;
}

const RaiseTicketForm: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  orderNum,
  onSubmitSuccess,
}) => {
  const username = useSelector((store: RootState) => store.jwtToken.username);
  const { data: customer } = useFetchByQuery<Customer>(CustomerDetailsUri, {
    username,
  });

  const [formData, setFormData] = useState<Ticket>({
    username: username,
    category: "" as TicketCategory,
    subject: "",
    description: "",
    email: "",
    mobileNum: "",
    orderNum: orderNum as number,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "error" | "info" | "success" | "warning",
  });
  const [phoneError, setPhoneError] = useState<string>("");
  const [errors, setErrors] = useState({
    category: "",
    subject: "",
    description: "",
    email: "",
    mobileNum: "",
  });

  const { executePost } = usePostByBody<Ticket>();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        email: customer.emailId || "",
        mobileNum: customer.mobileNumber || "",
      }));
    }
  }, [customer]);

  const validateForm = (): boolean => {
    const newErrors = {
      category: "",
      subject: "",
      description: "",
      email: "",
      mobileNum: "",
    };

    let isValid = true;

    if (!formData.category) {
      newErrors.category = "Category is required.";
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    }

    if (!formData.mobileNum.trim()) {
      newErrors.mobileNum = "Phone number is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      username: username,
      category: "" as TicketCategory,
      subject: "",
      description: "",
      email: "",
      mobileNum: "",
      orderNum: orderNum as number,
    });

    setErrors({
      category: "",
      subject: "",
      description: "",
      email: "",
      mobileNum: "",
    });

    setPhoneError("");
  };

  const handleDrawerClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      const response: any = await executePost(CreateTicketUri, formData);

      console.log("Ticket submission response:", response);
      if (response !== null) {
        setSnackbar({
          open: true,
          message: "Ticket submitted successfully!",
          severity: "success",
        });
        setTimeout(() => {
          resetForm();
          onClose();
          onSubmitSuccess?.();
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message:
            response?.message || "Something went wrong. Please try again.",
          severity: "error",
        });
      }
    } catch (err: any) {
      console.error("Ticket submission failed", err);
      setSnackbar({
        open: true,
        message:
          err?.message || "Ticket submission failed. Please try again later.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Drawer
        anchor={placement}
        onClose={handleDrawerClose}
        open={open}
        // width={500}
        className="custom-drawerhide-scrollbars p-3"
       PaperProps={{
  sx: {
    position: "absolute",
    zIndex: 1050,
    width: {
      xs: "100vw",
      sm: 350,
      md: 400,
      lg: 450,
    },
    maxWidth: "100vw",
    padding: { xs: 2, sm: 3, md: 4 },
  },
}}

        // closable={false}
        ModalProps={{
          keepMounted: true, // better performance on mobile
        }}
      >
        <div className="container py-4 ">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-uppercase mb-0">Raise New Ticket</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleDrawerClose}
            ></button>
          </div>
          <hr className="my-3" />
          <div
            className="hide-scrollbars"
            style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-control ${
                    errors.category ? "is-invalid" : ""
                  }`}
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {Object.values(TicketCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {TicketCategoryDisplay[cat]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="text-danger mt-1">{errors.category}</div>
                )}
              </div>

              {/* Issue */}
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.subject ? "is-invalid" : ""
                  }`}
                  id="subject"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                  minLength={3}
                  maxLength={50}
                />
                {errors.subject && (
                  <div className="text-danger mt-1">{errors.subject}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  id="description"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  minLength={3}
                  maxLength={500}
                />
                {errors.description && (
                  <div className="text-danger mt-1">{errors.description}</div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-danger mt-1">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="mobileNum" className="form-label">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <PhoneInput
                  enableSearch
                  country={"in"}
                  value={formData.mobileNum.replace("+", "").replace("-", "")}
                  inputProps={{
                    name: "mobileNum",
                    required: true,
                    readOnly: true,
                    id: "mobileNum",
                    className: `form-control custom-phone-address ${
                      errors.mobileNum ? "is-invalid" : ""
                    }`,
                    style: { cursor: "no-drop", width: "100%" },
                  }}
                  onChange={(value: string, data: any) => {
                    const dialCode = data.dialCode;
                    const phoneNumber = value
                      .slice(dialCode.length)
                      .replace(/[^0-9]/g, "");
                    const formatted = `+${dialCode}-${phoneNumber}`;
                    setFormData((prev) => ({
                      ...prev,
                      mobileNum: formatted,
                    }));

                    if (
                      !/^\d{10}$/.test(phoneNumber) ||
                      /^0+$/.test(phoneNumber)
                    ) {
                      setPhoneError("Please enter a valid mobile number.");
                    } else {
                      setPhoneError("");
                    }
                  }}
                  placeholder="Enter your phone number"
                />
                {errors.mobileNum && (
                  <div className="text-danger mt-1">{errors.mobileNum}</div>
                )}
              </div>

              {/* <div className="mb-4">
              <label htmlFor="image" className="form-label">
                Upload Image
              </label>
              <div
                className="border border-secondary rounded text-center py-4"
                style={{
                  cursor: "pointer",
                  borderStyle: "dashed",
                  color: "#bbb",
                }}
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                <div style={{ fontSize: "24px" }}>＋</div>
                <div>Upload</div>
              </div>
              <input
                type="file"
                id="imageInput"
                className="d-none"
                onChange={handleFileChange}
              />
              {image && (
                <div className="mt-2 small text-muted">
                  Selected: <strong>{image.name}</strong>
                </div>
              )}
            </div> */}

              {/* Action Buttons */}
            </form>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              padding: "16px",
            }}
          >
            <div className="d-flex justify-content-between gap-2 px-3">
              <Box flex={1}>
                <Button
                  fullWidth
                  variant="outlined"
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
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      subject: "",
                      description: "",
                      email: "",
                      mobileNum: "",
                    }));
                    onClose();
                    handleDrawerClose();
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
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </div>
          </div>
        </div>

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
      </Drawer>
    </>
  );
};

export default RaiseTicketForm;
