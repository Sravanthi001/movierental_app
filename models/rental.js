const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5, maxlength: 255 },
      isGold: {
        type: Boolean,
        required: true,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 12
      }
    }),
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
      },
      dailayRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  DateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  DateReturned: {
    type: Date
  },
  Rentalfee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRentals(rental) {
  const schema = {
    customerId: Joi.objectId(), //.required(),
    movieId: Joi.objectId(),
    customername: Joi.string().when("customerId", {
      is: null,
      then: Joi.required()
    }),
    moviename: Joi.string().when("movieId", {
      is: null,
      then: Joi.required()
    })
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRentals;
