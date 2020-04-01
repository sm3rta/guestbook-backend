const express = require("express");
const router = express.Router();
const User = require("../../schemas/user");

router.get("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  const user = new User({ name, username });
  const result = await user.save();
  res.status(200).send({ message: "User added successfully" });
});

module.exports = router;
