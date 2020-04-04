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

describe("Test patch /messages route", () => {
  //create an account to post a message with
  let userId;
  let messageId;
  beforeEach(async () => {
    //add a test user
    await request(app).post("/users/signup").send({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const user = await User.findOne({ email: "test@example.com" });
    // get user ID
    userId = user._id;
    //add message with that ID
    await request(app).post("/messages").send({
      content: "Congratulations",
      submittedBy: userId,
    });
    //find that message
    const message = await Message.findOne({ submittedBy: userId });
    //get that message ID
    messageId = message._id;
  });

  test("It should return 400 if message content is missing", async (done) => {
    request(app)
      .patch(`/messages/${messageId}`)
      .send({})
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test("It should return 400 if message ID doesn't exist", async (done) => {
    request(app)
      .patch(`/messages/222222222222222222222222`)
      .send({
        content: "Congratulations!",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  //correct data
  test("It should return 200 for correct data", async (done) => {
    request(app)
      .patch(`/messages/${messageId}`)
      .send({
        content: "Congratulations!",
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
  afterEach(async () => {
    await removeAllCollections();
  });
});
