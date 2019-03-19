const { Rental, validate } = require("../models/rental");
const { Genre } = require("../models/genre");
const { Movie } = require("../models/Movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-DateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  let customer, movie;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Valitating customer is is give or name is given
  if (req.body.customerId) {
    console.log("validcustomer id");
    customer = await Customer.findById(req.body.customerId);
  } else {
    console.log("valid customer name");
    customer = await Customer.findOne({ name: req.body.customername });
  }
  if (!customer) return res.status(400).send("Invalide customer id / name");

  // checking movie id or movie name is given to get the record
  if (req.body.movieId) {
    movie = await Movie.findById(req.body.movieId);
  } else {
    console.log("valid movie name");
    movie = await Movie.findOne({ title: req.body.moviename });
  }
  if (!movie) return res.status(400).send("Invalid movie");

  // check it is instock
  if (movie.numberInStock > 0) {
    console.log("==========customer:\n", customer, "\n==================");
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailayRentalRate: movie.dailyRentalRate
      }
    });

    // rental = await rental.save();

    // movie.numberInStock--;
    // movie.save();
    try {
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();

      res.send(rental);
    } catch (ex) {
      res.status(500).send(" Something failed");
    }
  } else {
    res.send("unable to rent the movie. Movie is not in stock");
  }
});

module.exports = router;
