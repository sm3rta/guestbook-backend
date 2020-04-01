const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const User = require("../../schemas/user");
const hashPassword = require("../../utils/hashPassword");

const checkUserExists = async email => {
  const user = await User.findOne({ email });
  return !!user;
};

const userSchema = Joi.object({
  email: Joi.string().email(),
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});

router.post("/", async (req, res) => {
  const validation = userSchema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ error: true, message: validation.error.message });
  }

  const { name, email, password } = req.body;

  //check if user alreeady exists
  const userExists = await checkUserExists(email);

  if (userExists)
    return res
      .status(409)
      .send({ error: true, message: "User already exists" });

  //all is well, create user document and add it to the database
  const user = new User({ name, email, password: hashPassword(password) });
  const result = await user.save();
  res.status(200).send({ error: false, message: "User added successfully" });
});

module.exports = router;