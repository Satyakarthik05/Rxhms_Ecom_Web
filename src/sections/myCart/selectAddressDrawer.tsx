import React from "react";
import {
  Box,
  // Typography,
  IconButton,
  // Button,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CheckoutAddress } from "./model/checkoutAddress";
import { CustomerAddress } from "../Dashboard/model/customerAddress";
import { AddressMaster } from "../Dashboard/model/addressMaster";
import { Drawer, Typography, Button } from "antd";
import { Input, Space } from "antd";
const { Text, Title } = Typography;

interface SelectAddressDrawerProps {
  open: boolean;
  onClose: () => void;
  addressAll: CustomerAddress[] | null;
  setCheckoutAddress: React.Dispatch<
    React.SetStateAction<CheckoutAddress | null>
  >;

  toggleShipping: boolean;
  toggleBilling: boolean;
  setToggleShipping: (value: boolean) => void;
  setToggleBilling: (value: boolean) => void;
}

export default function SelectAddressDrawer({
  open,
  onClose,
  addressAll,
  setCheckoutAddress,
  toggleShipping,
  toggleBilling,
  setToggleShipping,
  setToggleBilling,
}: SelectAddressDrawerProps) {
  return (
    <Drawer
      placement={"right"}
      width={500}
      open={open}
      onClose={onClose}
      className="custom-drawer p-3 pt-0"
      style={{ zIndex: 1050, position: "absolute" }}
      closable={false}
    >
      <Box sx={{ p: 2, mb: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Typography variant="h6">Change Address</Typography> */}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Change Address
          </Text>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {/* Shipping Addresses */}
        {toggleShipping &&
          addressAll?.map((each, index) => (
            <>
              <div key={index} className="coupon-item mb-3">
                <div>
                  <Text strong className="coupon-code">
                    {each.title}
                  </Text>
                  <Text className="coupon-description">
                    {`${each?.address?.addressLine1} ${each.address?.addressLine2} ${each?.address?.city} ${each?.address?.state} ${each?.address?.country} -${each?.address?.postalCode}`}
                    Ph: {each?.address?.phoneNumber}
                  </Text>
                </div>
                <Button
                  type="text"
                  className="apply-link"
                  onClick={() => {
                    setCheckoutAddress((prev: CheckoutAddress | null) => {
                      const newState: CheckoutAddress = prev || {
                        billingAddress: {} as AddressMaster,
                        shippingAddress: {} as AddressMaster,
                      };
                      return {
                        ...newState,
                        shippingAddress: each.address,
                      };
                    });
                    setToggleShipping(false);
                    onClose();
                  }}
                >
                  Select
                </Button>
              </div>
              {/* <Card key={`shipping-${index}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{each.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${each.address.addressLine1} ${each.address.addressLine2} ${each.address.city} ${each.address.state} ${each.address.country} -${each.address.postalCode}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ph: {each.address.phoneNumber}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCheckoutAddress((prev: CheckoutAddress | null) => {
                          const newState: CheckoutAddress = prev || {
                            billingAddress: {} as AddressMaster,
                            shippingAddress: {} as AddressMaster,
                          };
                          return {
                            ...newState,
                            shippingAddress: each.address,
                          };
                        });
                        setToggleShipping(false);
                        onClose();
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card> */}
            </>
          ))}

        {/* Billing Addresses */}
        {toggleBilling &&
          addressAll?.map((each, index) => (
            <>
              <div key={index} className="coupon-item mb-3">
                <div>
                  <Text strong className="coupon-code">
                    {each.title}
                  </Text>
                  <Text className="coupon-description">
                    {`${each.address.addressLine1} ${each.address.addressLine2} ${each.address.city} ${each.address.state} ${each.address.country} -${each.address.postalCode}`}
                    Ph: {each.address.phoneNumber}
                  </Text>
                </div>
                <Button
                  type="text"
                  className="apply-link"
                  onClick={() => {
                    setCheckoutAddress((prev: CheckoutAddress | null) => {
                      const newState: CheckoutAddress = prev || {
                        billingAddress: {} as AddressMaster,
                        shippingAddress: {} as AddressMaster,
                      };
                      return {
                        ...newState,
                        billingAddress: each.address,
                      };
                    });
                    setToggleBilling(false);
                    onClose();
                  }}
                >
                  Select
                </Button>
              </div>

              {/* <Card key={`billing-${index}`} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{each.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${each.address.addressLine1} ${each.address.addressLine2} ${each.address.city} ${each.address.state} ${each.address.country} -${each.address.postalCode}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ph: {each.address.phoneNumber}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCheckoutAddress((prev: CheckoutAddress | null) => {
                          const newState: CheckoutAddress = prev || {
                            billingAddress: {} as AddressMaster,
                            shippingAddress: {} as AddressMaster,
                          };
                          return {
                            ...newState,
                            billingAddress: each.address,
                          };
                        });
                        setToggleBilling(false);
                        onClose();
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card> */}
            </>
          ))}
      </Box>

      {/* <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button variant="contained" fullWidth color="primary">
          Add New Address
        </Button>
      </Box> */}
    </Drawer>
  );
}
