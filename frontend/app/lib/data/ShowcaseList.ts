import { TrendingMovie } from "../TrendingMoviesType";

export type ImdbRatingOption = {
    label: string;
    value: string;
};
export type TabKey = "now" | "soon" | "event" | "commingSoon";

export type MovieItem = {
    id: string;
    title: string;
    poster: string;
    trailerUrl?: string;
    rating?: number;
};
type TabState = {
    items: TrendingMovie[];
    loading: boolean;
    error: string | null;
};

type TrendingState = {
    byTab: Record<TabKey, TabState>;
};




export const imdbRatings: ImdbRatingOption[] = [
    { label: "IMDB rating", value: "" },
    // { label: "9+ ", value: "gte_9" },
    { label: "8 – 9  ", value: "8_9" },
    { label: "7 – 8  ", value: "7_8" },
    { label: "6 – 7  ", value: "6_7" },
    { label: "5 – 6  ", value: "5_6" },
    { label: "< 5  ", value: "lt_5" },
];


export function matchImdbRange(
  imdb: number | null | undefined,
  bucket: string
): boolean {
  // default option "IMDB rating" (value="")
  // => no filter, show all
  if (!bucket) return true;

  // filter selected but imdb missing => hide this item
  if (imdb == null || Number.isNaN(imdb)) return false;

//   if (bucket === "gte_9") return imdb >= 9;
  if (bucket === "8_9") return imdb >= 8 && imdb < 9;
  if (bucket === "7_8") return imdb >= 7 && imdb < 8;
  if (bucket === "6_7") return imdb >= 6 && imdb < 7;
  if (bucket === "5_6") return imdb >= 5 && imdb < 6;
  if (bucket === "lt_5") return imdb < 5;

 
  return true;
}

export const dayWeeklySelection: ImdbRatingOption[] = [
    { label: "Select here", value: "" },
    { label: "Today", value: "day" },
    { label: "Week", value: "week" },

];

