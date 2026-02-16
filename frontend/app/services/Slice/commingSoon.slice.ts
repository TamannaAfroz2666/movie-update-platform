import { CommingSoonState } from "@/app/lib/TrendingMoviesType";
import { createSlice } from "@reduxjs/toolkit";
import { getCommingSoonMoviesThunk } from "../Thunk/commingSoon.thunk";

const initialState: CommingSoonState = {
    data: [],
    loading: false,
    error: null,
}
const trendingCoomingSoonSlice = createSlice({
    name: 'commingsoon',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCommingSoonMoviesThunk.pending, (state) => {
            state.loading = true;
            state.error = null
        })
            .addCase(getCommingSoonMoviesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data
            })
            .addCase(getCommingSoonMoviesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed'
            })
    }
})

export default trendingCoomingSoonSlice.reducer;