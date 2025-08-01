import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CodeMaster } from "../../sections/myCart/model/codeMaster";
import { BeseAxios, PageState } from "../../web-constants/constants";

interface ReturnTermState {
  code: CodeMaster;
  DAYS: string | null;
  RETURN_ALLOWED: string | null;
  error: string | null;
  status: PageState;
}

const initialState: ReturnTermState = {
  code: {} as CodeMaster,
  error: null,
  DAYS: null,
  RETURN_ALLOWED: null,
  status: PageState.IDLE,
};

export const returnTermAsync = createAsyncThunk<
  CodeMaster,
  void,
  { rejectValue: string }
>("returnTerm/getTerm", async (_, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get(
      "/settings/code/get/return-terms"
    );
    console.log("returnTermAsync", response);
    return response.data.content;
  } catch (err: any) {
    console.log("returnTermAsync", err);
    return rejectWithValue(err.message || "Failed to fetch payment terms");
  }
});

const returnTerm = createSlice({
  name: "returnTerm",
  initialState,
  reducers: {
    resetReturnTerm: (state) => {
      state.code = {} as CodeMaster;
      state.error = null;
      state.status = PageState.IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(returnTermAsync.pending, (state) => {
        state.status = PageState.LOADING;
        state.error = null;
      })
      .addCase(
        returnTermAsync.fulfilled,
        (state, action: PayloadAction<CodeMaster>) => {
          state.status = PageState.SUCCESS;
          state.code = action.payload;
          const details = action.payload.codedetails;

          console.log("returnTerm", details);

          state.DAYS =
            details.find((d) => d.paramKey === "DAYS")?.paramValue ?? null; // "7"

          state.RETURN_ALLOWED =
            details.find((d) => d.paramKey === "RETURN_ALLOWED")?.paramValue ??
            null;

          state.error = null;
        }
      )
      .addCase(returnTermAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const { resetReturnTerm } = returnTerm.actions;
export default returnTerm.reducer;
