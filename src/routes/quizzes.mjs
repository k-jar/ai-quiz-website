import { Router } from 'express';
import {
    validationResult,
    matchedData,
    checkSchema,
} from 'express-validator';
import { addQuizSchema, generateQuizSchema } from '../utils/validationSchemas.mjs';
import Quiz from '../models/Quiz.mjs';
import { generateQuiz } from '../utils/aiClient.mjs';
import mongoose from 'mongoose';
import { verifyToken } from '../utils/middlewares.mjs';

const router = Router();

// Get all quizzes
router.get("/quizzes", async (req, res) => {
    const {
        query: { filter, value },
    } = req;
    if (filter && value) {
        // Case-insensitive search
        const filteredQuizzes = await Quiz.find({ [filter]: new RegExp(value, "i") });
        return res.send(filteredQuizzes);
    }
    res.send(await Quiz.find());
});

// Create a new quiz
router.post(
    "/quizzes",
    verifyToken,
    checkSchema(addQuizSchema),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { title, reading, questions } = matchedData(req);
        const newQuiz = new Quiz({
            title,
            reading,
            questions,
        });
        await newQuiz.save();
        res.status(201).send(newQuiz);
    }
);

// Get a quiz by ID
router.get("/quizzes/:id", async (req, res) => {
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
});

// Update a quiz by ID
router.patch("/quizzes/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
    if (!quiz) {
        return res.status(404).send("Quiz not found");
    }
    res.send(quiz);
});

// Delete a quiz by ID
router.delete("/quizzes/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
        return res.status(404).send("Quiz not found");
    }
    res.status(200).send("Quiz deleted successfully");
});

// Generate a quiz
router.post(
    "/generate-quiz",
    verifyToken,
    checkSchema(generateQuizSchema),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { text, numQuestions, questionLanguage, answerLanguage, modelChoice } = matchedData(req);
        console.log("modelchoice", modelChoice);
        const quiz = await generateQuiz(text, numQuestions, questionLanguage, answerLanguage, modelChoice);
        quiz.reading = text;
        res.json(quiz);
    });

export default router;