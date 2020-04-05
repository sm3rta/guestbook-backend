const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
require("../../utils/connectToDatabase")();
const messagesRoute = require("./index");
const usersRoute = require("../users");
const repliesRoute = require("../replies");
const app = express();
app.use(bodyParser.json());
app.use("/messages", messagesRoute);
app.use("/users", usersRoute);
app.use("/replies", repliesRoute);

describe("Test post /replies route", () => {
  let userId;
  let messageId;
  let token;

  beforeAll(async () => {
    //add a test user
    const user = User({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const savedUser = await user.save();
    userId = savedUser._id;
    token = savedUser.generateAuthToken();
    // add message with that ID
    const message = Message({
      content: "Congratulations",
      submittedBy: userId,
    });
    const savedMessage = await message.save();
    console.log("savedMessage", savedMessage);
    messageId = savedMessage._id;
    console.log("messageId", messageId);
  });

  test("It should return 400 if message content is missing", async () => {
    request(app)
      .post("/replies")
      .send({
        content: "",
        messageId: messageId,
      })
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("It should return 400 if message ID doesn't exist", async () => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        messageId: "222222222222222222222222",
      })
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("It should return 400 if token is bad", async () => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        messageId: messageId,
      })
      .set({ "x-auth-token": "aaaaaaa" })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //correct data
  test("It should return 200 for correct data", async () => {
    request(app)
      .post("/replies")
      .send({
        content: "Congratulations!",
        messageId: messageId,
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
