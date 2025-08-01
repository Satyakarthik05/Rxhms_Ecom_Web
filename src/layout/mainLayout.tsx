import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../sections/header/header";
import Footer from "../sections/footer/footer";
import SearchBarSection from "../sections/Searchbar/SearchBar";
import { HeaderOffer } from "../sections/headerOffer/headerOffer";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store/store";
import { Box } from "@mui/material";
import BreadcrumbNav from "../sections/Breadcrumb/BreadcrumbNav";
import { useMediaQuery, useTheme } from "@mui/material";

export const MainLayout = () => {
  const isSticky = useSelector((state: RootState) => state.headerSticky.skicy);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact-us";
  const isAboutusPage = location.pathname === "/about-us";
  const isPageNotFound = location.pathname === "*";
  const normalizedPath = location.pathname.replace(/\/+$/, "");
  const isSectionWithoutSlug = normalizedPath === "/section";

  const dispatch = useDispatch<AppDispatch>();
  const username = useSelector((state: RootState) => state.jwtToken.username);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    if (!isSticky) {
      htmlEl.classList.add("hide-scrollbars");
      bodyEl.classList.add("hide-scrollbars");
    } else {
      htmlEl.classList.remove("hide-scrollbars");
      bodyEl.classList.remove("hide-scrollbars");
    }

    // Cleanup if component unmounts
    return () => {
      htmlEl.classList.remove("hide-scrollbars");
      bodyEl.classList.remove("hide-scrollbars");
    };
  }, [isSticky]);

  useEffect(() => {
    const fetchDelivery = async () => {
      // if (username) {
      //   try {
      //     await dispatch(fetchDeliveryInfo(username)).unwrap();
      //   } catch (err) {
      //     console.error("Failed to fetch delivery info:", err);
      //   }
      // } else if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     async (position) => {
      //       try {
      //         const res = await getLatitudeAndLongitude(
      //           position.coords.latitude.toString(),
      //           position.coords.longitude.toString()
      //         );
      //         if (res?.postalCode) {
      //           const estData = await getEstimationDeliverydata(res.postalCode);
      //           dispatch(
      //             setDeliveryInfo({
      //               pincode: res.postalCode,
      //               expectedDate: estData?.expectedDate,
      //             })
      //           );
      //         }
      //       } catch (err) {
      //         console.error("Geolocation error:", err);
      //       }
      //     },
      //     (error) => {
      //       console.error("User denied geolocation access:", error);
      //     }
      //   );
      // }
    };

    fetchDelivery();
  }, [dispatch, username]);

  return (
    <div>
      <div className={isSticky ? "sticky-top" : ""}>
        <HeaderOffer />
        <SearchBarSection />
        {/* <Header /> */}
      </div>
      <Box>
        {!isMobile &&
          !isHomePage &&
          !isContactPage &&
          !isAboutusPage &&
          !isPageNotFound &&
          !isSectionWithoutSlug && <BreadcrumbNav />}
        <Outlet />
      </Box>
      <Footer />
    </div>
  );
};
