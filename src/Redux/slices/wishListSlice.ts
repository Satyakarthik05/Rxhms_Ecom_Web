import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BeseAxios, PageState } from "../../web-constants/constants";
import { Wishlist } from "../../sections/Dashboard/model/wishlist";
import {
  CreateWishlistItemUri,
  CreateWishlistUri,
  DeleteWishlistIteFromDefaultUri,
  DeleteWishlistUri,
  GetWishlistByIdUri,
  GetWishlistDefaultUri,
  GetWishlistUri,
  MovetoWishlistUri,
  UpdateWishlistUri,
} from "../../sections/Dashboard/profileService/profileService";
import { WishlistItem } from "../../sections/Dashboard/model/wishlistItem";

interface WishlistState {
  wishlist: Wishlist[];
  wishlistItems: WishlistItem[];
  defaultWishListItemsIds: number[];
  error: string | null;
  status: PageState;
}

const initialState: WishlistState = {
  wishlist: [],
  wishlistItems: [],
  defaultWishListItemsIds: [],
  error: null,
  status: PageState.IDLE,
};

export const getDefaultWishlistAsync = createAsyncThunk<
  Wishlist,
  { username: string },
  { rejectValue: string }
>("wishlist/getDefaultWishlist", async ({ username }, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get(GetWishlistDefaultUri, {
      params: { username },
    });
    console.log("GET Default Wishlist Response:", response.data.content);
    return response.data.content;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const deleteDefaultWishItemAsync = createAsyncThunk<
  number,
  { username: string; itemId: number; wishlistId: null },
  { rejectValue: string }
>(
  "wishlist/deleteDefaultWishItem",
  async ({ itemId, username, wishlistId }, { rejectWithValue }) => {
    try {
      const response: any = await BeseAxios.delete(
        DeleteWishlistIteFromDefaultUri,
        {
          params: { username, itemId, wishlistId },
        }
      );

      return response.data.content && itemId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getWishlistAsync = createAsyncThunk<
  Wishlist[],
  { username: string },
  { rejectValue: string }
>("wishlist/getWishlist", async ({ username }, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get(GetWishlistUri, {
      params: { username },
    });
    console.log("GET Wishlist Response:", response.data.content);
    return response.data.content ?? [];
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchWishlistItemsAsync = createAsyncThunk<
  WishlistItem[],
  { wishlistId: number },
  { rejectValue: string }
>(
  "wishlist/fetchWishlistItems",
  async ({ wishlistId }, { rejectWithValue }) => {
    try {
      const response: any = await BeseAxios.get(GetWishlistByIdUri, {
        params: { wishlistId },
      });
      console.log("GET WishlistItem Response:", response.data.content);
      return response.data.content ?? [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createWishlistAsync = createAsyncThunk<
  Wishlist[],
  Partial<Wishlist>,
  { rejectValue: string }
>("wishlist/createWishlist", async (wishlistData, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.post(CreateWishlistUri, wishlistData);
    console.log("Created Wishlist Response:", response.data.content);
    return response.data.content ? [response.data.content] : [];
  } catch (error: any) {
    const message =
      error?.response?.data?.apiError?.debugMessage ||
      error?.message ||
      "Unknown error occurred";
    return rejectWithValue(message);
  }
});

export const createWishlistItemAsync = createAsyncThunk<
  WishlistItem[],
  Partial<WishlistItem>,
  { rejectValue: string }
>(
  "wishlist/createWishlistItem",
  async (wishlistItemData, { rejectWithValue }) => {
    try {
      const response: any = await BeseAxios.post(
        CreateWishlistItemUri,
        wishlistItemData
      );
      console.log("Created Wishlist Item Response:", response.data.content);
      return response.data.content ? [response.data.content] : [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateWishlistAsync = createAsyncThunk<
  Wishlist,
  Partial<Wishlist>,
  { rejectValue: string }
>("wishlist/updateWishlist", async (wishlistData, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.put(UpdateWishlistUri, wishlistData);
    console.log("Updated Wishlist Response:", response.data.content);
       return response.data.content; 
  } catch (error: any) {
    const message =
      error?.response?.data?.apiError?.debugMessage ||
      error?.message ||
      "Unknown error occurred";
    return rejectWithValue(message);
  }
});

export const deleteWishlistAsync = createAsyncThunk<
  number,
  { wishlistId: number },
  { rejectValue: string }
>("wishlist/deleteWishlist", async ({ wishlistId }, { rejectWithValue }) => {
  try {
    await BeseAxios.delete(DeleteWishlistUri, {
      params: { wishlistId },
    });
    console.log("Deleted Wishlist ID:", wishlistId);
    return wishlistId;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const moveWishlistItemsAsync = createAsyncThunk<
  boolean,
  { sourceWishlistId: number; destinationWishlistId: number },
  { rejectValue: string }
>(
  "wishlist/moveWishlistItems",
  async ({ sourceWishlistId, destinationWishlistId }, { rejectWithValue }) => {
    try {
      const response: any = await BeseAxios.put(MovetoWishlistUri, null, {
        params: {
          sourceWishlistId,
          destinationWishlistId,
        },
      });
      console.log("Move Wishlist Items Response:", response.data);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error moving wishlist items");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    updateWishlistData: (state, action: PayloadAction<Partial<Wishlist>>) => {
      state.wishlist = state.wishlist.map((wishlistItem) =>
        wishlistItem.id === action.payload.id
          ? { ...wishlistItem, ...action.payload }
          : wishlistItem
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDefaultWishlistAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        getDefaultWishlistAsync.fulfilled,
        (state, action: PayloadAction<Wishlist>) => {
          state.status = PageState.SUCCESS;
          console.log(
            "Payload in getDefaultWishlistAsync.fulfilled:",
            action.payload
          );
          state.defaultWishListItemsIds = action.payload.wishlistItem.map(
            (each) => each.itemId
          );

          // If the default wishlist is found, update it or add it to the list
          // if (action.payload) {
          //   const existingIndex = state.wishlist.findIndex(
          //     (w) => w.id === action.payload?.id
          //   );
          //   if (existingIndex !== -1) {
          //     state.wishlist[existingIndex] = action.payload;
          //   } else {
          //     state.wishlist.push(action.payload);
          //   }
          // }
        }
      )
      .addCase(getDefaultWishlistAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error =
          action.payload || "Unknown error fetching default wishlist";
      })

      .addCase(createWishlistAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        createWishlistAsync.fulfilled,
        (state, action: PayloadAction<Wishlist[]>) => {
          state.status = PageState.SUCCESS;
          state.wishlist = action.payload;
        }
      )
      .addCase(createWishlistAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error creating wishlist";
      })

      .addCase(getWishlistAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        getWishlistAsync.fulfilled,
        (state, action: PayloadAction<Wishlist[]>) => {
          state.status = PageState.SUCCESS;
          state.wishlist = action.payload;
        }
      )
      .addCase(getWishlistAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error fetching wishlist";
      })

      .addCase(fetchWishlistItemsAsync.pending, (state) => {
        state.status = PageState.LOADING;
        state.wishlistItems = [];
      })
      .addCase(
        fetchWishlistItemsAsync.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.status = PageState.SUCCESS;
          state.wishlistItems = action.payload || [];
        }
      )

      .addCase(createWishlistItemAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        createWishlistItemAsync.fulfilled,
        (state, action: PayloadAction<WishlistItem[]>) => {
          state.status = PageState.SUCCESS;
          state.wishlistItems = action.payload;
        }
      )
      .addCase(createWishlistItemAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error creating wishlist item";
      })

      .addCase(updateWishlistAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        updateWishlistAsync.fulfilled,
        (state, action: PayloadAction<Wishlist>) => {
          state.status = PageState.SUCCESS;
          state.wishlist = state.wishlist.map((w) =>
            w.id === action.payload.id ? action.payload : w
          );
        }
      )
      .addCase(updateWishlistAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error updating wishlist";
      })

      .addCase(deleteWishlistAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        deleteWishlistAsync.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = PageState.SUCCESS;
          state.wishlist = state.wishlist.filter(
            (w) => w.id !== action.payload
          );
          state.wishlistItems = [];
        }
      )
      .addCase(deleteWishlistAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error deleting wishlist";
      })

      .addCase(moveWishlistItemsAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(moveWishlistItemsAsync.fulfilled, (state) => {
        state.status = PageState.SUCCESS;
      })
      .addCase(moveWishlistItemsAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error moving wishlist items";
      })

      // deleteDefaultWishItemAsync
      .addCase(deleteDefaultWishItemAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })

      .addCase(deleteDefaultWishItemAsync.fulfilled, (state, action) => {
        state.status = PageState.SUCCESS;
        state.defaultWishListItemsIds = state.defaultWishListItemsIds.filter(
          (each) => each !== action.payload
        );
      })
      .addCase(deleteDefaultWishItemAsync.rejected, (state) => {
        state.status = PageState.ERROR;
        state.defaultWishListItemsIds = [];
      });
  },
});

export const { updateWishlistData } = wishlistSlice.actions;
export default wishlistSlice.reducer;
