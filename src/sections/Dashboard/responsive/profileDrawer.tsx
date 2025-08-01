import React from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import { clearLoginResponse } from "../../../Redux/slices/jwtToken";
import { clearCart } from "../../../Redux/slices/addToCart";
import { clearAvatar } from "../../../Redux/slices/avatarSlice";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
}

const ProfileDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
}) => {
  const navigate = useNavigate();
  const dispath = useDispatch();
  const location = useLocation();

  const menuItems = [
    { label: "Overview", value: "" },
    { label: "Profile", value: "profile" },
    { label: "Orders", value: "orders" },
    { label: "Wishlist", value: "wishlist" },
    { label: "Help", value: "help" },
  ];

  const handleMenuClick = (value: string) => {
    navigate(`/overview/${value}`);
    onClose();
  };

  const handleLogout = () => {
    dispath(clearLoginResponse());
    dispath(clearCart());
    dispath(clearAvatar());
    window.localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <Drawer
      placement={placement}
      onClose={onClose}
      open={open}
      width={300}
      className="custom-drawer p-3"
      style={{ zIndex: 1050, position: "absolute" }}
      closable={false}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold m-0 text-dark">Profile</h6>
        <button
          className="border-0 bg-light rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 30, height: 30 }}
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>

      <hr className="my-2" />

      {menuItems.map((item, index) => {
        const isActive = location.pathname === `/overview/${item.value}`;
        return (
          <div key={index}>
            <div
              className="py-2 px-2 text-dark rounded"
              style={{
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: isActive ? "#f5f5f5" : "transparent",
                borderLeft: isActive
                  ? "4px solid #334F3E"
                  : "4px solid transparent",
              }}
              onClick={() => handleMenuClick(item.value)}
            >
              {item.label}
            </div>
            <hr className="my-0" />
          </div>
        );
      })}

      <div
        className="py-2 px-1 text-danger"
        style={{ fontSize: "14px", cursor: "pointer" }}
        onClick={handleLogout}
      >
        Logout
      </div>
      <hr className="my-1" />
    </Drawer>
  );
};

export default ProfileDrawer;
