import React from "react";
import { Drawer } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  placement?: "left" | "right";
}

const ProductsDrawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  placement = "right",
}) => {
  return (
    <Drawer
      placement={placement}
      onClose={onClose}
      open={open}
      width={300}
      className="custom-drawer p-3"
      style={{ zIndex: 1050, position: "absolute" }}
      closable={false}
    ></Drawer>
  );
};

export default ProductsDrawer;
