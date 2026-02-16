import { getTvShowServiceInfo } from "../backend/src/services/tvShow.service.js";


export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }
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
              result, 
            });
    } catch (err) {
        next(err);
    }
}



