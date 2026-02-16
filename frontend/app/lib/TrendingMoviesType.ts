export type TrendingWindow = "day" | "week";
export type TrendingMeta = {
  window: TrendingWindow;
  pageSize: number;
  returned: number;
  has_more: boolean;          // ✅ backend থেকে দেওয়া best
  tmdb_total_pages?: number | null;
  fetched_at?: string;
};

export type TrendingResponse = {
  data: TrendingMovie[];
  meta: TrendingMeta;
  cursor: string | null;      // ✅ next cursor
};
export type TrendingMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
};

export type TrendingBlock = {
  day: TrendingMovie[];
  week: TrendingMovie[];
};
export type TrendingMovieState = {
  items: TrendingMovie[];          // ✅ merged list (day then week)
  window: TrendingWindow;          // "day" | "week"
  cursor: string | null;           // next cursor
  hasMore: boolean;                // infinite stop condition
  loading: boolean;
  error: string | null;
};


//top series data type start 

export type TrendingTopSeries = {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
}

export type topSeriesState = {
  results: TrendingTopSeries[];
  page: number;
  total_pages: number;
  total_results: number;
  loading: boolean;
  error: string | null;

};
//tv show data type start
export type TrendingTvShowItems = {
  id: number;
  name: string;
  poster_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
}

export type TrendingTvShowState = {
  result: TrendingTvShowItems[];
  loading: boolean;
  error: string | null;

};



//comming soon data type start

export type TrendingCommingSoonItems = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date?: string;
}

export type CommingSoonState = {
  data: TrendingCommingSoonItems[];
  loading: boolean;
  error: string | null;

};

/// combine api type 
export type CombinedItem = {
  id: string;
  kind: "movie" | "series" | "tv";
  title: string;
  poster_path: string | null;
  imdb_rating?: number | null;
  vote_average?: number | null; // fallback

  date?: string | null;
};