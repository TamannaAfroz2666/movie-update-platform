import axios from "axios";
import { createMovieUserModel, delateProfileByID, findUserByEmail, viewProfile } from "../model/movieListModel.js";
import { enrichMoviesWithOmdb } from "./enrichOmdb.service.js";
import { enrichTvWithOmdb } from "../utils/enRichTvSeriesOmdb.js";



const tmdbUrlCreat = () => {

    const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
    console.log('TMDB_BASE_URL', TMDB_BASE_URL);


    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
    console.log('TMDB_ACCESS_TOKEN', TMDB_ACCESS_TOKEN);


    return axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            accept: 'application/json'
        },
        timeout: 10000,

    })
}
export async function getMoviesInfo() {
    try {

        const client = tmdbUrlCreat();

        // console.log("TMDB_BASE_URL:", process.env.TMDB_BASE_URL);
        // console.log("TMDB_ACCESS_TOKEN exists:", Boolean(process.env.TMDB_ACCESS_TOKEN));
        const { data } = await client.get('/movie/top_rated');

        if (!data) {
            console.log('data can not find from model')
        }
        return data;

    } catch (err) {
        console.log('data not add in service ', err)
    }
}

export async function getCommingSoonMoviesInfo() {
    try {

        const client = tmdbUrlCreat();

        const { data } = await client.get('/movie/upcoming');

        if (!data) {
            console.log('data can not find from model')
        }
        return data;

    } catch (err) {
        console.log('data not add in service ', err)
    }
}


export async function getTrendingMoviesInfo({ cursor, pageSize = 15, enrichOmdb = false }) {
    const client = tmdbUrlCreat();

    // default cursor
    const window = cursor?.window === "week" ? "week" : "day";
    const page = Math.max(cursor?.page || 1, 1);

    const response = await client.get(`/trending/movie/${window}`, {
        params: { page },
    });

    const results = response?.data?.results ?? [];
    const totalPages = response?.data?.total_pages ?? 0;

    // ✅ only take pageSize items (TMDB returns 20, we slice 6)
    let items = results.slice(0, pageSize);

      if (enrichOmdb) {
    items = await enrichMoviesWithOmdb(items); // ✅ returns enriched array
  }

    // ✅ determine next cursor
    let next = null;
    let hasNext = false;

    if (page < totalPages) {
        // same window next page
        next = { window, page: page + 1 };
        hasNext = true;
    } else if (window === "day") {
        // day শেষ → week শুরু
        next = { window: "week", page: 1 };
        hasNext = true;
    } else {
        // week শেষ
        next = null;
        hasNext = false;
    }

    const nextCursor = next ? Buffer.from(JSON.stringify(next)).toString("base64") : null;

    return {
        items,
        cursor: next,
        nextCursor,
        hasNext,
        meta: {
            window,
            page,
            pageSize,
            total_pages: totalPages,
            fetched_at: new Date().toISOString(),
        },
    };
}


export async function getTopSeriesInfo({enrichOmdb= false} = {}) {
    try {

        const client = tmdbUrlCreat();


        const { data } = await client.get('/tv/top_rated');

       if (!data?.results) {
      console.log('data can not find from TMDB');
      return { data: [], meta: { total: 0 } };
    }

    // 2️⃣ results extract
    let items = data.results; // let because later reassign হতে পারে

    // 3️⃣ ✅ OMDb enrich (only when requested)
    if (enrichOmdb) {
      items = await enrichTvWithOmdb(items);
    }

    // 4️⃣ final response
    return {
      data: items,
      meta: {
        fetched_at: new Date().toISOString(),
        total: items.length,
        enriched: enrichOmdb, // debug / clarity
      },
    };

    } catch (err) {
        console.log('data not add in service ', err)
    }
}




export async function addMovieUserService(email) {
    try {
        console.log('email', email)
        const isEmail = await findUserByEmail(email)
        if (isEmail) {
            throw new Error("Email already exists");
        }
        const data = await createMovieUserModel(email);
        if (!data) {
            console.log('data can not find from model')
        }
        return data;

    } catch (err) {
        console.log('data not add in service ', err)
    }
}

export async function deleteMovieUserService(id) {
    try {
        console.log('id', id)

        const data = await delateProfileByID(id);

        return data;
    } catch (err) {
        console.log('data not add in service ', err)
    }
}
export async function viewMovieUserService() {
    try {


        const data = await viewProfile();
        if (!data) {
            console.log('data can not find from model')
        }
        return data;
    } catch (err) {
        console.log('data not add in service ', err)
    }
}  

///

