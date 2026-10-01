function validateMessage(req, res, next) {
  const message = req.body?.message;

  if (typeof message === "string" && message.trim().length) {
    return next();
  }

  return res.status(400).json({
    message: "Message must be a non-empty string"
  });
}

function validateMessageId(req, res, next) {
  const messageId = Number(req.params.messageId);

  if (!Number.isInteger(messageId) || messageId <= 0) {
    return res.status(400).json({
      message: "Invalid message ID"
    });
  }

  req.params.messageId = messageId;

  return next();
}

function validateUserId(req, res, next) {
  const userId = Number(req.body.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      message: "Invalid user ID"
    });
  }

  req.body.userId = userId;

  return next();
}

module.exports = {
  validateMessage,
  validateMessageId,
  validateUserId
};
