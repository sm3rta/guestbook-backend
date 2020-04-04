const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");

const messagesRoute = require("./index");
const usersRoute = require("../users");
const repliesRoute = require("../replies");
const app = express();
app.use(bodyParser.json());
app.use("/messages", messagesRoute);
app.use("/users", usersRoute);
app.use("/replies", repliesRoute);

describe("Test post /replies route", () => {
  //create an account to post a message with
  let userId;
  let messageId;
  beforeAll(async () => {
    //add a test user
    const user = User({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const savedUser = await user.save();
    userId = savedUser._id;

    //add message with that ID
    const message = Message({
      content: "Congratulations",
      submittedBy: userId,
    });
    const savedMessage = await message.save();
    console.log("savedMessage", savedMessage);
    messageId = savedMessage._id;
    console.log("messageId", messageId);
  });

  test("It should return 400 if message content is missing", async (done) => {
    request(app)
      .post("/replies")
      .send({
        content: "",
        submittedBy: userId,
        messageId: messageId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test("It should return 400 if message ID doesn't exist", async (done) => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        submittedBy: userId,
        messageId: "222222222222222222222222",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });

  test("It should return 400 if user ID doesn't exist", async (done) => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        submittedBy: "222222222222222222222222",
        messageId: messageId,
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        done();
      });
  });
  //correct data
  test("It should return 200 for correct data", async (done) => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        submittedBy: userId,
        messageId: messageId,
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
  afterAll(async () => {
    await removeAllCollections();
  });
});
