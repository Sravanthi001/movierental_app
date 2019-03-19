const Joi = require("joi");
const mongoose = require("mongoose");
const GenreSchema = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },

    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255
    },
    genre: { type: GenreSchema, required: true }
  })
);

function validateMovie(movie) {
  const Schema = {
    title: Joi.string()
      .min(3)
      .max(30)
      .required(),
    numberInStock: Joi.number()
      .min(0)
      .max(30)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(30)
      .required(),
    genreId: Joi.objectId().required()
  };
  return Joi.validate(movie, Schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
