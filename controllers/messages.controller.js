const {
  fetchMessages,
  insertMessage,
  fetchMessageById,
  removeMessage,
  patchMessage
} = require("../models/messages.model");

async function getMessages(req, res) {
  const messages = await fetchMessages();

  return res.status(200).json({
    messages
  });
}

async function postMessage(req, res) {
  const message = await insertMessage(req.body.message);

  return res.status(201).json({
    message
  });
}

async function getMessageById(req, res) {
  const message = await fetchMessageById(
    req.params.messageId
  );

  if (!message) {
    return res.status(404).json({
      message: "Message not found"
    });
  }

  return res.status(200).json({
    message
  });
}

async function deleteMessage(req, res) {
  const message = await removeMessage(
    req.params.messageId
  );

  if (!message) {
    return res.status(404).json({
      message: "Message not found"
    });
  }

  return res.sendStatus(204);
}

async function updateMessage(req, res) {
  const message = await patchMessage(
    req.params.messageId,
    req.body.message
  );

  if (!message) {
    return res.status(404).json({
      message: "Message not found"
    });
  }

  return res.status(200).json({
    message
  });
}

module.exports = {
  getMessages,
  postMessage,
  getMessageById,
  deleteMessage,
  updateMessage
};