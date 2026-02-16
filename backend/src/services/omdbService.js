import axios from "axios";
function parseImdbRating(raw) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null; // "N/A" -> null, "8.5" -> 8.5, "0" -> 0
}
export async function getOmdbByImdbService(imdbId) {
  const baseURL = process.env.OMDB_BASE_URL;
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) throw new Error("OMDB_API_KEY missing");

  const { data } = await axios.get(baseURL, {
    params: {
      i: imdbId,
      apikey: apiKey,
    },
  });

  if (data?.Response === "False") {
    const err = new Error(data?.Error || "OMDb error");
    err.status = 404;
    throw err;
  }

  // 🔥 only return what you need
  return {
    imdbId: data.imdbID,
    // imdbRating: Number(data.imdbRating) || null,
    imdbRating: parseImdbRating(data.imdbRating),
    boxOffice: data.BoxOffice || null,
    awards: data.Awards || null,
    runtime: data.Runtime || null,
  };
}