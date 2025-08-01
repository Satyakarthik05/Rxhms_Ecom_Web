import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { LoginRequest } from "../../sections/login/model/loginRequest";

const authenticationSlice = createSlice({
  name: "loginRequest",
  initialState: {} as LoginRequest,
  reducers: {
    storeLoginStatus: (state, action: PayloadAction<LoginRequest>) => {
      console.log("$$$$$$=>store data", current(state));

      return { ...state, ...action.payload };
    },
  },
});

export const { storeLoginStatus } = authenticationSlice.actions;
export default authenticationSlice.reducer;
