import { createAsyncThunk } from "@reduxjs/toolkit";
import {  TrendingResponse, TrendingWindow } from "../lib/TrendingMoviesType";
import { API_BASE_URL } from "../api/apiConfigs";
import { API_ENDPOINTS } from "../api/apiEndpoints";

type GetTrendingArgs = {
  window?: TrendingWindow; // default "day"
  pageSize?: number;       // default 6 first time
  cursor?: string | null;
};

export const getTrendingMovies = createAsyncThunk<
  TrendingResponse,
  GetTrendingArgs | void,
  { rejectValue: string }
>("trending/get", async (args, { rejectWithValue }) => {
  try {
    const pageSize = args?.pageSize ?? 6;
    const cursor = args?.cursor ?? null;

    const url = new URL(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.trendingMovies}`);
    url.searchParams.set("pageSize", String(pageSize));
    if (cursor) url.searchParams.set("cursor", cursor);

    // ✅ DEBUG

    const res = await fetch(url.toString(), {
      // ✅ if token needed, add it
      // headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text();
   

    let json: any = {};
    try { json = JSON.parse(text); } catch {}

    if (!res.ok) {
      return rejectWithValue(json?.message || "Failed to load trending movies");
    }

    // ✅ Map backend feed shape -> frontend
    return {
      items: json.items ?? [],
      meta: {
        ...(json.meta ?? {}),
        hasNext: Boolean(json.hasNext),
        pageSize,
      },
      cursor: json.nextCursor ?? null, // ✅ store nextCursor as cursor for next call
    } as any;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Network error");
  }
});

