const express = require("express");
const {
  getMessages,
  postMessage,
  getMessageById,
  deleteMessage,
  updateMessage
} = require("../controllers/messages.controller");
const {
  validateMessage,
  validateMessageId,
  validateUserId
} = require("../middleware/messages.middleware");
const asyncHandler = require("../middleware/asyncHandler.middleware");

const messagesRouter = express.Router();

messagesRouter.get(
  "/",
  getMessages
);

messagesRouter.post(
  "/",
  validateMessage,
  validateUserId,
  asyncHandler(postMessage)
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

messagesRouter.patch(
  "/:messageId",
  validateMessageId,
  validateMessage,
  updateMessage
);

module.exports = {
  messagesRouter
};