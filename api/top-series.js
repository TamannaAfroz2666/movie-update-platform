import { getTopSeriesInfo } from "../backend/src/services/movieListService.js";


export default async function handler(req, res) {
 try {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
      const enrich = String(req.query.enrich || '').toLowerCase();
      const wantOmdb = enrich === 'omdb'
  
      const { data } = await getTopSeriesInfo({ enrichOmdb: wantOmdb });
  
      if (!data) {
        console.log('there have something happen in controller');
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



