import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../api/apiConfigs";
import { API_ENDPOINTS } from "../../api/apiEndpoints";
import { TrendingTopSeries } from "@/app/lib/TrendingMoviesType";
import axios from "axios";

type TvSeriesApiData ={
  page: number;
  results: TrendingTopSeries[];
  total_pages: number;
  total_results: number;
}
type TvSeriesApiRespose = {
  success: boolean;
  message: string;
  data: TvSeriesApiData;

}

export const getSeriesThunk = createAsyncThunk<
  TvSeriesApiData,
  void,
  { rejectValue: string }
>("trendingseries/get", async (_, { rejectWithValue }) => {
  try {
    
    const res = await axios.get<TvSeriesApiRespose> (`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTopSeries}`) 
    const data = res.data.data;
    console.log('trendingTopSeries', data)
 
      return {
        results: data,            // ✅ slice expects results
        page: 1,                  // ✅ backend pagination নাই তাই fixed
        total_pages: 1,
        // total_results: data.length,
      };
  
    
  } catch (e: any) {
    return rejectWithValue(e?.message || "Network error");
  }
});

