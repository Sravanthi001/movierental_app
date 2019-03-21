const _ = require("lodash");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Username / password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Invalid Username / password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const Schema = {
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

module.exports = router;
