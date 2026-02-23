import express from "express";
import { addMovieUserController, updateMovieUserController, getCommingSoonControllerIs, 
    getMovieList, getTopSeriesDataControllerIs, getTrendingMoviesControllerIs,
     getTvShowsControllerIs, viewMovieUserController } from "../controller/movieListController.js";
import { handleValidation, validateRegistration } from "../validator/authValidator.js";

import { Router } from "express";
import { getOmdbByImdbController } from "../controller/omdbController.js";
import { unsubscribeActionController, unsubscribePageController } from "../controller/unSubscribe.controller.js";
const router = Router();


router.get('/movie-list', getMovieList ); 
router.post('/movie-user',validateRegistration, handleValidation, addMovieUserController); 
router.get('/movie-user', viewMovieUserController); 

// trending movies api route 

router.get('/trending/movies/feed', getTrendingMoviesControllerIs); 
router.get('/top-series', getTopSeriesDataControllerIs); 
router.get('/tv-shows', getTvShowsControllerIs); 
router.get('/comming-soon', getCommingSoonControllerIs); 
//search and filter api
router.get("/omdb/by-imdb", getOmdbByImdbController);  

// unsubscribe route 
router.get("/unsubscribe", unsubscribePageController); 
router.post("/unsubscribe", unsubscribeActionController);
router.put('/movie-user/:id', updateMovieUserController)

export default router;