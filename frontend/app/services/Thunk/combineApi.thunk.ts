import { API_BASE_URL } from "@/app/api/apiConfigs";
import { API_ENDPOINTS } from "@/app/api/apiEndpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export type CombinedItem = {
    id: string;
    kind: "movie" | "series" | "tv";
    title: string;
    poster_path: string | null;
    imdb_rating?: number | null;
    vote_average?: number | null;
};

export const getTrendingCombinedThunk = createAsyncThunk<
    CombinedItem[],
    void,
    { rejectValue: string }
>(
    "combinedTrending/get",
    async (_, { rejectWithValue }) => {
        try {
            const [moviesRes, seriesRes, tvRes] = await Promise.all([
                axios.get(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingMovies}`),
                axios.get(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTopSeries}`),
                axios.get(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingTvShow}`),
            ]);

            // normalize responses safely
            const moviesRaw = moviesRes?.data?.items ?? moviesRes?.data?.data ?? [];
            const seriesRaw = seriesRes?.data?.data ?? seriesRes?.data?.items ?? [];
            const tvRaw = tvRes?.data?.data ?? tvRes?.data?.items ?? [];

            const movies: CombinedItem[] = moviesRaw.map((x: any) => ({
                id: String(x.id),
                kind: "movie",
                title: x.title || x.name || "Untitled",
                poster_path: x.poster_path ?? null,
                imdb_rating: x.imdb_rating ?? null,
                vote_average: x.vote_average ?? null,
                date: x.release_date ?? null,
            }));

            const series: CombinedItem[] = seriesRaw.map((x: any) => ({
                id: String(x.id),
                kind: "series",
                title: x.name || x.title || "Untitled",
                poster_path: x.poster_path ?? null,
                imdb_rating: x.imdb_rating ?? null,
                vote_average: x.vote_average ?? null,
                date: x.first_air_date ?? null,
            }));

            const tv: CombinedItem[] = tvRaw.map((x: any) => ({
                id: String(x.id),
                kind: "tv",
                title: x.name || x.title || "Untitled",
                poster_path: x.poster_path ?? null,
                imdb_rating: x.imdb_rating ?? null,
                vote_average: x.vote_average ?? null,
                date: x.first_air_date ?? null,
            }));

            //  final merged list
            return [...movies, ...series, ...tv];

        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load combined trending data";

            return rejectWithValue(message);
        }
    }
);
