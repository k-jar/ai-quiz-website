import Quiz from '../models/Quiz.mjs';
import mongoose from 'mongoose';
import { validationResult, matchedData } from 'express-validator';
import { generateQuiz } from '../utils/aiClient.mjs';

export async function getAllQuizzes(req, res) {
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    const filteredQuizzes = await Quiz.find({ [filter]: new RegExp(value, "i") });
    return res.send(filteredQuizzes);
  }
  res.send(await Quiz.find());
}

export async function createQuiz(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, reading, questions, createdBy } = matchedData(req);
  console.log("matchedData", matchedData(req));
  const newQuiz = new Quiz({
    title,
    reading,
    createdBy,
    questions,
  });
  await newQuiz.save();
  res.status(201).send(newQuiz);
}

export async function getQuizById(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).send("Quiz not found");
    }
    return res.send(quiz);
  } catch (error) {
    return res.status(404).send("Server error");
  }
}

export async function updateQuiz(req, res) {
  const { id } = req.params;
  const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
  if (!quiz) {
    return res.status(404).send("Quiz not found");
  }
  res.send(quiz);
}

export async function deleteQuiz(req, res) {
  const { id } = req.params;
  const quiz = await Quiz.findByIdAndDelete(id);
  if (!quiz) {
    return res.status(404).send("Quiz not found");
  }
  res.status(200).send("Quiz deleted successfully");
}

export async function generateQuizRoute(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { text, numQuestions, questionLanguage, answerLanguage, modelChoice } = matchedData(req);
  const quiz = await generateQuiz(text, numQuestions, questionLanguage, answerLanguage, modelChoice);
  console.log("Generated quiz", quiz);
  quiz.reading = text;
  res.json(quiz);
}