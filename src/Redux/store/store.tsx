import { configureStore } from "@reduxjs/toolkit";
import authenticationSliceReducer from "../slices/authenticationSlice";
import jwtTokenSliceReducer from "../slices/jwtToken";
import customerCreateSliceReducer from "../slices/createdCustomer";
import headerStickyToggleReducer from "../slices/headerStickyToggle";
import cartSliceReducer from "../slices/addToCart";
import wishlistSliceReducer from "../slices/wishListSlice";
import megaSearchSliceReducer from "../slices/megaSearchSlice";
import avatarReducer from "../slices/avatarSlice";
import locationReducer from "../slices/locationSlice";
import flagReducer from "../slices/flagsSlice";
import socialMediaReducer from "../../Redux/slices/socialMediaSlice";
import retryPaymentTermReducer from "../../Redux/slices/retryPaymentTerm";
import returnTermReducer from "../../Redux/slices/returnTerm";
import currencySliceReducer from "../slices/currencySlice"; 


export const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    wishlist: wishlistSliceReducer,
    loginRequest: authenticationSliceReducer,
    jwtToken: jwtTokenSliceReducer,
    customerCreate: customerCreateSliceReducer,
    headerSticky: headerStickyToggleReducer,
    megaSearch: megaSearchSliceReducer,
    avatar: avatarReducer,
    location: locationReducer,
    flag: flagReducer,
    socialMedia: socialMediaReducer,
    retryPaymentTerm: retryPaymentTermReducer,
    returnTerm: returnTermReducer,
    currency: currencySliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
