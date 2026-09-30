jest.mock("../models/messages.model");

const {
  fetchMessages,
  insertMessage,
  fetchMessageById,
  removeMessage
} = require("../models/messages.model");
const {
  getMessages,
  postMessage,
  getMessageById,
  deleteMessage
} = require("./messages.controller");

beforeEach(() => {
  jest.clearAllMocks();
});

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

describe("deleteMessage", () => {
  test("responds with 204 on successful delete", async () => {
    const req = {
      params: {
        messageId: 1
      }
    };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
      sendStatus: jest.fn()
    };
    const message = {
      id: 1,
      message: "hello pookie"
    };

    removeMessage.mockResolvedValue(message);

    await deleteMessage(req, res);

    expect(removeMessage).toHaveBeenCalledWith(1)
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test("responds with 404 error for nonexistent message", async () => {
    const req = {
      params: {
        messageId: 1
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn()
    };

    removeMessage.mockResolvedValue(undefined);

    await deleteMessage(req, res);

    expect(removeMessage).toHaveBeenCalledWith(1);
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Message not found"
    });
  });
});