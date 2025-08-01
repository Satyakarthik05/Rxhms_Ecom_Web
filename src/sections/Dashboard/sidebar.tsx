import React, { useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  Container,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearLoginResponse } from "../../Redux/slices/jwtToken";
import { clearCart } from "../../Redux/slices/addToCart";
import { clearAvatar } from "../../Redux/slices/avatarSlice";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispath = useDispatch();

  const menuItems = [
    { name: "Overview", path: "/overview" },
    { name: "Profile", path: "/overview/profile" },
    { name: "My Orders", path: "/overview/orders" },
    { name: "My Wishlist", path: "/overview/wishlist" },
    { name: "My Consultations", path: "/overview/consultations" },
    { name: "My Health Records", path: "/overview/health-records" },
    { name: "Manage Payments", path: "/overview/payments" },
    { name: "Help", path: "/overview/help" },
  ];

  const handleLogout = () => {
    dispath(clearLoginResponse());
    dispath(clearCart());
    dispath(clearAvatar());
    window.localStorage.clear();
    navigate("/", { replace: true });
    window.location.reload();
  };

  const [selected, setSelected] = React.useState("");

  useEffect(() => {
    const found = menuItems.find((item) => location.pathname === item.path);
    if (found) setSelected(found.name);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        width: 300,
        position: "sticky",
        top: 120,
        p: 2,
        borderRight: "1px solid #F1EAE4",
        minHeight: "80vh",
        borderRadius: "8px",
        mt: 5,
        ml: 5,
        backgroundColor: (theme) => theme.palette.info.main,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={selected === item.name}
            onClick={() => {
              navigate(item.path);
            }}
            sx={{
              borderLeft:
                selected === item.name
                  ? "4px solid #334F3E"
                  : "4px solid transparent",
              borderRadius: "8px",
              "&.Mui-selected": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              pl: 2,
              my: 0.5,
            }}
          >
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>

      <Button
        onClick={handleLogout}
        variant="outlined"
        color="error"
        fullWidth
        sx={{ mt: 2, textTransform: "none" }}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Sidebar;
