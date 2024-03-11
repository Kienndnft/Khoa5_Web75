import express from 'express';
import { asyncCatch } from '../utils/trycatch.js';
import { createMovie, deleteMovieId, getMovies, updateMovieId } from '../service/movie.service.js';
import { authen } from '../utils/authen.js';
// import { getAllUsers, getMe } from '../service/user.service.js';
// import { authen } from '../utils/authen.js';
// import { author } from '../utils/author.js';

const movieController = express.Router();

//movieController.get('/', asyncCatch(authen), asyncCatch(getMovies));
movieController.get('/', asyncCatch(getMovies));
movieController.post('/', asyncCatch(createMovie));
movieController.put('/:movieId', asyncCatch(updateMovieId));
movieController.delete('/:movieId', asyncCatch(deleteMovieId));

export { movieController };
