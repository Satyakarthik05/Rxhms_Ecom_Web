import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { BeseAxios, PageState } from "../../web-constants/constants";
import { MegaSearchUriPages } from "../../sections/myCart/service/myCartService";
import { SearchRequest } from "../../sections/Searchbar/model/searchRequest";
import { SearchResponse } from "../../sections/Searchbar/model/searchResponse";

interface MegaSearchState {
  data: SearchResponse;
  status: PageState;
  error: string | null;
}

const initialState: MegaSearchState = {
  data: {} as SearchResponse,
  status: PageState.IDLE,
  error: null,
};

export const fetchMegaSearch = createAsyncThunk<
  SearchResponse,
  SearchRequest,
  { rejectValue: any }
>("megaSearch/fetchMegaSearch", async (value: SearchRequest, thunkAPI) => {
  try {
    console.log("megaSearch Before => megaSearch/fetchMegaSearch", value);
    const response: any = await BeseAxios.post(MegaSearchUriPages, value);
    console.log("megaSearch/fetchMegaSearch", response);
    const productData = response.data.content || [];
    return productData as SearchResponse;
  } catch (err: any) {
    console.error("Service call error:", err);
    console.log("megaSearch/fetchMegaSearch =>> ERROR");
    const errorMessage =
      err.response?.data?.message || "Failed to fetch search results.";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const megaSearchSlice = createSlice({
  name: "megaSearch",
  initialState,
  reducers: {
    storeSearchData: (state, action: PayloadAction<SearchResponse>) => {
      state.data = action.payload || {};
      state.status = PageState.SUCCESS;
      state.error = null;
    },
    cleareSearchData: (state) => {
      state.data = {} as SearchResponse;
      state.status = PageState.SUCCESS;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMegaSearch.pending, (state) => {
        state.status = PageState.LOADING;
        state.data = {} as SearchResponse;
        state.error = null;
      })

      .addCase(
        fetchMegaSearch.fulfilled,
        (state, action: PayloadAction<SearchResponse>) => {
          state.data = action.payload;
          state.status = PageState.SUCCESS;
        }
      )
      .addCase(fetchMegaSearch.rejected, (state, action) => {
        state.status = PageState.ERROR;
        console.log(" @megaSearch/fetchMegaSearch in add case ");
        state.data = {} as SearchResponse;
        state.error = (action.payload as string) || "Unknown error occurred";
      });
  },
});

export const { storeSearchData, cleareSearchData } = megaSearchSlice.actions;
export default megaSearchSlice.reducer;
