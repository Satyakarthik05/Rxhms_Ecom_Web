import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { LoginRequest } from "../../sections/login/model/loginRequest";
import { CustomerRegistration } from "../../sections/register/model/customerRegistration";

const customerCreateSlice = createSlice({
  name: "loginRequest",
  initialState: {} as LoginRequest,
  reducers: {
    storeLoginStatus: (state, action: PayloadAction<CustomerRegistration>) => {
      console.log("$$$$$$=>store data", current(state));
      return { ...state, ...action.payload };
    },
  },
});

export const { storeLoginStatus } = customerCreateSlice.actions;
export default customerCreateSlice.reducer;
