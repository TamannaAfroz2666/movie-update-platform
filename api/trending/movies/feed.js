

import { getTrendingMoviesInfo } from "../../../backend/src/services/movieListService.js";

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve();
        });
    });
}

export default async function handler(req, res) {
 try {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
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



