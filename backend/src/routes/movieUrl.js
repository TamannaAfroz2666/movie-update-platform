import express from "express";
import { addMovieUserController, deleteMovieUserController, getCommingSoonControllerIs, 
    getMovieList, getTopSeriesDataControllerIs, getTrendingMoviesControllerIs,
     getTvShowsControllerIs, viewMovieUserController } from "../controller/movieListController.js";
import { handleValidation, validateRegistration } from "../validator/authValidator.js";

import { Router } from "express";
import { getOmdbByImdbController } from "../controller/omdbController.js";
const router = Router();


router.get('/movie-list', getMovieList ); //done

router.post('/movie-user',validateRegistration, handleValidation, addMovieUserController); //done
router.delete('/movie-user/:id', deleteMovieUserController) //done
router.get('/movie-user', viewMovieUserController); //pro

// trending movies api route 

router.get('/trending/movies/feed', getTrendingMoviesControllerIs); //done
router.get('/top-series', getTopSeriesDataControllerIs); //  done
router.get('/tv-shows', getTvShowsControllerIs); //done
router.get('/comming-soon', getCommingSoonControllerIs); //done
//search and filter api
router.get("/omdb/by-imdb", getOmdbByImdbController);  //done



export default router;