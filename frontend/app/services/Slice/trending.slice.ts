import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTrendingMovies } from "../trending.reducer";
import { TrendingMovie, TrendingMovieState, TrendingWindow } from "@/app/lib/TrendingMoviesType";


const initialState: TrendingMovieState = {
  items: [],
  window: "day",
  cursor: null,
  hasMore: true,
  loading: false,
  error: null,
};

const dedupeById = (arr: TrendingMovie[]) => {
  const m = new Map<number, TrendingMovie>();
  for (const x of arr) m.set(x.id, x);
  return Array.from(m.values());
};

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    resetTrending(state) {
      state.items = [];
      state.window = "day";
      state.cursor = null;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
    setWindow(state, action: PayloadAction<TrendingWindow>) {
      state.window = action.payload;
      state.cursor = null;     // ✅ new window start
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;

        const incoming = (action.payload as any).items ?? [];
        state.items = dedupeById([...state.items, ...incoming]);

        state.cursor = (action.payload as any).cursor; // ✅ nextCursor saved
        state.hasMore = Boolean((action.payload as any).meta?.hasNext);
      })
      .addCase(getTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed";
      });
  },
});


export const { resetTrending, setWindow } = trendingSlice.actions;
export default trendingSlice.reducer;
