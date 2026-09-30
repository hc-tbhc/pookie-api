jest.mock("../models/messages.model");

const {
  fetchMessages,
  insertMessage,
  fetchMessageById
} = require("../models/messages.model");
const {
  getMessages,
  postMessage,
  getMessageById
} = require("./messages.controller");

describe("getMessageById", () => {
  test("getMessageById responds with status 200 and the returned message object", async () => {
    const req = {
      params: {
        messageId: 2
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const response = {
      id: 2,
      message: "hello again"
    };
  
    fetchMessageById.mockResolvedValue(response);
  
    await getMessageById(req, res);
  
    expect(fetchMessageById).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: response
    });
  });

  test("responds with 404 'Message not found'", async () => {
    const req = {
      params: {
        messageId: 999999
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    fetchMessageById.mockResolvedValue(undefined);

    await getMessageById(req, res);

    expect(fetchMessageById).toHaveBeenCalledWith(999999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Message not found"
    });
  });
});

test("getMessages responds with status 200 and messages array", async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  
  const messages = [
    { id: 1, message: "hello pookie" }
  ];

  fetchMessages.mockResolvedValue(messages);

  await getMessages(req, res);

  expect(fetchMessages).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    messages
  });
});

test("postMessage responds with status 201 and the returned message object", async () => {
  const req = {
    body: {
      message: "hello again"
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const response = {
    id: 2,
    message: "hello again"
  }

  insertMessage.mockResolvedValue(response);

  await postMessage(req, res);

  expect(insertMessage).toHaveBeenCalledWith("hello again");
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: response
  });
});
