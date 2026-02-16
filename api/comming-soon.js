import { getCommingSoonMoviesInfo } from "../backend/src/services/movieListService.js";



export default async function handler(req, res) {
 try {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
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



