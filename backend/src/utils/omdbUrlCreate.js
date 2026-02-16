import axios from "axios";

/**
 * Purpose: OMDb base client
 * Note: OMDb bearer header use kore na — apikey query param diye dite hoy
 */
export function omdbClient() {
  const baseURL = process.env.OMDB_BASE_URL || "https://www.omdbapi.com";
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) throw new Error("OMDB_API_KEY missing");

  return axios.create({
    baseURL,
    timeout: 10000,
  });
}
