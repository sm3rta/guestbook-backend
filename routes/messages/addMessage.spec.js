const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
require("../../utils/connectToDatabase")();
const messagesRoute = require("./index");
const usersRoute = require("../users");
const app = express();
app.use(bodyParser.json());
app.use("/messages", messagesRoute);
app.use("/users", usersRoute);

describe("Test post /messages route", () => {
  //create an account to post a message with

  let token;
  beforeAll(async () => {
    const user = User({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    savedUser = await user.save();
    token = savedUser.generateAuthToken();
  });

  //user ID that doesn't exist
  test("It should return 401 if token is bad", async () => {
    request(app)
      .post("/messages")
      .send({
        content: "Congratulations!",
      })
      .set({ "x-auth-token": "22222" })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  //short or empty content
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/messages")
      .send({
        content: "",
      })
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  //correct data
  test("It should return 200 for correct data", async () => {
    request(app)
      .post("/messages")
      .send({
        content: "Congratulations!",
      })
      .set({ "x-auth-token": token })
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
