/**
 * @module
 * @description adds the signin route handler
 */
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const User = require("../../schemas/user");
const hashPassword = require("../../utils/hashPassword");

/**
 * @method
 * @description checks if a user with given credentials exist in the database
 * @param {Object} credentials an object containing email and password
 * @param {string} credentials.email email
 * @param {string} credentials.password password
 * @returns
 * - if user exists, returns user object.
 * - if not, returns null
 */
const checkUserCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email, password: hashPassword(password) });
  return user;
};

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post(
  "/",
  /**
   * @callback signinRequestHandler
   * @description validates request data and sends
   * - 400 if data is invalid
   * - 401 wrong id or password
   * - 200 along with user object if data is correct and user does exist
   */
  async (req, res) => {
    const validation = userSchema.validate(req.body);
    if (validation.error) {
      return res
        .status(400)
        .send({ error: true, message: validation.error.message });
    }

    //check if user alreeady exists
    const user = await checkUserCredentials(req.body);
    if (!user)
      return res
        .status(401)
        .send({ error: true, message: "Wrong email or password" });
    user.password = undefined;
    const token = user.generateAuthToken();
    res
      .set({ "x-auth-token": token })
      .status(200)
      .send({ error: false, message: "User login successful", data: user });
  }
);

module.exports = router;
