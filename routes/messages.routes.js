const express = require("express");
const {
  getMessages,
  postMessage,
  getMessageById
} = require("../controllers/messages.controller");
const {
  validateMessage,
  validateMessageId
} = require("../middleware/messages.middleware");

const messagesRouter = express.Router();

messagesRouter.get(
  "/",
  getMessages
);

messagesRouter.post(
  "/",
  validateMessage,
  postMessage
);

messagesRouter.get(
  "/:messageId",
  validateMessageId,
  getMessageById
);

module.exports = {
  messagesRouter
};