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

describe("Test patch /messages route", () => {
  //create an account to post a message with
  let userId;
  let messageId;
  let token;
  beforeEach(async () => {
    //add a test user
    const user = User({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const savedUser = await user.save();
    token = savedUser.generateAuthToken();
    // get user ID
    userId = savedUser._id;
    //add message with that ID
    const message = Message({
      content: "Congratulations",
      submittedBy: userId,
    });
    //find that message
    const savedMessage = await message.save();
    //get that message ID
    messageId = savedMessage._id;
  });

  test("It should return 400 if message content is missing", async () => {
    request(app)
      .patch(`/messages/${messageId}`)
      .send({})
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  test("It should return 400 if message ID doesn't exist", async () => {
    request(app)
      .patch(`/messages/222222222222222222222222`)
      .send({
        content: "Congratulations!",
      })
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //correct data
  test("It should return 200 for correct data", async () => {
    request(app)
      .patch(`/messages/${messageId}`)
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
  afterEach(async () => {
    await removeAllCollections();
  });
});
