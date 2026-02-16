import { getOmdbByImdbService } from "../services/omdbService.js";

export async function getOmdbByImdbController(req, res, next) {
  try {
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