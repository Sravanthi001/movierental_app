const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
      trim: true
    }
  })
);

function validateUser(user) {
  const Schema = {
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };
  return Joi.validate(user, Schema);
}

exports.User = User;
exports.validate = validateUser;
