import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../api/apiEndpoints";
import { API_BASE_URL } from "../api/apiConfigs";
import { TrendingMovie } from "../lib/TrendingMoviesType";


type MovieUser = {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

type MovieUserState = {
  loading: boolean;
  error: string | null;
  lastAdded: MovieUser | null;
};


type TrendingMovieState = {
  day: TrendingMovie[];
  week: TrendingMovie[];

  loading: boolean;
  error: string | null;
};

const initialState: MovieUserState = {
  loading: false,
  error: null,
  lastAdded: null,
};

/**
 * ✅ Thunk (POST)
 */
export const addMovieUser = createAsyncThunk<
  MovieUser,          // return type (fulfilled)
  string,             // argument type (email)
  { rejectValue: string } // reject value type
>("movieUser/add", async (email, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.MOVIE.addUser}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return rejectWithValue(data?.message || "Failed to add user");
    }

    // expecting backend: { success, message, data }
    return data?.data as MovieUser;
  } catch (e: any) {
    return rejectWithValue(e?.message || "Network error");
  }
});



/**
 * ✅ Slice (Reducer)
 */
const movieUserSlice = createSlice({
  name: "movieUser",
  initialState,
  reducers: {
    clearMovieUserStatus: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMovieUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMovieUser.fulfilled, (state, action) => {
        state.loading = false;
        state.lastAdded = action.payload;
      })
      .addCase(addMovieUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed";
      });
  },
});

export const { clearMovieUserStatus } = movieUserSlice.actions;
export default movieUserSlice.reducer;
