import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../api/apiConfigs";
import { API_ENDPOINTS } from "../../api/apiEndpoints";
import { TrendingTopSeries } from "@/app/lib/TrendingMoviesType";
import axios from "axios";

type TvSeriesApiData = {
  page: number;
  results: TrendingTopSeries[];
  total_pages: number;
  total_results: number;
}
type TvSeriesApiRespose = {
  success: boolean;
  message: string;
  data: TvSeriesApiData[];

}



type TopSeriesApiResponse = {
  success: boolean;
  message: string;
  data: TrendingTopSeries[];
};

export const getSeriesThunk = createAsyncThunk<
  TrendingTopSeries[],   
  void,
  { rejectValue: string }
>("trendingseries/get", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<TopSeriesApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTopSeries}`
    );

    return res.data.data;  
  } catch (e: any) {
    return rejectWithValue(e?.message ?? "Network error");
  }
});

