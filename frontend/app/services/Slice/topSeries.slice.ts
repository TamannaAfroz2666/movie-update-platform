import { topSeriesState, } from "@/app/lib/TrendingMoviesType";
import { createSlice } from "@reduxjs/toolkit";
import { getSeriesThunk } from "../Thunk/topSeries.thunk";
import { TrendingTopSeries } from "@/app/lib/TrendingMoviesType";



type TopSeriesState = {
    results: TrendingTopSeries[];
    loading: boolean;
    error: string | null;
};

const initialState: TopSeriesState = {
    results: [],
    loading: false,
    error: null,
};


const trendingSeriesSlice = createSlice({
    name: "topSeries",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSeriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSeriesThunk.fulfilled, (state, action) => {
                console.log("TOP SERIES PAYLOAD:", action.payload);
                state.loading = false;
                state.results = action.payload;

            })
            .addCase(getSeriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? action.error?.message ?? "Failed";
            });
    },
});

export default trendingSeriesSlice.reducer;