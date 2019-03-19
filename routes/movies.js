const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/Movie");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    {
      new: true
    }
  );

  if (!movie)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  let movie;
  if (mongoose.Types.ObjectId.isValid(req.param.id)) {
    movie = await Movie.findById(req.params.id);
  } else {
    movie = await Movie.find({ title: req.params.id });
  }

  if (!movie)
    return res
      .status(404)
      .send("The movie with the given ID/title was not found.");

  res.send(movie);
});

// router.get("/:title", async (req, res) => {
//   const movie = await Movie.find({ title: req.params.title });

//   if (!movie)
//     return res.status(404).send("The movie with the given name was not found.");

//   res.send(movie);
// });

module.exports = router;