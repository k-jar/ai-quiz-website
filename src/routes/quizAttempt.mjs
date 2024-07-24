import express from 'express';
import { Router } from 'express';
import QuizAttempt from '../models/QuizAttempt.mjs';
import User from '../models/User.mjs';
import Quiz from '../models/Quiz.mjs';

const router = Router();

// Create a new quiz attempt
router.post('/', async (req, res) => {
    const { userId, quizId, score } = req.body;
    try {
        const user = await User.findById(userId);
        const quiz = await Quiz.findById(quizId);
        if (!user || !quiz) {
            return res.status(404).json({ error: 'User or quiz not found' });
        }

        const quizAttempt = new QuizAttempt({ user, quiz, score });
        await quizAttempt.save();
        res.status(201).json(quizAttempt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all attempts for a specific user
router.get('/user/:userId', async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.params.userId });
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all attempts for a specific quiz
router.get('/quiz/:quizId', async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ quiz: req.params.quizId });
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all attempts for a specific quiz and user
router.get('/:userId/:quizId', async (req, res) => {
    try {
        const attempts = await QuizAttempt.find({ user: req.params.userId, quiz: req.params.quizId });
        res.status(200).json(attempts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get latest attempt for a quiz by a user
router.get('/quiz/:quizId/user/:userId/latest', async (req, res) => {
    try {
        const attempt = await QuizAttempt.findOne({ 
            user: req.params.userId, 
            quiz: req.params.quizId 
        }).sort({ attemptDate: -1 });
        res.status(200).json(attempt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;