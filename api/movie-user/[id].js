import { deleteMovieUserService } from "../../backend/src/services/movieListService.js";

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
        if (req.method !== 'DELETE') {
            return res.status(405).json({ success: false, message: 'Method Not Allowed' });
        }

        const { id } = req.params;
        console.log(" email from body:", id);

        const data = await deleteMovieUserService(id);
        if (!data?.success) {
            return res.status(404).json({ success: false, message: data?.message ?? "User not found" });
        }

        return res.status(200).json({ success: true, message: "This profile successfully deleted" });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}