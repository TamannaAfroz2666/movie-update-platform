import { API_BASE_URL } from "@/app/api/apiConfigs";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { TrendingTvShowItems, TrendingTvShowState } from "@/app/lib/TrendingMoviesType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type trendingShowApiCall = {
    result: {
        data: TrendingTvShowItems[];
        meta: any;
    };
}
type trendingShowApiResponse = {
    success: boolean,
    message: string,
    result: {
        data: TrendingTvShowItems[];
        meta: any;
    };
}

export const getShowThunk = createAsyncThunk<
    trendingShowApiCall,
    void,
    { rejectValue: string }
>("trendingTvShows/get", async (_, { rejectWithValue }) => {
    try {

        const res = await axios.get<trendingShowApiResponse>(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTvShow}`)
        const data = res.data.result.data;
        return data;


    } catch (e: any) {
        return rejectWithValue(e?.message || "Network error");
    }
});