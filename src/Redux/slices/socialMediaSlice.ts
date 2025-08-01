import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SmediaHandle } from '../../sections/footer/model/smediaHandle';
import { GetSocialmediaData } from '../../sections/footer/footerService/footerService';
import { BeseAxios } from '../../web-constants/constants';

export const fetchSocialMediaData = createAsyncThunk(
  'socialMedia/fetch',
  async () => {
    const response:any = await BeseAxios.get<SmediaHandle[]>(GetSocialmediaData);
    return response.data.content;
  }
);

interface SocialMediaState {
  data: SmediaHandle[];
  loading: boolean;
  error: string | null;
}

const initialState: SocialMediaState = {
  data: [],
  loading: false,
  error: null,
};

const socialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSocialMediaData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialMediaData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchSocialMediaData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch social media data';
      });
  },
});

export default socialMediaSlice.reducer;
