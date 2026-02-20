import express from "express";
import { addMovieUserController, deleteMovieUserController, getCommingSoonControllerIs, 
    getMovieList, getTopSeriesDataControllerIs, getTrendingMoviesControllerIs,
     getTvShowsControllerIs, viewMovieUserController } from "../controller/movieListController.js";
import { handleValidation, validateRegistration } from "../validator/authValidator.js";

import { Router } from "express";
import { getOmdbByImdbController } from "../controller/omdbController.js";
const router = Router();


router.get('/movie-list', getMovieList ); 

router.post('/movie-user',validateRegistration, handleValidation, addMovieUserController); 
router.delete('/movie-user/:id', deleteMovieUserController) 
router.get('/movie-user', viewMovieUserController); 

// trending movies api route 

router.get('/trending/movies/feed', getTrendingMoviesControllerIs); 
router.get('/top-series', getTopSeriesDataControllerIs); 
router.get('/tv-shows', getTvShowsControllerIs); 
router.get('/comming-soon', getCommingSoonControllerIs); 
//search and filter api
router.get("/omdb/by-imdb", getOmdbByImdbController);  



export default router;