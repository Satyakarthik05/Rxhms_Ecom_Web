import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BeseAxios, PageState } from "../../web-constants/constants";
import { Cart } from "../../sections/addToBag/model/cart";
import { AddToCartRequest } from "../../sections/addToBag/model/addToCartRequest";
import {
  AddToCart,
  GetCart,
} from "../../sections/inventoryProduct/service/service";

interface CartState {
  cart: Cart;
  error: string | null;
  status: PageState;
  cartItemsIds: number[];
}

export const postByBody = async <T,>(
  uri: string,
  postData: AddToCartRequest
): Promise<T> => {
  const response: any = await BeseAxios.post(uri, postData);
  console.log("response @@ POST", response);
  return response.data.content;
};

export const addToCartAsync = createAsyncThunk<
  Cart,
  AddToCartRequest,
  { rejectValue: string }
>("cart/addToCart", async (addToCartData, { rejectWithValue }) => {
  try {
    const data = await postByBody<Cart>(AddToCart, addToCartData);
    console.log();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const getCartAsync = createAsyncThunk<
  Cart,
  { username: string },
  { rejectValue: string }
>("cart/getCart", async ({ username }, { rejectWithValue }) => {
  try {
    const response: any = await BeseAxios.get(GetCart, {
      params: { username: username },
    });
    if (!response.data.errorPresent) {
      console.log("response @@ GET STORE", response.data.content);
      return response.data.content;
    } else {
      return rejectWithValue(response.data.error);
    }
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const initialState: CartState = {
  cart: {} as Cart,
  error: null,
  status: PageState.IDLE,
  cartItemsIds: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addDataToCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
    clearCart: () => {
      return {
        cart: { cartItems: [] },
        error: null,
        status: PageState.IDLE,
        cartItemsIds: [],
      };
    },
    clearCartItemIds: (state) => ({
      ...state,
      cartItemsIds: [],
    }),
  },
  extraReducers: (builder) => {
    builder
      // Add to cart cases
      .addCase(addToCartAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(
        addToCartAsync.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.status = PageState.SUCCESS;
          state.cart = action.payload;
          state.cartItemsIds = state.cart.cartItems.map((item) => item.itemId);
        }
      )
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        // state.error = action.payload || "Unknown error adding to cart";
        return {
          cart: { cartItems: [] },
          error: null,
          status: PageState.IDLE,
          cartItemsIds: [],
        };
      })

      // Get cart cases
      .addCase(getCartAsync.pending, (state) => {
        state.status = PageState.LOADING;
      })
      .addCase(getCartAsync.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.status = PageState.SUCCESS;
        state.cart = action.payload;
        state.cartItemsIds = state.cart.cartItems.map((item) => item.itemId);
      })
      .addCase(getCartAsync.rejected, (state, action) => {
        state.status = PageState.ERROR;
        state.error = action.payload || "Unknown error fetching cart";
        state.cartItemsIds = [];
      });
  },
});

export const { addDataToCart, clearCart, clearCartItemIds } = cartSlice.actions;

export default cartSlice.reducer;
