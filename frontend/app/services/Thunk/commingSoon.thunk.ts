import { API_BASE_URL } from "@/app/api/apiConfigs";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { TrendingCommingSoonItems } from "@/app/lib/TrendingMoviesType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type CommingSoonApi = {
    data: TrendingCommingSoonItems[];

};
type CommingSoonApiRespose = {
    success: boolean,
    message: string,
    data: TrendingCommingSoonItems[];

};
export const getCommingSoonMoviesThunk = createAsyncThunk<
    CommingSoonApi,
    void,
    { rejectValue: string }
>("trendingComming/get", async (_, { rejectWithValue }) => {
    try {

        const res = await axios.get<CommingSoonApiRespose>(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingCommingSoon}`)
        const data = res.data;
        return data;


    } catch (e: any) {
        return rejectWithValue(e?.message || "Network error");
    }
});