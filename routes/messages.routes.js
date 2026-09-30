const express = require("express");
const {
  getMessages,
  postMessage,
  getMessageById,
  deleteMessage
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

messagesRouter.delete(
  "/:messageId",
  validateMessageId,
  deleteMessage
);

module.exports = {
  messagesRouter
};