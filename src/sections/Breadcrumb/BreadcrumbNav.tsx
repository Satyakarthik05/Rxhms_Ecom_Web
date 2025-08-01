import React from "react";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

const BreadcrumbNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Split the path into segments, filtering out any empty strings
  const pathnames = location.pathname.split("/").filter((x) => x);

  // If the entire pathname matches one of these, hide the breadcrumb bar
  const hiddenPaths = [
    "/cart/bag",
    "/cart/bag/checkout",
    "/cart/bag/ordersummary",
    "/product/reviews/:slug",
    "/product/reviews/gallery/:slug",
    "/order-details/",
    "/order-details/:orderNum",
    "/product/ratings/:orderNum",
    "/return-order/:orderNum",
    "/overview/view-tickets",
    "/overview/view-tickets/:orderNum",
  ];

  const shouldHide = hiddenPaths.some((pattern) =>
    Boolean(matchPath({ path: pattern, end: true }, location.pathname))
  );

  if (shouldHide) {
    return null;
  }
  return (
    <Box
      sx={{ padding: 1, backgroundColor: (theme) => theme.palette.info.main }}
    >
      <div className="container">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={
            <NavigateNextOutlinedIcon
              fontSize="small"
              sx={{ color: "#77878F" }}
            />
          }
        >
          {/* Home breadcrumb (always clickable) */}
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <HomeOutlinedIcon fontSize="small" sx={{ color: "#5F6C72" }} />
            Home
          </Link>

          {/* Map over each path segment */}
          {pathnames.map((value, index) => {
            // Build the route up to this segment
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;
            // The last index is pathnames.length - 1
            const isLast = index === pathnames.length - 1;

            // Skip rendering if it’s the “order number” route (e.g. /overview/track-orders/1234)
            const isOrderNumRoute =
              pathnames[0] === "overview" &&
              pathnames[1] === "track-orders" &&
              index === 2;
            if (isOrderNumRoute) {
              return null;
            }

            // Convert “some-slug” → “Some Slug”
            let label = decodeURIComponent(value)
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            // Skip “Collection” and “Section”
            if (label === "Collection" || label === "Section") {
              return null;
            }
            if (label === "Faq") {
              label = "Frequently Asked Questions";
            }

            return (
              <Link
                underline="hover"
                color="inherit"
                key={to}
                {...(!isLast && {
                  onClick: () => {
                    if (label === "Product") {
                      navigate(-1);
                    } else {
                      navigate(to);
                    }
                  },
                })}
                sx={{
                  cursor: isLast ? "default" : "pointer",
                  "&:hover": {
                    textDecoration: isLast ? "none" : "underline",
                  },
                  ...(isLast && {
                    color: (theme) => theme.palette.success.light,
                    fontWeight: 500,
                  }),
                }}
              >
                {label === "Product" ? "Products" : label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
    </Box>
  );
};

export default BreadcrumbNav;
