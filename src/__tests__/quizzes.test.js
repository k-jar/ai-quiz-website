import { getUsers } from '../controllers/authController';
import { getQuizById } from '../controllers/quizController';
import { getAllQuizzes } from '../controllers/quizController';
import User from '../models/User';
import Quiz from '../models/Quiz';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mockQuizzes } from '../utils/constants.mjs';

let mongoServer;

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

describe('get users', () => {
  it('should return a list of users', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockRequest = {};
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Act
    await getUsers(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ username: 'test' })]));
  });
});

describe('get quizzes', () => {
  it('should get a quiz by id', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockQuiz = mockQuizzes[0]; // Use the first quiz from the mock data
    mockQuiz.createdBy = user._id; // Set the user id

    const quiz = new Quiz(mockQuiz);
    const savedQuiz = await quiz.save();

    const mockRequest = { params: { id: savedQuiz._id.toString() } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await getQuizById(mockRequest, mockResponse);

    const expectedQuiz = savedQuiz.toObject();

    // Check that res.status was called with 200
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    // Check that res.send was called with the correct quiz
    expect(mockResponse.send).toHaveBeenCalledWith(expectedQuiz);

  });

  it('should return 404 if the quiz is not found', async () => {
    // Arrange
    const mockRequest = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock the Quiz model to return null
    const mockFindById = jest.spyOn(Quiz, 'findById').mockResolvedValue(null);

    // Act
    await getQuizById(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Quiz not found');

    // Cleanup
    mockFindById.mockRestore();
  });

  it('should return 400 if the id is invalid', async () => {
    // Arrange
    const mockRequest = { params: { id: 'invalid-id' } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await getQuizById(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith('Invalid ID format');
  });

  it('should return 404 if there is a server error', async () => {
    // Arrange
    const mockRequest = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock the Quiz model to throw an error
    const mockFindById = jest.spyOn(Quiz, 'findById').mockRejectedValue(new Error('Server error'));

    // Act
    await getQuizById(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Server error');

    // Cleanup
    mockFindById.mockRestore();
  });

  it('should return all quizzes', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
      ...quiz,
      createdBy: user._id
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    const mockRequest = { query: {} };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await getAllQuizzes(mockRequest, mockResponse);

    // Assert
    const quizzesInDb = await Quiz.find().lean();

    expect(mockResponse.send).toHaveBeenCalledWith(expect.arrayContaining(
      quizzesInDb.map(quiz => expect.objectContaining({
        title: quiz.title,
        reading: quiz.reading,
        questions: expect.arrayContaining(
          quiz.questions.map(q => expect.objectContaining({
            question: q.question,
            options: expect.arrayContaining(q.options),
            answer: q.answer
          }))
        ),
        createdBy: quiz.createdBy,
        creationDate: quiz.creationDate
      }))
    ));
  });

  it('should return filtered quizzes', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
      ...quiz,
      createdBy: user._id
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    const mockRequest = { query: { filter: 'title', value: 'general' } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await getAllQuizzes(mockRequest, mockResponse);

    // Assert
    const quizzesInDb = await Quiz.find({ title: new RegExp('general', 'i') }).lean();

    expect(mockResponse.send).toHaveBeenCalledWith(expect.arrayContaining(
      quizzesInDb.map(quiz => expect.objectContaining({
        title: quiz.title,
        reading: quiz.reading,
        questions: expect.arrayContaining(
          quiz.questions.map(q => expect.objectContaining({
            question: q.question,
            options: expect.arrayContaining(q.options),
            answer: q.answer
          }))
        ),
        createdBy: quiz.createdBy,
        creationDate: quiz.creationDate
      }))
    ));
  });

  it('should return no quizzes if the filter does not match any quizzes', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockQuizzesWithUser = mockQuizzes.map(quiz => ({
      ...quiz,
      createdBy: user._id
    }));

    await Quiz.insertMany(mockQuizzesWithUser);

    // There are no quizzes with the title 'palindrome'
    const mockRequest = { query: { filter: 'title', value: 'palindrome' } };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await getAllQuizzes(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.send).toHaveBeenCalledWith([]);
  }
  );
});
