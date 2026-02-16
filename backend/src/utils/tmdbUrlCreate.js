import axios from "axios";

export  function tmdbUrlCreat() {

    const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
    console.log('TMDB_BASE_URL', TMDB_BASE_URL);


    const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
    console.log('TMDB_ACCESS_TOKEN', TMDB_ACCESS_TOKEN);


    return axios.create({
        baseURL: TMDB_BASE_URL,
        headers: {
            Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
            accept: 'application/json'
        },
        timeout: 10000,

    })
}