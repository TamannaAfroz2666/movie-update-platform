import axios from "axios";
import { tmdbUrlCreat } from "./tmdbUrlCreate.js";

export async function enrichTvWithOmdb(items) {
  const tmdb = tmdbUrlCreat();
  const OMDB_API_KEY = process.env.OMDB_API_KEY;
  const OMDB_BASE_URL = process.env.OMDB_BASE_URL || "https://www.omdbapi.com";

  // 🔥 rate limit safe
  const LIMIT = Math.min(items.length, 6);

  const head = items.slice(0, LIMIT);
  const tail = items.slice(LIMIT).map((x) => ({
    ...x,
    imdb_id: null,
    imdb_rating: null,
  }));

  const enrichedHead = await Promise.all(
    head.map(async (tv) => {
      try {
        // 1️⃣ TMDB → external ids
        const ex = await tmdb.get(`/tv/${tv.id}/external_ids`);
        const imdbId = ex?.data?.imdb_id;

        if (!imdbId) {
          return { ...tv, imdb_id: null, imdb_rating: null };
        }

        // 2️⃣ OMDb → imdb details
        const { data } = await axios.get(OMDB_BASE_URL, {
          params: { i: imdbId, apikey: OMDB_API_KEY },
        });

        return {
          ...tv,
          imdb_id: imdbId,
          imdb_rating: data?.imdbRating
            ? Number(data.imdbRating)
            : null,
          box_office: data?.BoxOffice || null,
        };
      } catch {
        return { ...tv, imdb_id: null, imdb_rating: null };
      }
    })
  );

  return [...enrichedHead, ...tail];
}
