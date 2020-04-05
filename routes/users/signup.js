/**
 * @module
 * @description adds the signup route handler
 */
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const User = require("../../schemas/user");
const hashPassword = require("../../utils/hashPassword");

/**
 * @method
 * @description checks if a user with the same email exists in the database
 * @param {string} email email to check if exists
 * @returns
 * - true if a user with the same email exists
 * - false if otherwise
 */
const checkUserExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z1-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}/
      )
    )
    .required(),
});

router.post(
  "/",
  /**
   * @callback signupRequestHandler
   * @description validates request data and sends
   * - 400 if data is invalid
   * - 409 wrong id or password
   * - 200 along with user object if data is correct and signup process
   * is successful
   */
  async (req, res) => {
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
      return res.status(409).send({
        error: true,
        message: "An account with the same email already exists",
      });

    //all is well, create user document and add it to the database
    const user = new User({ name, email, password: hashPassword(password) });
    const savedUser = await user.save();
    //delete password from object
    savedUser.password = undefined;
    const token = user.generateAuthToken();
    res.set({ "x-auth-token": token }).status(200).send({
      error: false,
      message: "User added successfully",
      data: savedUser,
    });
  }
);

module.exports = router;
