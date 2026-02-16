import { getOmdbByImdbService } from "../../backend/src/services/omdbService.js";

export async function getOmdbByImdbController(req, res, next) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
    const imdbId = String(req.query.imdbId || "").trim();

    if (!imdbId) {
      return res.status(400).json({
        success: false,
        message: "imdbId query is required",
      });
    }

    const data = await getOmdbByImdbService(imdbId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}