import { TrendingTvShowState } from "@/app/lib/TrendingMoviesType";
import { createSlice } from "@reduxjs/toolkit";
import { getShowThunk } from "../Thunk/trendingShow.thunk";

const initialState: TrendingTvShowState = {
    result: [],
    loading: false,
    error: null,
}
const trendingCoomingSoonSlice = createSlice({
    name: 'tvShow',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
  .addCase(getShowThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getShowThunk.fulfilled, (state, action) => {
    state.loading = false;
    state.result = action.payload.result.data;   // ✅ array
    // state.meta = action.payload.result.meta;  // optional
  })
  .addCase(getShowThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error?.message ?? "Failed";
  });
    }
})

export default trendingCoomingSoonSlice.reducer;