import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CodeMaster } from "../../sections/myCart/model/codeMaster";
import { BeseAxios, PageState } from "../../web-constants/constants";

interface RetryPaymentTermState {
  code: CodeMaster;
  RETRY_PAYMENT_MINUTES: string | null;
  ENABLE_RETRY_PAYMENT_MINUTES: string | null;
  error: string | null;
  status: PageState;
}

const initialState: RetryPaymentTermState = {
  code: {} as CodeMaster,
  error: null,
  RETRY_PAYMENT_MINUTES: null,
  ENABLE_RETRY_PAYMENT_MINUTES: null,
  status: PageState.IDLE,
};

export const retryPaymentTermAsync = createAsyncThunk<
  CodeMaster,
  void,
  { rejectValue: string }
>("retryPaymentTerm/getTerm", async (_, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get("/settings/code/get/order-term");
    console.log("retryPaymentTermAsync", response);
    return response.data.content;
  } catch (err: any) {
    console.log("retryPaymentTermAsync", err);
    return rejectWithValue(err.message || "Failed to fetch payment terms");
  }
});

const retryPaymentTerm = createSlice({
  name: "retryPaymentTerm",
  initialState,
  reducers: {
    resetPaymentTerm: (state) => {
      state.code = {} as CodeMaster;
      state.error = null;
      state.status = PageState.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retryPaymentTermAsync.pending, (state) => {
        state.status = PageState.LOADING;
        state.error = null;
      })
      .addCase(
        retryPaymentTermAsync.fulfilled,
        (state, action: PayloadAction<CodeMaster>) => {
          state.status = PageState.SUCCESS;
          state.code = action.payload;
          const details = action.payload.codedetails;

          state.RETRY_PAYMENT_MINUTES =
            details.find((d) => d.paramKey === "RETRY_PAYMENT_MINUTES")
              ?.paramValue ?? null; // "30"

          state.ENABLE_RETRY_PAYMENT_MINUTES =
            details.find((d) => d.paramKey === "ENABLE_RETRY_PAYMENT_MINUTES")
              ?.paramValue ?? null;

          state.error = null;
        }
      )
      .addCase(retryPaymentTermAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const { resetPaymentTerm } = retryPaymentTerm.actions;
export default retryPaymentTerm.reducer;
