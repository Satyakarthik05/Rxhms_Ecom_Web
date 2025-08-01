import React, { useState } from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import { DeliveryEstimation } from "../Dashboard/model/deliveryEstimation";
import { getEstimationDeliverydata } from "../Dashboard/profileService/profileService";
import { Input, Button, Space } from "antd";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
  onConfirmDelivery?: (
    info: DeliveryEstimation & { pincode: string }
  ) => void;
}

const ChooseLocationDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
  onConfirmDelivery,
}) => {
  const [pincode, setPincode] = useState("");

  const [deliveryData, setDeliveryData] = useState<DeliveryEstimation | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode");
      setDeliveryData(null);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await getEstimationDeliverydata(Number(pincode));
      setDeliveryData(data);
    } catch (err) {
      setError("Unable to fetch delivery data. Please try again.");
      setDeliveryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setPincode("");
    setDeliveryData(null);
    setError("");
    onClose();
  };

  return (
    <>
      <Drawer
        placement={placement}
        onClose={handleCloseDrawer}
        open={open}
        width={500}
        className="custom-drawer p-3"
        style={{ zIndex: 1050, position: "absolute" }}
        closable={false}
        height={"100vh"}
      >
        <div style={{ height: "90%" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className=" m-0">CHOOSE YOUR LOCATION</h4>
            <button className="btn btn-light border-0" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
          <hr className="my-3" />
          <form className="h-100" onSubmit={(e) => e.preventDefault()}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="mb-3">
                  <label htmlFor="wishlistName" className="form-label">
                    Enter Pincode
                  </label>
                  <Space.Compact className="w-100">
                    <Input
                      placeholder="Enter Pincode"
                      value={pincode}
                      style={{ height: "45px", fontSize: "16px" }}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "ArrowLeft",
                          "ArrowRight",
                          "Tab",
                        ];
                        if (
                          !/^\d$/.test(e.key) &&
                          !allowedKeys.includes(e.key)
                        ) {
                          e.preventDefault(); 
                        }
                    
                        if (e.key === "Enter" && /^\d{6}$/.test(pincode)) {
                          handleCheckDelivery();
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      style={{
                        height: "45px",
                        backgroundColor: "#334F3E",
                        borderColor: "#334F3E",
                        color: "white",
                        opacity: /^\d{6}$/.test(pincode) ? 1 : 0.6,
                        cursor: /^\d{6}$/.test(pincode)
                          ? "pointer"
                          : "not-allowed",
                      }}
                      onClick={handleCheckDelivery}
                      disabled={!/^\d{6}$/.test(pincode)}
                    >
                      {loading ? "Checking..." : "Check"}
                    </Button>
                  </Space.Compact>

                  {error && <p className="text-danger mt-2">{error}</p>}

                  {deliveryData && (
                    <>
                      <div className="mt-3">
                        <p>
                          <strong>Estimated Delivery:</strong>{" "}
                          {deliveryData.expectedDays} days
                        </p>
                        <p>
                          <strong>Expected Date:</strong>{" "}
                          {new Date(deliveryData.expectedDate).toDateString()}
                        </p>
                        <p>
                          <strong>Delivery Charges:</strong> ₹
                          {deliveryData.charges}
                        </p>
                      </div>

                      <Button
                        type="primary"
                        block
                        style={{
                          marginTop: "20px",
                          height: "45px",
                          backgroundColor: "#334F3E",
                          borderColor: "#334F3E",
                          color: "white",
                        }}
                        onClick={() => {
                          const selectedInfo = {
                            ...deliveryData,
                            pincode,
                            expectedDate: deliveryData.expectedDate,
                          };
                          if (onConfirmDelivery) {
                            onConfirmDelivery(selectedInfo);
                          }
                          handleCloseDrawer();
                        }}
                      >
                        Confirm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </Drawer>
    </>
  );
};

export default ChooseLocationDrawer;
