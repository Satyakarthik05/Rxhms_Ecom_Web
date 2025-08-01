import type React from "react";
import { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Link as MuiLink,
  Container,
} from "@mui/material";
import { Phone } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import "./footer.css";
import FooterLogo from "../../assets/media/icons/RxHMS f_logo_white.svg";
import { useFetch } from "../../customHooks/useFetch";
import { type FooterType, getPlatformIcon } from "./model/footerType";
import { GetFooterData } from "./footerService/footerService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Redux/store/store";
import { fetchSocialMediaData } from "../../Redux/slices/socialMediaSlice";

export const dummyFooters = [
  {
    id: 1,
    title: "Quick Links",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/44/44948.png", // Earth globe icon
    footerDetails: [
      { id: 1, title: "Home", url: "/" },
      { id: 2, title: "About Us", url: "/about" },
      { id: 3, title: "Contact Us", url: "/contact" },
    ],
  },
  {
    id: 2,
    title: "Categories",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/1034/1034131.png", // Network nodes icon
    footerDetails: [
      { id: 4, title: "Face", url: "/categories/face" },
      { id: 5, title: "Hair", url: "/categories/hair" },
      { id: 6, title: "Minis", url: "/categories/minis" },
      { id: 7, title: "Accessories", url: "/categories/accessories" },
      { id: 8, title: "Skin", url: "/categories/skin" },
      { id: 9, title: "Bath & Body", url: "/categories/bath-body" },
      { id: 10, title: "Wellness", url: "/categories/wellness" },
    ],
  },
  {
    id: 3,
    title: "Policy Links",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/44/44948.png", // Reused globe icon
    footerDetails: [
      { id: 11, title: "Terms & Conditions", url: "/policy/terms" },
      { id: 12, title: "FAQ", url: "/policy/faq" },
      { id: 13, title: "Help", url: "/policy/help" },
    ],
  },
];

const Footer: React.FC = () => {
  // const { data: footers } = useFetch<FooterType[]>(GetFooterData);
  // console.log("Footer Data:", footers);

  const footers = dummyFooters;
  const location = useLocation();
  const currectPath = location.pathname;
  console.log("useLocation", useLocation());
  // const dispatch = useDispatch<AppDispatch>();
  // const socialMediaState = useSelector((state: RootState) => state.socialMedia);

  // useEffect(() => {
  //   dispatch(fetchSocialMediaData());
  // }, [dispatch]);
  // console.log("Social Media State:", socialMediaState);

  return (
    <Container
      maxWidth="xl"
      className="py-3"
      sx={{ backgroundColor: "#000", color: "#ffffffcc" }}
    >
      <Grid container sx={{ width: "100%" }} spacing={3}>
        {/* Logo Section */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", sm: "center" },
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "start", sm: "start", md: "start" },
              alignItems: { xs: "start", sm: "start", md: "start" },
            }}
          >
            <Box
              component={NavLink}
              to="/"
              sx={{
                textDecoration: "none",
                p: { xs: "8px 8px 8px 0px", md: "8px" },
                display: "inline-block",
              }}
            >
              {/* <Box
                component="img"
                src={FooterLogo}
                alt="Logo"
                sx={{
                  width: { xs: "auto", sm: 150, md: 140, lg: "auto" },
                  height: "auto",
                  display: "block",
                }}
              /> */}

              <Typography
                sx={{
                  color: (theme) => "#fff",
                  fontSize: "35px",

                  fontWeight: 500,
                  "&:hover": {
                    color: (theme) => theme.palette.success.main,
                  },
                }}
              >
                RxHMS
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 1, padding: { xs: "8px 8px 8px 0px", md: "8px" } }}
            >
              For every day,
              <br className="d-none d-sm-block" /> for every mood, for every you
            </Typography>
          </Box>
        </Grid>

        {/* Footer Sections */}
        {footers?.map((footer) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={footer.id}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "center" },
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: { sm: "200px" } }}>
              {/* Section Header */}
              <Box
                sx={{
                  fontWeight: "400",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "flex-start", sm: "flex-start" },
                  gap: 1,
                  mb: 2,
                }}
              >
                {footer.logoUrl && (
                  <Box
                    sx={{
                      display: "inline-block",
                      borderBottom: "2px solid white",
                      pb: 0.5,
                    }}
                  >
                    <img
                      src={footer.logoUrl || "/placeholder.svg"}
                      alt="section logo"
                      style={{ width: 30, height: 30 }}
                    />
                  </Box>
                )}
                <Typography variant="h6" sx={{ fontWeight: "400" }}>
                  {footer.title}
                </Typography>
              </Box>

              {/* Section Content */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", sm: "flex-start" },
                  width: "100%",
                }}
              >
                {footer?.footerDetails?.length > 4 ? (
                  <Box sx={{ width: "100%", maxWidth: "200px" }}>
                    <Grid container spacing={1}>
                      {footer.footerDetails?.map((detail) => (
                        <Grid item xs={6} key={detail.id}>
                          <MuiLink
                            component={NavLink}
                            to={detail.url}
                            onClick={() => {
                              if (detail.url === currectPath) {
                                window.scrollTo(0, 0);
                              }
                            }}
                            color="inherit"
                            underline="none"
                            display="block"
                            sx={{
                              fontSize: "14px",
                              lineHeight: "20px",
                              textTransform: "none",
                              letterSpacing: "0%",
                              my: 0.5,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {detail.title}
                          </MuiLink>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: { xs: "flex-start", sm: "flex-start" },
                    }}
                  >
                    {footer.footerDetails?.map((detail) => (
                      <MuiLink
                        key={detail.id}
                        component={NavLink}
                        to={detail.url}
                        onClick={() => {
                          if (detail.url === currectPath) {
                            window.scrollTo(0, 0);
                          }
                        }}
                        color="inherit"
                        underline="none"
                        display="block"
                        sx={{
                          fontSize: "14px",
                          lineHeight: "20px",
                          textTransform: "none",
                          letterSpacing: "0%",
                          my: 1,
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {detail.title}
                      </MuiLink>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Mobile Phone Button */}
      <Button
        variant="contained"
        className="d-block d-md-none"
        sx={{ backgroundColor: "#0AA44F", color: "#fff", mt: 2 }}
      >
        <Phone /> +91 79770 90909
      </Button>

      {/* Mobile Social Media Icons */}
      {/* <Box sx={{ mt: 2, display: { xs: "flex", sm: "none" }, gap: 1 }}>
        {socialMediaState.data.map((media) => {
          const Icon = getPlatformIcon(media.platform);
          return (
            Icon && (
              <IconButton
                key={media.id}
                sx={{ color: "white" }}
                component="a"
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </IconButton>
            )
          );
        })}
      </Box> */}

      {/* Bottom Section */}
      <Box
        sx={{
          borderTop: "1px solid gray",
          mt: 3,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          className="text-strt"
          variant="body2"
          sx={{
            color: "white",
            pl: { xs: 0, md: 1 },
            fontSize: { xs: "12px", md: "16px" },
          }}
        >
          Copyright © 2025 RxHMS.com. All Rights Reserved.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, pr: 2 }}>
          <Button
            variant="contained"
            className="d-none d-md-block"
            sx={{ backgroundColor: "#0AA44F", color: "#fff" }}
          >
            <Phone />
            +91 79770 90909
          </Button>

          {/* <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1 }}>
            {socialMediaState.data.map((media) => {
              const Icon = getPlatformIcon(media.platform);
              return (
                Icon && (
                  <IconButton
                    key={media.id}
                    sx={{ color: "white" }}
                    component="a"
                    href={media.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </IconButton>
                )
              );
            })}
          </Box> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Footer;
