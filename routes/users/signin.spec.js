const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
require("../../utils/connectToDatabase")();
const hashPassword = require("../../utils/hashPassword");
const usersRoute = require("./index");
const app = express();
app.use(bodyParser.json());
app.use("/users", usersRoute);

describe("Test post /users route", () => {
  beforeAll(async () => {
    const user = User({
      name: "John Doe",
      email: "test@example.com",
      password: hashPassword("ABCD@abc"),
    });
    const savedUser = await user.save();
  });

  //add user with invalid information
  //invalid email
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signin")
      .send({
        email: "test@example",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  //sign in, should work
  test("It should return 200 for correct data", async () => {
    request(app)
      .post("/users/signin")
      .send({
        email: "test@example.com",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  async function removeAllCollections() {
    await User.deleteMany({});
    await Reply.deleteMany({});
    await Message.deleteMany({});
  }
  afterAll(async () => {
    await removeAllCollections();
  });
});
