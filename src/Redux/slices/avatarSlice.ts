import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AvatarState {
  avatarUrl: string | null;
  isCleared: boolean;
}

const initialState: AvatarState = {
  avatarUrl: null,
  isCleared: false,
};

const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setAvatarUrl: (state, action: PayloadAction<string | null>) => {
      state.avatarUrl = action.payload;
      state.isCleared = false;
    },
    clearAvatar: (state) => {
      state.isCleared = true;
      state.avatarUrl = null;
    },
  },
});

export const { setAvatarUrl, clearAvatar } = avatarSlice.actions;
export default avatarSlice.reducer;
