import React from "react";
import "./home.css";
import HomeScreenCarousel from "../../sections/homeCarousel/homeScreenCarousel";
import { RootState } from "../../Redux/store/store";
import { useSelector } from "react-redux";

export const Home = () => {
  const token = useSelector((state: RootState) => state.jwtToken);
  const cart = useSelector((state: RootState) => state.cart.cart.totalItems);
  const loginRequestData = useSelector(
    (state: RootState) => state.loginRequest
  );
  console.log("token :", token);
  console.log("loginRequestData :", loginRequestData);
  console.log("cart :", cart);
  return (
    <div>
      <HomeScreenCarousel />
    </div>
  );
};
