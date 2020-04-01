const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const User = require("../../schemas/user");
const hashPassword = require("../../utils/hashPassword");

const checkUserCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email, password: hashPassword(password) });
  return !!user;
};

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
});

router.post("/", async (req, res) => {
  const validation = userSchema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ error: true, message: validation.error.message });
  }

  //check if user alreeady exists
  const credentialsResult = await checkUserCredentials(req.body);

  if (credentialsResult) {
    res.status(200).send({ error: false, message: "User login successful" });
  } else {
    res.status(401).send({ error: true, message: "Wrong email or password" });
  }
});

module.exports = router;