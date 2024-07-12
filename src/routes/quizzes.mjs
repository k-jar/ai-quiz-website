import { Router } from 'express';
import {
    query,
    validationResult,
    body,
    matchedData,
    checkSchema,
} from 'express-validator';
import { createQuizSchema } from '../utils/validationSchemas.mjs';
import { mockQuizzes } from '../utils/constants.mjs';
import { resolveIndexByQuizId } from '../utils/middlewares.mjs';
import { generateQuiz } from '../utils/aiClient.mjs';
// import axios from 'axios';

const router = Router();

router.get("/api/quizzes", (req, res) => {
    const {
        query: { filter, value },
    } = req;
    if (filter && value) {
        const filteredQuizzes = mockQuizzes.filter(quiz =>
            quiz[filter].toLowerCase().includes(value.toLowerCase()));
        return res.send(filteredQuizzes);
    }
    res.send(mockQuizzes);
});

router.post(
    "/api/quizzes",
    checkSchema(createQuizSchema),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { title, reading, questions } = matchedData(req);
        const newQuiz = {
            id: mockQuizzes.length + 1,
            title,
            reading,
            questions,
        };
        mockQuizzes.push(newQuiz);
        res.status(201).send(newQuiz);
    }
);

router.get("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    const quiz = mockQuizzes[quizIndex];
    return res.send(quiz);
});

router.patch("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    const quiz = mockQuizzes[quizIndex];
    mockQuizzes[quizIndex] = { ...quiz, ...req.body };
    res.send(quiz);
});

router.delete("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    mockQuizzes.splice(quizIndex, 1);
    res.status(200).send("Quiz deleted successfully");
});

// router.post("/api/generate-quiz", (req, res) => {
//     const { text } = req.body;
//     console.log("Text in post", req.body);
//     generateQuiz(text).then(quiz => {
//         req.body = quiz;
//         axios.post('/api/quizzes', req.body)
//             .then(response => {
//                 res.status(200).json(response.data);
//             })
//             .catch(error => {
//                 res.status(500).json({ error: error.toString() });
//             });
//     });
// });

router.post("/api/generate-quiz", (req, res) => {
    const { text } = req.body;
    generateQuiz(text).then(quiz => {
        res.status(200).json(quiz);
    }).catch(error => {
        res.status(500).json({ error: error.toString() });
    });
});

export default router;