import mongoose from 'mongoose';
import Quiz from '../models/quiz.mjs';
import { mockQuizzes } from './constants.mjs';
import { config } from 'dotenv';
config();

const DATABASE_URL = process.env.DATABASE_URL;

async function InitialDataLoad() {
  // Connect to MongoDB
  await mongoose.connect(DATABASE_URL);

  // Delete all existing quizzes
  await Quiz.deleteMany({});

  // Insert the mock data
  await Quiz.insertMany(mockQuizzes);

  // Close the connection
  await mongoose.connection.close();
}

InitialDataLoad().catch(error => console.error(error));