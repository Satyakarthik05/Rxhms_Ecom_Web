import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button, useTheme } from "@mui/material";
import { Customer } from "../register/model/customer";
import { GenderType } from "../register/model/genderType";
import PhoneInput from "react-phone-input-2";
import { UpdateProfileUrl } from "./profileService/profileService";
import { usePutByBody } from "../../customHooks/usePutByBody";
import "../Dashboard/css/customerProfileDrawer.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  customerData: Customer | null;
  setData?: (data: any) => void;
}

const CustomerProfileDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  customerData,
  setData,
}) => {
  const { executePut, loading, error } = usePutByBody<Customer>();
  const [formData, setFormData] = useState<Customer>({
    id: 0,
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "" as GenderType,
    dob: "",
    anniversary: 0,
    mobileNumber: "",
    emailId: "",
    referredBy: 0,
    prefLang: "",
    registeredOn: "",
    currency: "",
    username: "",
  });

  const [phoneError, setPhoneError] = useState("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "info" | "success" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const theme = useTheme();

  useEffect(() => {
    if (open && customerData) {
      setFormData(customerData);
    }
  }, [open,customerData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const cursorPosition = (e.target as HTMLInputElement).selectionStart;

      const sanitized = value
        .split("")
        .map((char) => {
          if (char === " ") return char;
          return char.match(/[A-Za-z]/) ? char : "";
        })
        .join("");

      const finalValue = sanitized.replace(/( ){2,}/g, " ");

      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      setTimeout(() => {
        if (e.target instanceof HTMLInputElement) {
          e.target.selectionStart = cursorPosition;
          e.target.selectionEnd = cursorPosition;
        }
      }, 0);

      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email is required.";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.emailId.trim()) return "Email is required";

    const emailError = validateEmail(formData.emailId);
    if (emailError) return emailError;

    if (phoneError) return phoneError;
    if (!formData.mobileNumber || formData.mobileNumber.length < 10)
      return "Phone number is required or invalid";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting updated customer profile:", formData);

    const validationError = validateForm();
    if (validationError) {
      setSnackbar({
        open: true,
        message: validationError,
        severity: "error",
      });
      return;
    }

    try {
      const response: any = await executePut(UpdateProfileUrl, formData);

      console.log("Profile update response:", response);

      if (setData && response) {
        setData(response);
      }
      // window.location.reload();
      if (!error) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
        onClose();
        // setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update profile. Try again.",
        severity: "error",
      });
    }
  };

  const handlePhoneChangePrimary = (value: string, data: any) => {
    const fullNumber = `+${value}`;

    if (fullNumber.length < data.dialCode.length + 7) {
      setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }

    setFormData((prev) => ({
      ...prev,
      mobileNumber: fullNumber,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
            <h4 className="fw-bold m-0">Edit Profile</h4>
            <button className="btn btn-light border-0" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <hr className="my-3" />
          <form className="h-100" onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="mb-2">
                  <label htmlFor="firstName" className="form-label">
                    First Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="lastName" className="form-label">
                    Last Name<span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    minLength={3}
                    maxLength={50}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label d-block">
                    Gender
                    <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender-male"
                        value={GenderType.MALE}
                        checked={formData.gender === GenderType.MALE}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value as GenderType,
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="gender-male"
                        style={{ cursor: "pointer" }}
                      >
                        Male
                      </label>
                    </div>

                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender-female"
                        value={GenderType.FEMALE}
                        checked={formData.gender === GenderType.FEMALE}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value as GenderType,
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label cursor-pointer"
                        htmlFor="gender-female"
                        style={{ cursor: "pointer" }}
                      >
                        Female
                      </label>
                    </div>

                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        id="gender-other"
                        value={GenderType.OTHER}
                        checked={formData.gender === GenderType.OTHER}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            gender: e.target.value as GenderType,
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <label
                        className="form-check-label cursor-pointer"
                        htmlFor="gender-other"
                        style={{ cursor: "pointer" }}
                      >
                        Other
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="dob" className="form-label">
                    Date of Birth<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="mobileNumber" className="form-label">
                    Phone Number<span className="text-danger">*</span>
                  </label>
                  <PhoneInput
                    enableSearch={true}
                    country={"in"}
                    value={formData.mobileNumber.replace("+", "")}
                    onChange={handlePhoneChangePrimary}
                    inputProps={{
                      name: "phone",
                      required: true,
                      className: "form-control custom-phone",
                      id: "mobile",
                    }}
                    inputStyle={{
                      width: "100%",
                      borderColor: theme.palette.info.main,
                    }}
                    placeholder="Enter your mobile number"
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="emailId" className="form-label">
                    Email ID<span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                     disabled

                  />
                </div>
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
                     boxShadow: "none",

                    },
                  }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
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
    </>
  );
};

export default CustomerProfileDrawer;
