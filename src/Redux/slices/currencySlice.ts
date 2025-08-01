import { createSlice } from "@reduxjs/toolkit";
import currencyList, { Currency } from "../../utils/currencyList";
import { RootState } from "../store/store";

interface CurrencyState {
  currencyList: Currency[];
}

const initialState: CurrencyState = {
  currencyList: currencyList
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {}
});

export const selectCurrencyList = (state: RootState) =>
  state.currency.currencyList;

export const selectCurrencySymbol = (state: RootState): string =>
  state.currency.currencyList.find((c) => c.code === "INR")?.symbol || "";

export default currencySlice.reducer;
