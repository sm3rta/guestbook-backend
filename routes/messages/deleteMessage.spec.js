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

describe("Test delete /messages route", () => {
  //create an account to post a message with
  let userId;
  let messageId;
  let token;
  beforeEach(async () => {
    //add a test user
    const user = new User({
      name: "John Doe",
      email: "test@example.com",
      password: "ABCD@abc",
    });
    const savedUser = await user.save();
    token = savedUser.generateAuthToken();
    // get user ID
    userId = savedUser._id;
    //add message with that ID
    await request(app)
      .post("/messages")
      .send({})
      .set({ "x-auth-token": token });
    //find that message
    const message = new Message({
      content: "Congratulations",
      submittedBy: userId,
      replies: [],
    });
    const savedMessage = await message.save();
    //get that message ID
    messageId = savedMessage._id;
  });

  //wrong data
  test("It should return 400 if message doesn't exist", async () => {
    request(app)
      .delete(`/messages/222222222222222222222222`)
      .set({ "x-auth-token": token })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //correct data
  test("It should return 200 for correct data", async () => {
    request(app)
      .delete(`/messages/${messageId}`)
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
