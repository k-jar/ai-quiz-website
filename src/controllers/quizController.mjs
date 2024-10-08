import Quiz from "../models/Quiz.mjs";
import mongoose from "mongoose";
import { validationResult, matchedData } from "express-validator";
import { generateQuiz } from "../utils/aiClient.mjs";

export async function getAllQuizzes(req, res) {
  const {
    query: { filter, value },
  } = req;
  if (filter && value) {
    const filteredQuizzes = await Quiz.find({
      [filter]: new RegExp(value, "i"),
    });
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
  const newQuiz = new Quiz({
    title,
    reading,
    questions,
    createdBy,
  });
  await newQuiz.save();
  res.status(201).send(newQuiz.toObject());
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
    return res.status(200).send(quiz.toObject());
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
  res.send(quiz.toObject());
}

export async function deleteQuiz(req, res) {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }
  await Quiz.findByIdAndDelete(id);
  res.status(200).json({ message: "Quiz deleted successfully" });
}

export async function generateQuizRoute(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { text, numQuestions, questionLanguage, answerLanguage, modelChoice } =
    matchedData(req);
  try {
    const quiz = await generateQuiz(
      text,
      numQuestions,
      questionLanguage,
      answerLanguage,
      modelChoice
    );
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
}
