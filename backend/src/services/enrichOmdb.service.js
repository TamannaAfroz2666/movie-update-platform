import axios from "axios";
import { tmdbUrlCreat } from "../utils/tmdbUrlCreate.js";

export async function enrichMoviesWithOmdb(items) {
  const tmdb = tmdbUrlCreat();

  const OMDB_BASE_URL = (process.env.OMDB_BASE_URL || "https://www.omdbapi.com/")
    .replace(/\/?$/, "/");

  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  

  if (!OMDB_API_KEY) throw new Error("OMDB_API_KEY missing");

  const LIMIT = Math.min(items.length, 6);
  const head = items.slice(0, LIMIT);

  const tail = items.slice(LIMIT).map((x) => ({
    ...x,
    imdb_id: null,
    imdb_rating: null,
    box_office: null,
    awards: null,
    runtime: null,
  }));

  const enrichedHead = await Promise.all(
    head.map(async (m) => {
      try {
        const ex = await tmdb.get(`/movie/${m.id}/external_ids`);
        const imdbId = ex?.data?.imdb_id;
        if (!imdbId) {
          console.log("SKIP OMDb: imdbId missing for tmdb movie id =", m.id);
          return { ...m, imdb_id: null, imdb_rating: null, box_office: null, awards: null, runtime: null };
        }

        // ✅ 2) OMDb call
        const { data } = await axios.get(OMDB_BASE_URL, {
          params: { i: imdbId, apikey: OMDB_API_KEY },
          timeout: 10000,
        });

        // ✅ 3) OMDb response false handle
        if (data?.Response === "False") {
          console.log("OMDb Response False:", { imdbId, error: data?.Error });
          return { ...m, imdb_id: imdbId, imdb_rating: null, box_office: null, awards: null, runtime: null };
        }

        // ✅ 4) parse rating safely
        const rawRating = data?.imdbRating;
        const imdbRatingNum = Number(rawRating);
        const imdb_rating = Number.isFinite(imdbRatingNum) ? imdbRatingNum : null;

        return {
          ...m,
          imdb_id: imdbId,
          imdb_rating,
          box_office: data?.BoxOffice && data?.BoxOffice !== "N/A" ? data.BoxOffice : null,
          awards: data?.Awards && data?.Awards !== "N/A" ? data.Awards : null,
          runtime: data?.Runtime && data?.Runtime !== "N/A" ? data.Runtime : null,
        };
      } catch (e) {
        console.log("OMDb enrich failed:", {
          tmdbId: m.id,
          msg: e?.message || e,
        });
        return { ...m, imdb_id: null, imdb_rating: null, box_office: null, awards: null, runtime: null };
      }
    })
  );

  return [...enrichedHead, ...tail];
}
