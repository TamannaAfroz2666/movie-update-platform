import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "@/app/api/apiConfigs";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";

// ✅ series item type (adjust fields if you have your own)
export type TopSeriesItem = {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  first_air_date?: string;
};

type TopSeriesApiResponse = {
  success: boolean;
  message: string;
  result: { data: TopSeriesItem[] };
};

export const getShowThunk = createAsyncThunk<
  TopSeriesItem[],          // ✅ payload array
  void,
  { rejectValue: string }
>("trendingseries/get", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<TopSeriesApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTopSeries}`
    );
    return res.data.result.data; // ✅ only array
  } catch (e) {
    return rejectWithValue("Network error");
  }
});
