import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BeseAxios, PageState } from "../../web-constants/constants";
import { GET_FLAGS } from "../../sections/inventoryProduct/service/service";
import { FlagMaster } from "../../sections/inventoryProduct/model/flagMaster";
import { FlagItems } from "../../sections/inventoryProduct/model/flagItems";

interface CustomFlag {
  flags: FlagMaster[];
  flagDetails: Record<number, any>;
  status: PageState;
  flagItemsIds: number[];
}

export const getFlagsAsync = createAsyncThunk<
  FlagMaster[],
  void,
  { rejectValue: string }
>("flags/getflags", async (_arg, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get(GET_FLAGS);
    if (!response.data.errorPresent) {
      console.log("response @@ GET FLAGS", response.data.content);
      return response.data.content as FlagMaster[];
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const initialState: CustomFlag = {
  flags: [],
  flagDetails: [],
  status: PageState.IDLE,
  flagItemsIds: [],
};

const flagSlice = createSlice({
  name: "flag",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Pending
      .addCase(getFlagsAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      // Fulfilled
      .addCase(
        getFlagsAsync.fulfilled,
        (state, action: PayloadAction<FlagMaster[]>) => {
          state.status = PageState.SUCCESS;
          state.flags = action.payload;
          console.log(action.payload, "#&&&in flas response action.payload");

          if (action.payload.length > 0) {
            const allItemIds = action.payload.flatMap((flag: FlagMaster) =>
              flag.flagItems.map((item: FlagItems) => item.itemId)
            );
            state.flagItemsIds = allItemIds;
            console.log(allItemIds, "#&&&in flas allItemIds ");

            const flagDetails: Record<number, any> = action.payload.reduce(
              (acc, flag: FlagMaster) => {
                flag.flagItems.forEach((item: FlagItems) => {
                  acc[item.itemId] = {
                    flag: flag.flag,
                    flagColour: flag.flagColour,
                    description: flag.description,
                    status: flag.status,
                    textColour : flag.textColour,
                  };
                });
                return acc;
              },
              {} as Record<number, any>
            );
            state.flagDetails = flagDetails;
            console.log(flagDetails, "#&&&in flas flagDetails");
          }
        }
      )
      // Rejected
      .addCase(getFlagsAsync.rejected, (state) => {
        state.status = PageState.ERROR;
        state.flagItemsIds = [];
      });
  },
});

export default flagSlice.reducer;
