import React, { useState } from "react";
import { UpdateProfile } from "./profile/models/updateProfile";

export const ProfileUpdate: React.FC = () => {
  const [formData, setFormData] = useState<UpdateProfile>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<UpdateProfile>>({});

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: Partial<UpdateProfile> = {};
    if (!formData.firstName)
      validationErrors.firstName = "First name is required";
    if (!formData.lastName) validationErrors.lastName = "Last name is required";
    if (!formData.gender) validationErrors.gender = "Gender is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.address) validationErrors.address = "Address is required";

    if (Object.keys(validationErrors).length === 0) {
      console.log("Profile updated:", formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container w-50">
        <form onSubmit={handleProfileUpdate}>
          <div className="row mb-3">
            <div className="col-6">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                className="form-control"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <small className="text-danger">{errors.firstName}</small>
              )}
            </div>
            <div className="col-6">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                className="form-control"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <small className="text-danger">{errors.lastName}</small>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label>Gender:</label>

            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label className="ml-3">
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={handleChange}
              />{" "}
              Female
            </label>
            {errors.gender && (
              <small className="text-danger">{errors.gender}</small>
            )}
          </div>
          <div className="mb-3">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-mail"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>
          <div className="mb-3">
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && (
              <small className="text-danger">{errors.address}</small>
            )}
          </div>
          <div className="d-flex flex-w">
            <button
              type="submit"
              className="btn btn-primary"
              name="updateProfile"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
