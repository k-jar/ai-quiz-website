import mongoose from 'mongoose';
import axios from 'axios';
import Quiz from '../models/Quiz.mjs';
import User from '../models/User.mjs';
import { mockQuizzes, mockUsers } from './constants.mjs'
import { config } from 'dotenv';
config();

const DATABASE_URL = process.env.DATABASE_URL;

async function InitialDataLoad() {
  try {
  // Connect to MongoDB
  const connection = await mongoose.connect(DATABASE_URL);
  console.log('Connected to MongoDB');

  // Clear the entire database
  await connection.connection.db.dropDatabase();
  console.log('Database cleared');

  // Register each mock user
  for (const user of mockUsers) {
    const response = await axios.post('http://localhost:3000/api/auth/register', user);
  }
  console.log('Users registered');

  // Get id of the first user
  const user = await User.findOne({ username: mockUsers[0].username });
  const userId = user._id;

  const quizzesWithUserId = mockQuizzes.map(quiz => ({ ...quiz, createdBy: userId }));

  // Insert the mock quiz data
  await Quiz.insertMany(quizzesWithUserId);
  console.log('Quizzes inserted');

  // Close the connection
  await mongoose.connection.close();
  console.log('Connection closed');
} catch (error) {
  console.error('Error during initial data load, ensure the server is running, error:', error);
  await mongoose.connection.close();
}
}

InitialDataLoad().catch(error => console.error(error));