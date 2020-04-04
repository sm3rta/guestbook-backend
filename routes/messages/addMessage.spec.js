const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const messagesRoute = require("./index");
const usersRoute = require("../users");
const app = express();
app.use(bodyParser.json());
app.use("/messages", messagesRoute);
app.use("/users", usersRoute);

describe("Test post /messages route", () => {
  //create an account to post a message with
  let userId;
  beforeAll(async () => {
    const res = await request(app).post("/users/signup").send({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const user = await User.findOne({ email: "test@example.com" });
    userId = user._id;
  });

  //user ID that doesn't exist
  test("It should return 401 if user doesn't exist", async (done) => {
    request(app)
      .post("/messages/")
      .send({
        content: "Congratulations!",
        submittedBy: "222222222222222222222222",
      })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        done();
      });
  });

  //short or empty content
  test("It should return 400 for malformed data", async (done) => {
    request(app)
      .post("/messages/")
      .send({
        content: "",
        submittedBy: userId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  //correct data
  test("It should return 200 for correct data", async (done) => {
    request(app)
      .post("/messages/")
      .send({
        content: "Congratulations!",
        submittedBy: userId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  async function removeAllCollections() {
    await User.deleteMany({});
    await Reply.deleteMany({});
    await Message.deleteMany({});
  }
  //   afterAll(async () => {
  //     await removeAllCollections();
  //   });
});
