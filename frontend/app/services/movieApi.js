
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {API_BASE_URL} from '../api/apiConfigs'
import { API_ENDPOINTS } from "../api/apiEndpoints";



export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getMovieList: builder.query({
      query: () => API_ENDPOINTS.MOVIE.trendingMovies,
    }),
  }),
});

export const { useGetMovieListQuery } = movieApi;
