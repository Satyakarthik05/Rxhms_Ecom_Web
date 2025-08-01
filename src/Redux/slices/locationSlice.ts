import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEstDeliveryByusername } from "../../sections/Dashboard/profileService/profileService";

interface DeliveryState {
  pincode: string | null;
  expectedDate: number | null;
  loading: boolean;
  
}

const initialState: DeliveryState = {
  pincode: null,
  expectedDate: null,
  loading: false,
};

export const fetchDeliveryInfo = createAsyncThunk(
  "location/fetchDeliveryInfo",
  async (username: string) => {
    const data = await getEstDeliveryByusername(username);
    return data;
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setDeliveryInfo(state, action) {
        state.pincode = action.payload.pincode;
        state.expectedDate = action.payload.expectedDate;
      }
      
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryInfo.fulfilled, (state, action) => {
        state.pincode = action.payload?.pincode;
        state.expectedDate = action.payload?.expectedDate;
        state.loading = false;
      })
      .addCase(fetchDeliveryInfo.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setDeliveryInfo } = locationSlice.actions;
export default locationSlice.reducer;
