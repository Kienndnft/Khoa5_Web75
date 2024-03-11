import { MovieModel } from '../model/movie.model.js';

//=========================================
export const getMovies = async (req, res, next) => {
  const { query } = req.query;

  const movies = await MovieModel.find({ query });

  res.status(200).send({ data: movies, message: 'Get movies', success: true });
};

//=========================================
export const createMovie = async (req, res) => {
  const { name, time, year, image, introduce } = req.body;
  //const { user } = req;

  //Luu vao co so du lieu
  const newMovie = await MovieModel.create({
    name,
    time,
    year,
    image,
    introduce,
  });

  res.status(201).send({ data: newMovie, message: 'Movie created successfully', success: true });
};

//=========================================
export const updateMovieId = async (req, res) => {
  const { movieId } = req.params;
  const { name, time, year, image, introduce } = req.body;
  //const { user } = req;

  //update movie
  const updateItem = await MovieModel.findByIdAndUpdate(
    movieId,
    { name, time, year, image, introduce },
    { new: true }
  );

  res.status(201).send({ data: updateItem, message: 'Movie updated successfully', success: true });
};

//=========================================
export const deleteMovieId = async (req, res) => {
  const { movieId } = req.params;
  //const { user } = req;

  //delete movie
  await MovieModel.findByIdAndDelete(movieId);

  res.status(204).send('');
};
