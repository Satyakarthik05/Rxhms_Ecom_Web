import React, { useState } from "react";
import {
  CardContent,
  Typography,
  Box,
  Divider,
  Container,
} from "@mui/material";
import "./css/address.css";
import { usePostByBody } from "../../customHooks/usePostByBody";
import { getLocalText } from "../../web-constants/constants";
import { AddressMaster } from "../Dashboard/model/addressMaster";
import { CreateAddressUri } from "./service/myCartService";
import { AddressType } from "../Dashboard/enum/addressType";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store/store";
import { Cart } from "../addToBag/model/cart";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";

const AddAddress: React.FC = () => {
  const { error, executePost } = usePostByBody();
  const [addressTypes, setAddressTypes] = useState<string[]>([
    AddressType.SHIPPING,
  ]);
  const navigate = useNavigate();

  const username = useSelector((store: RootState) => store.jwtToken.username);
  const cartData: Cart = useSelector((store: RootState) => store.cart.cart);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const isDefault = formData.get("isDefault") === "on";

    const address: AddressMaster = {
      id: null,
      fullName: `${formData.get("firstName")} ${formData.get(
        "lastName"
      )}`.trim(),
      phoneNumber: formData.get("phoneNumber") as string,
      addressLine1: formData.get("addressLine1") as string,
      addressLine2: (formData.get("addressLine2") as string) || "",
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      country: formData.get("country") as string,
      postalCode: formData.get("postalCode") as string,
    };

    const customerId = getLocalText("customerId");
    const addToCartData = {
      customerId: customerId,
      address,
      title: formData.get("addressTitle") as string,
      addressTypes: addressTypes,
      isDefault: isDefault,
      username: username,
    };

    console.log("err", error);
    console.log("addToCartData", addToCartData);

    try {
      await executePost(CreateAddressUri, addToCartData);
      if (error === null) {
        navigate("/cart/bag/checkout");
      }
    } catch (error) {
      console.error("Error in AddToCart:", error);
    }
  };

  const handleBillingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAddressTypes([AddressType.SHIPPING, AddressType.BILLING]);
    } else {
      setAddressTypes([AddressType.SHIPPING]);
    }
  };

  console.log("AddressTypes", addressTypes);

  return (
    <Container>
      <div className="row py-4 pb-5">
        <div className="col-md-7">
          <form onSubmit={handleSubmit}>
            <div
              className="card custom-card"
              style={{ border: "none", boxShadow: "none" }}
            >
              <div className="card-body">
                <h5 className="card-title custom-subtitle">Shipping Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label custom-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label custom-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label custom-label">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label custom-label">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label custom-label">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      className="form-control custom-input"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label custom-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label custom-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label custom-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label custom-label">Zip Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control custom-input"
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mt-3 mb-2">
                    <label style={{ cursor: "pointer" }}>
                      <input type="radio" name="addressTitle" value="HOME" />{" "}
                      <HomeIcon />
                      Home
                    </label>
                    <label className="ms-3" style={{ cursor: "pointer" }}>
                      <input type="radio" name="addressTitle" value="WORK" />{" "}
                      <BusinessIcon />
                      Work
                    </label>
                  </div>
                </div>

                <div className="form-check mt-3">
                  <input
                    style={{ cursor: "pointer" }}
                    id="makeThisDefault"
                    className="form-check-input"
                    type="checkbox"
                    checked={true}
                    name="isDefault"
                  />
                  <label
                    style={{ cursor: "pointer" }}
                    htmlFor="makeThisDefault"
                    className="form-check-label custom-label"
                  >
                    Make this my default address
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isBilling"
                    id="isBilling"
                    onChange={handleBillingAddress}
                  />
                  <label
                    style={{ cursor: "pointer" }}
                    htmlFor="isBilling"
                    className="form-check-label custom-label"
                  >
                    Make this as billing address
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Save Address
            </button>
          </form>
        </div>

        <div className="col-md-5">
          <Box>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              {cartData.cartItems &&
                cartData.cartItems.map((each) => (
                  <>
                    <Box
                      key={each.id}
                      display="flex"
                      alignItems="center"
                      mb={2}
                    >
                      <img
                        src={each.productCard?.itemImage}
                        alt="Product"
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                      />
                      <Box ml={2}>
                        <Typography variant="body1" fontWeight="bold">
                          {each.productCard?.itemTitle}
                        </Typography>
                        <Box className="d-flex ">
                          <Typography variant="body2">
                            {each.productCard?.currency}
                            {each.productCard?.itemPrice}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="ms-2"
                            sx={{ textDecoration: "line-through" }}
                          >
                            {each.productCard?.currency}
                            {each.productCard?.itemMrp}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                ))}
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Cost</Typography>
                <Typography variant="body2">{cartData.totalPrice}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Shipping Fee:</Typography>
                <Typography variant="body2">Free</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Delivery Charges:</Typography>
                <Typography variant="body2">₹0</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">GST:</Typography>
                <Typography variant="body2">₹0</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Discount:</Typography>
                <Typography variant="body2">{cartData.totalPrice}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                display="flex"
                justifyContent="space-between"
                fontWeight="bold"
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">{cartData.totalPrice}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography sx={{ fonSize: "16px", lineHeight: "24px" }}>
                  Standard orders are typically processed within 5 business
                  days. Expedited orders are processed within 1 business day.
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography>
                  Payments fulfilled by{" "}
                  <span
                    style={{
                      fontWeight: "900px",
                      fontSize: "16px",
                      lineHeight: "24px",
                      color: "#464646",
                    }}
                  >
                    RxHMS
                  </span>
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default AddAddress;
