// src/api/endpoints.ts

export const API_ENDPOINTS = {
  MOVIE: {
    LIST: "/api/movie-list",
    addUser: "/api/movie-user",
    trendingMovies: "/api/trending/movies/feed?enrich=omdb",
    trendingTopSeries: "/api/top-series?enrich=omdb",
    trendingTvShow: "/api/tv-shows?type=on_the_air&enrich=omdb",
    trendingCommingSoon: "/api/comming-soon",

  },


};
