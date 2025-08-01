import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "../../sections/login/model/loginResponse";

const loginResponseData: LoginResponse = JSON.parse(
  window.localStorage.getItem("loginResponse") || "{}"
);

const initialState: LoginResponse = {
  token: loginResponseData.token,
  username: loginResponseData.username || "",
  isExist: loginResponseData.isExist,
  isCustomerExist: loginResponseData.isCustomerExist,
};

const jwtTokenSlice = createSlice({
  name: "jwtToken",
  initialState,
  reducers: {
    storeLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      console.log("$$$$$$=>loginResponse", current(state));
      localStorage.setItem("loginResponse", JSON.stringify(action.payload));
      return { ...state, ...action.payload };
    },
    clearLoginResponse: () => {
      window.localStorage.removeItem("loginResponse");
      return {
        token: "",
        username: "",
        isExist: false,
        isCustomerExist: false,
      };
    },
  },
});

export const { storeLoginResponse, clearLoginResponse } = jwtTokenSlice.actions;
export default jwtTokenSlice.reducer;
