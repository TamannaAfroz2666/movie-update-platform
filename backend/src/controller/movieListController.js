import axios from "axios";
import { sendWeeklyMoviesToOne } from "../jobs/sendWeeklyMoviesEmail.js";
import { addMovieUserService, updateMovieUserService, getCommingSoonMoviesInfo, getMoviesInfo, getTopSeriesInfo, getTrendingMoviesInfo, viewMovieUserService } from "../services/movieListService.js";
import { getTvShowServiceInfo } from "../services/tvShow.service.js";
import { makeUnsubscribeToken } from "../utils/UnsubscribeToken.js";

export async function getMovieList(req, res, next) {
  try {
    const data = await getMoviesInfo();

    if (!data) {
      return (res.status(404).json({ success: false, message: 'data is not call in controller' }));
    }
    return res.status(200).json({ success: true, message: 'Movie data view all', data });
  } catch (err) {
    next(err);
  }
}

export async function getTrendingMoviesControllerIs(req, res, next) {
  try {
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 15, 1), 20);

    // for omdb 
    const enrich = String(req.query.enrich || '').toLowerCase();
    const wantOmdb = enrich === 'omdb'

    // cursor parse
    let cursor = null;
    if (req.query.cursor) {
      try {
        cursor = JSON.parse(Buffer.from(String(req.query.cursor), "base64").toString("utf8"));
      } catch (e) {
        cursor = null;
      }
    }

    const result = await getTrendingMoviesInfo({ cursor, pageSize, enrichOmdb: wantOmdb });

    return res.status(200).json({
      success: true,
      items: result.items,
      cursor: result.cursor,     // next cursor object
      nextCursor: result.nextCursor, // base64 encoded
      hasNext: result.hasNext,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTopSeriesDataControllerIs(req, res, next) {
  try {
    const enrich = String(req.query.enrich || '').toLowerCase();
    const wantOmdb = enrich === 'omdb'

    const { data } = await getTopSeriesInfo({ enrichOmdb: wantOmdb });

    if (!data) {
      return (res.status(404).json({ success: false, message: 'data is not call in controller' }));
    }

    return res.status(200).json({
      success: true,
      message: "Top series data",
      data,
    });





  } catch (err) {
    next(err);
  }
}


export async function getCommingSoonControllerIs(req, res, next) {
  try {

    const data = await getCommingSoonMoviesInfo();

    if (!data) {
      return (res.status(404).json({ success: false, message: 'data is not call in controller' }));
    }

    return res.status(200).json({
      success: true,
      message: "Comming soon data",
      data: data.results,
    });
  } catch (err) {
    next(err);
  }
}



export async function getTvShowsControllerIs(req, res, next) {
  try {
    const { type, mode, cursor, pageSize, order } = req.query;
    const enrich = String(req.query.enrich || '').toLowerCase();
    const wantOmdb = enrich === 'omdb'
    const result = await getTvShowServiceInfo({
      type,
      mode,
      cursor,
      pageSize,
      order,
      enrichOmdb: wantOmdb
    });

    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Service returned empty result" });
    }

    return res.status(200).json({
      success: true,
      message: "TV shows data",
      result, // single: { data, meta } | mixed: { items, nextCursor, meta }
    });
  } catch (err) {
    //  If it's a validation error from service, 400 is better
    return next(err);
  }
}





export async function addMovieUserController(req, res, next) {
  try {
    const { email } = req.body;
    // const proto =
    //   req.headers["x-forwarded-proto"] ||
    //   (process.env.NODE_ENV === "production" ? "https" : "http");

    // const baseUrl = `${proto}://${req.get("host")}`;

    // console.log('base url', baseUrl);
    const data = await addMovieUserService(email);
    if (!data) {
      return res.status(404).json({ success: false, message: "Email already exists" });
    }

    const baseUrl =
      process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    // ✅ 2) token
    const token = makeUnsubscribeToken(data.id);

    // ✅ 3) unsubscribe link
    const unsubscribeLink = `${baseUrl}/api/unsubscribe?token=${encodeURIComponent(token)}`;
    console.log('unsubscribeLink', unsubscribeLink)

    try {
      await sendWeeklyMoviesToOne(email, baseUrl, unsubscribeLink);
      return res.status(201).json({ success: true, data, emailSent: true });
    } catch (e) {
      console.error("Instant email failed:", e?.message || e);
      return res.status(201).json({ success: true, data, emailSent: false });
    }


  } catch (err) {
    next(err);
  }
}




export async function updateMovieUserController(req, res, next) {
  try {
    const { id } = req.params;

    const data = await updateMovieUserService(id);

    if (!data?.success) {
      return res.status(404).json({
        success: false,
        message: data?.message ?? "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function viewMovieUserController(req, res, next) {
  try {


    const data = await viewMovieUserService();
    if (!data) {
      return res.status(404).json({ success: false, message: "service failed" });
    }

    //  respond fast
    return res.status(200).json({ success: true, data })




  } catch (err) {
    next(err);
  }
}







