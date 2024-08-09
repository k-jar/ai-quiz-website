import { getUsers } from "../controllers/authController";
import {
  getQuizById,
  getAllQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  generateQuizRoute,
} from "../controllers/quizController";
import User from "../models/User";
import Quiz from "../models/Quiz";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { mockQuizzes } from "../utils/constants.mjs";
import { validationResult, matchedData, body } from "express-validator";
import { generateQuiz } from "../utils/aiClient.mjs";

let mongoServer;

jest.mock("express-validator");
jest.mock("../utils/aiClient.mjs");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

async function createMockUser() {
  const user = new User({ username: "test", password: "test" });
  await user.save();
  return user;
}

function createMockReqRes(reqOverrides = {}, resOverrides = {}) {
  const mockRequest = {
    ...reqOverrides,
  };
  const mockResponse = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    ...resOverrides,
  };

  return { mockRequest, mockResponse };
}

async function createMockQuiz(user, quizData = mockQuizzes[0]) {
  const mockQuiz = { ...quizData, createdBy: user._id };
  const quiz = new Quiz(mockQuiz);
  const savedQuiz = await quiz.save();
  return savedQuiz;
}

describe("get quizzes", () => {
  it("should get a quiz by id", async () => {
    const user = await createMockUser();
    const savedQuiz = await createMockQuiz(user);

    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: savedQuiz._id.toString() },
    });

    await getQuizById(mockRequest, mockResponse);

    const expectedQuiz = savedQuiz.toObject();

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(expectedQuiz);
  });

  it("should return 404 if the quiz is not found", async () => {
    const mockRequest = {
      params: { id: new mongoose.Types.ObjectId().toString() },
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // const { mockRequest, mockResponse } = createMockReqRes({ params: { id: new mongoose.Types.ObjectId().toString() } });

    // Mock the Quiz model to return null
    const mockFindById = jest.spyOn(Quiz, "findById").mockResolvedValue(null);

    await getQuizById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("Quiz not found");

    // Cleanup
    mockFindById.mockRestore();
  });

  it("should return 400 if the id is invalid", async () => {
    // const mockRequest = { params: { id: 'invalid-id' } };
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn()
    // };

    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: "invalid-id" },
    });

    await getQuizById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith("Invalid ID format");
  });

  it("should return 404 if there is a server error", async () => {
    // const mockRequest = { params: { id: new mongoose.Types.ObjectId().toString() } };
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn()
    // };

    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: new mongoose.Types.ObjectId().toString() },
    });

    // Mock the Quiz model to throw an error
    const mockFindById = jest
      .spyOn(Quiz, "findById")
      .mockRejectedValue(new Error("Server error"));

    await getQuizById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("Server error");

    // Cleanup
    mockFindById.mockRestore();
  });

  it("should return all quizzes", async () => {
    //
    // const user = new User({ username: 'test', password: 'test' });
    // await user.save();

    // const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
    //   ...quiz,
    //   createdBy: user._id
    // }));

    // await Quiz.insertMany(mockQuizzesWithUser);

    // const mockRequest = { query: {} };
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn()
    // };

    const user = await createMockUser();
    const mockQuizzesWithUser = mockQuizzes.map((quiz) => ({
      ...quiz,
      createdBy: user._id,
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    const { mockRequest, mockResponse } = createMockReqRes({ query: {} });

    await getAllQuizzes(mockRequest, mockResponse);

    const quizzesInDb = await Quiz.find().lean();

    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.arrayContaining(
        quizzesInDb.map((quiz) =>
          expect.objectContaining({
            title: quiz.title,
            reading: quiz.reading,
            questions: expect.arrayContaining(
              quiz.questions.map((q) =>
                expect.objectContaining({
                  question: q.question,
                  options: expect.arrayContaining(q.options),
                  answer: q.answer,
                })
              )
            ),
            createdBy: quiz.createdBy,
            creationDate: quiz.creationDate,
          })
        )
      )
    );
  });

  it("should return filtered quizzes", async () => {
    //
    // const user = new User({ username: 'test', password: 'test' });
    // await user.save();

    // const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
    //   ...quiz,
    //   createdBy: user._id
    // }));

    // await Quiz.insertMany(mockQuizzesWithUser);

    // const mockRequest = { query: { filter: 'title', value: 'general' } };
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn()
    // };

    const user = await createMockUser();
    const mockQuizzesWithUser = mockQuizzes.map((quiz) => ({
      ...quiz,
      createdBy: user._id,
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    const { mockRequest, mockResponse } = createMockReqRes({
      query: { filter: "title", value: "general" },
    });

    await getAllQuizzes(mockRequest, mockResponse);

    const quizzesInDb = await Quiz.find({
      title: new RegExp("general", "i"),
    }).lean();

    expect(mockResponse.send).toHaveBeenCalledWith(
      expect.arrayContaining(
        quizzesInDb.map((quiz) =>
          expect.objectContaining({
            title: quiz.title,
            reading: quiz.reading,
            questions: expect.arrayContaining(
              quiz.questions.map((q) =>
                expect.objectContaining({
                  question: q.question,
                  options: expect.arrayContaining(q.options),
                  answer: q.answer,
                })
              )
            ),
            createdBy: quiz.createdBy,
            creationDate: quiz.creationDate,
          })
        )
      )
    );
  });

  it("should return no quizzes if the filter does not match any quizzes", async () => {
    //
    // const user = new User({ username: 'test', password: 'test' });
    // await user.save();

    // const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
    //   ...quiz,
    //   createdBy: user._id
    // }));

    // await Quiz.insertMany(mockQuizzesWithUser);

    // // There are no quizzes with the title 'palindrome'
    // const mockRequest = { query: { filter: 'title', value: 'palindrome' } };
    // const mockResponse = {
    //   json: jest.fn(),
    //   status: jest.fn().mockReturnThis(),
    //   send: jest.fn()
    // };

    const user = await createMockUser();
    const mockQuizzesWithUser = mockQuizzes.map((quiz) => ({
      ...quiz,
      createdBy: user._id,
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    // There are no quizzes with the title 'palindrome'
    const { mockRequest, mockResponse } = createMockReqRes({
      query: { filter: "title", value: "palindrome" },
    });

    await getAllQuizzes(mockRequest, mockResponse);

    expect(mockResponse.send).toHaveBeenCalledWith([]);
  });
});

describe("create quiz", () => {
  it("should create a quiz when given valid data", async () => {
    const user = await createMockUser();
    const mockQuiz = await createMockQuiz(user);
    const { mockRequest, mockResponse } = createMockReqRes({
      body: mockQuiz,
      user,
    });

    validationResult.mockReturnValue({ isEmpty: () => true });
    matchedData.mockReturnValue(mockRequest.body);

    await createQuiz(mockRequest, mockResponse);

    const quiz = await Quiz.findOne({ title: mockQuiz.title }).lean();
    expect(quiz).toMatchObject({
      ...mockQuiz.toObject(),
      createdBy: user._id,
    });
  });
});

it("should return 400 if the data is invalid", async () => {
  const user = await createMockUser();
  const mockQuiz = await createMockQuiz(user);
  const { mockRequest, mockResponse } = createMockReqRes({
    body: mockQuiz,
    user,
  });

  validationResult.mockReturnValue({
    isEmpty: () => false,
    array: () => [{ msg: "Invalid data" }],
  });

  await createQuiz(mockRequest, mockResponse);

  expect(mockResponse.status).toHaveBeenCalledWith(400);
});

describe("update quiz", () => {
  it("should update a quiz when given valid data", async () => {
    const user = await createMockUser();
    const quiz = await createMockQuiz(user);

    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: quiz._id.toString() },
      body: {
        title: "Updated Quiz",
        reading: "Updated reading",
        questions: [
          {
            question: "Updated question",
            options: ["C", "B", "A"],
            answer: 1,
          },
        ],
      },
    });

    await updateQuiz(mockRequest, mockResponse);

    const updatedQuiz = await Quiz.findById(quiz._id).lean();

    expect(updatedQuiz).toMatchObject({
      title: "Updated Quiz",
      reading: "Updated reading",
      questions: [
        {
          question: "Updated question",
          options: ["C", "B", "A"],
          answer: 1,
        },
      ],
      createdBy: user._id,
    });
  });

  it("should return 404 if the quiz is not found", async () => {
    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        title: "Updated Quiz",
        reading: "Updated reading",
        questions: [
          {
            question: "Updated question",
            options: ["C", "B", "A"],
            answer: 1,
          },
        ],
      },
    });

    // Mock the Quiz model to return null
    const mockFindByIdAndUpdate = jest
      .spyOn(Quiz, "findByIdAndUpdate")
      .mockResolvedValue(null);

    await updateQuiz(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith("Quiz not found");

    mockFindByIdAndUpdate.mockRestore();
  });
});

describe("delete quiz", () => {
  it("should delete a quiz when given a valid id", async () => {
    const user = await createMockUser();
    const quiz = await createMockQuiz(user);
    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: quiz._id.toString() },
    });

    await deleteQuiz(mockRequest, mockResponse);

    const deletedQuiz = await Quiz.findById(quiz._id);

    expect(deletedQuiz).toBeNull();
  });

  it("should return 404 if the quiz is not found", async () => {
    const { mockRequest, mockResponse } = createMockReqRes({
      params: { id: new mongoose.Types.ObjectId().toString() },
    });

    // Mock the Quiz model to return null
    const mockFindById = jest.spyOn(Quiz, "findById").mockResolvedValue(null);

    await deleteQuiz(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Quiz not found",
    });

    mockFindById.mockRestore();
  });
});

describe("generateQuizRoute", () => {
  it("should generate a quiz when given valid data", async () => {
    const mockQuiz = {
      questions: [{ question: "Test question", answer: "A" }],
    };

    validationResult.mockReturnValue({ isEmpty: () => true });
    matchedData.mockReturnValue({
      text: "Sample text",
      numQuestions: 1,
      questionLanguage: "en",
      answerLanguage: "en",
      modelChoice: "default",
    });
    generateQuiz.mockResolvedValue(mockQuiz);

    const mockRequest = {
      body: {
        text: "Sample text",
        numQuestions: 1,
        questionLanguage: "en",
        answerLanguage: "en",
        modelChoice: "default",
      },
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await generateQuizRoute(mockRequest, mockResponse);

    expect(validationResult).toHaveBeenCalledWith(mockRequest);
    expect(matchedData).toHaveBeenCalledWith(mockRequest);
    expect(generateQuiz).toHaveBeenCalledWith(
      "Sample text",
      1,
      "en",
      "en",
      "default"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockQuiz);
  });

  it("should return 400 if the data is invalid", async () => {
    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid data" }],
    });

    const mockRequest = {
      body: {
        text: "Sample text",
        numQuestions: 1,
        questionLanguage: "en",
        answerLanguage: "en",
        modelChoice: "default",
      },
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await generateQuizRoute(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});
