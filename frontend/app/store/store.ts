import { configureStore } from "@reduxjs/toolkit";
import { movieApi } from "../services/movieApi";
import movieUserReducer from "./movieUser.reducer";
import trendingReducer from "../services/Slice/trending.slice";
import trendingTopSeries from "../services/Slice/topSeries.slice";
import trendingCommingSoonMovies from "../services/Slice/commingSoon.slice";
import combinedTrendingApis from "../services/Slice/combineApi.slice";


import trendingTvShowMovies from "../services/Slice/trendingShow.slice";
export const store = configureStore({
  reducer: {
    [movieApi.reducerPath]: movieApi.reducer,
    movieUser: movieUserReducer,
    trending: trendingReducer,
    topSeries: trendingTopSeries,
    commingsoon: trendingCommingSoonMovies,
     tvShow: trendingTvShowMovies, 
     combinedTrending: combinedTrendingApis
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
