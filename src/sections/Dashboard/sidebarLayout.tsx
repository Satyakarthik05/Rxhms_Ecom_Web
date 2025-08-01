import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./sidebar";

const SidebarLayout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // true for md and above (≥900px)
  

  return (
     <Box display="flex" flexDirection={isDesktop ? "row" : "column"}>
      {isDesktop  && (
        <Box sx={{ position: 'sticky', top: 120 }}>
          <Sidebar />
        </Box>
      )}

      <Box sx={{ flexGrow: 1, p: 1 }}>
         <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarLayout;
