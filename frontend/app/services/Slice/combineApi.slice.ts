import { CombinedItem } from "@/app/lib/TrendingMoviesType";
import { createSlice } from "@reduxjs/toolkit";
import { getTrendingCombinedThunk } from "../Thunk/combineApi.thunk";

type CombinedState = {
  items: CombinedItem[];
  loading: boolean;
  error: string | null;
};

const combinedSlice = createSlice({
  name: "combinedTrending",
  initialState: { items: [], loading: false, error: null } as CombinedState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingCombinedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingCombinedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTrendingCombinedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed";
      });
  },
});

export default combinedSlice.reducer;
