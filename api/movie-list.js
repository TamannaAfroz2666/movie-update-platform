import { getMoviesInfo } from "../backend/src/services/movieListService.js";

export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }
        const data = await getMoviesInfo();

        if (!data) {
            console.log('there have something happen in controller');
            return (res.status(404).json({ success: false, message: 'data is not call in controller' }));
        }
        return res.status(200).json({ success: true, message: 'Movie data view all', data });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}