import { getUsers } from '../controllers/authController';
import { getQuizById, getAllQuizzes, createQuiz, updateQuiz, deleteQuiz, generateQuizRoute } from '../controllers/quizController';
import User from '../models/User';
import Quiz from '../models/Quiz';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { mockQuizzes } from '../utils/constants.mjs';
import { validationResult, matchedData } from 'express-validator';
import { generateQuiz } from '../utils/aiClient.mjs';

let mongoServer;

jest.mock('express-validator');
jest.mock('../utils/aiClient.mjs');

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

describe('create quiz', () => {
  it('should create a quiz when given valid data', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();
    
    const mockRequest = {
      body: {
        title: 'Test Quiz',
        reading: 'Test reading',
        questions: [
          {
            question: 'Test question',
            options: ['A', 'B', 'C'],
            answer: 'A'
          }
        ],
        createdBy: user._id
      }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    validationResult.mockReturnValue({ isEmpty: () => true });
    matchedData.mockReturnValue(mockRequest.body);

    // Act
    await createQuiz(mockRequest, mockResponse);

    // Assert
    const quiz = await Quiz.findOne({ title: 'Test Quiz' }).lean();
    
    expect(quiz).toMatchObject({
      title: 'Test Quiz',
      reading: 'Test reading',
      questions: [
        {
          question: 'Test question',
          options: ['A', 'B', 'C'],
          answer: 'A'
        }
      ],
      createdBy: user._id
    });
  }
  );

  it('should return 400 if the data is invalid', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const mockRequest = {
      body: {
        title: 'Test Quiz',
        reading: 'Test reading',
        questions: [
          {
            question: 'Test question',
            options: ['A', 'B', 'C'],
            answer: 'A'
          }
        ],
        createdBy: user._id
      }
    };

    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Invalid data' }] });

    // Act
    await createQuiz(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  }
  );
});

describe('update quiz', () => {
  it('should update a quiz when given valid data', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const quiz = new Quiz({
      title: 'Test Quiz',
      reading: 'Test reading',
      questions: [
        {
          question: 'Test question',
          options: ['A', 'B', 'C'],
          answer: 'A'
        }
      ],
      createdBy: user._id
    });
    await quiz.save();

    const mockRequest = {
      params: { id: quiz._id.toString() },
      body: {
        title: 'Updated Quiz',
        reading: 'Updated reading',
        questions: [
          {
            question: 'Updated question',
            options: ['A', 'B', 'C'],
            answer: 'A'
          }
        ]
      }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await updateQuiz(mockRequest, mockResponse);
    
    // Assert
    const updatedQuiz = await Quiz.findById(quiz._id).lean();

    expect(updatedQuiz).toMatchObject({
      title: 'Updated Quiz',
      reading: 'Updated reading',
      questions: [
        {
          question: 'Updated question',
          options: ['A', 'B', 'C'],
          answer: 'A'
        }
      ],
      createdBy: user._id
    });
  }
  );

  it('should return 404 if the quiz is not found', async () => {
    // Arrange
    const mockRequest = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: {
        title: 'Updated Quiz',
        reading: 'Updated reading',
        questions: [
          {
            question: 'Updated question',
            options: ['A', 'B', 'C'],
            answer: 'A'
          }
        ]
      }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock the Quiz model to return null
    const mockFindByIdAndUpdate = jest.spyOn(Quiz, 'findByIdAndUpdate').mockResolvedValue(null);

    // Act
    await updateQuiz(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Quiz not found');

    // Cleanup
    mockFindByIdAndUpdate.mockRestore();
  }
  );
});

describe('delete quiz', () => {
  it('should delete a quiz when given a valid id', async () => {
    // Arrange
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const quiz = new Quiz({
      title: 'Test Quiz',
      reading: 'Test reading',
      questions: [
        {
          question: 'Test question',
          options: ['A', 'B', 'C'],
          answer: 'A'
        }
      ],
      createdBy: user._id
    });
    await quiz.save();

    const mockRequest = {
      params: { id: quiz._id.toString() }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await deleteQuiz(mockRequest, mockResponse);

    // Assert
    const deletedQuiz = await Quiz.findById(quiz._id);
    
    expect(deletedQuiz).toBeNull();
  }
  );

  it('should return 404 if the quiz is not found', async () => {
    // Arrange
    const mockRequest = {
      params: { id: new mongoose.Types.ObjectId().toString() }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Mock the Quiz model to return null
    const mockFindByIdAndDelete = jest.spyOn(Quiz, 'findByIdAndDelete').mockResolvedValue(null);

    // Act
    await deleteQuiz(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('Quiz not found');

    // Cleanup
    mockFindByIdAndDelete.mockRestore();
  }
  );
});

describe('generateQuizRoute', () => {
  it('should generate a quiz when given valid data', async () => {
    // Arrange
    const mockQuiz = { questions: [{ question: 'Test question', answer: 'A' }] };
    
    validationResult.mockReturnValue({ isEmpty: () => true });
    matchedData.mockReturnValue({
      text: 'Sample text',
      numQuestions: 1,
      questionLanguage: 'en',
      answerLanguage: 'en',
      modelChoice: 'default'
    });
    generateQuiz.mockResolvedValue(mockQuiz);

    const mockRequest = {
      body: {
        text: 'Sample text',
        numQuestions: 1,
        questionLanguage: 'en',
        answerLanguage: 'en',
        modelChoice: 'default'
      }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await generateQuizRoute(mockRequest, mockResponse);

    // Assert
    expect(validationResult).toHaveBeenCalledWith(mockRequest);
    expect(matchedData).toHaveBeenCalledWith(mockRequest);
    expect(generateQuiz).toHaveBeenCalledWith(
      'Sample text',
      1,
      'en',
      'en',
      'default'
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockQuiz);
  });

  it('should return 400 if the data is invalid', async () => {
    // Arrange
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Invalid data' }] });

    const mockRequest = {
      body: {
        text: 'Sample text',
        numQuestions: 1,
        questionLanguage: 'en',
        answerLanguage: 'en',
        modelChoice: 'default'
      }
    };
    const mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Act
    await generateQuizRoute(mockRequest, mockResponse);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});