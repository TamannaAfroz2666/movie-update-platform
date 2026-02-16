import { topSeriesState, } from "@/app/lib/TrendingMoviesType";
import { createSlice } from "@reduxjs/toolkit";
import { getSeriesThunk } from "../Thunk/topSeries.thunk";

const initialState: topSeriesState = {
    results: [],
    page: 0,
    total_pages: 0,
    total_results: 0,
    loading: false,
    error: null

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
                state.results = action.payload.results;
                state.page = action.payload.page;
                state.total_pages = action.payload.total_pages;
                state.total_results = action.payload.total_results;

            })
            .addCase(getSeriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed";
            });
    },
});

export default trendingSeriesSlice.reducer;