require("./config/env");

const express = require("express");
const { messagesRouter } = require("./routes/messages.routes");

const app = express();

app.use(express.json());

app.use("/messages", messagesRouter);

app.get("/health", (req, res, next) => {
  return res.status(200).json({
    status: "ok"
  });
});

module.exports = app;

/*
curl -X POST "http://localhost:3000/messages" \
  -H "Content-Type: application/json" \
  -d '{"message":"hello pookie"}'
*/