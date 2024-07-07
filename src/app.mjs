import express from 'express';
import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const resolveIndexByQuizId = (req, res, next) => {
    const { params: { id } } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        res.status(400).send("Invalid ID");
        return;
    }
    const index = mockQuizzes.findIndex(quiz => quiz.id === parsedId);
    if (index === -1) {
        res.status(404).send("Quiz not found");
        return;
    }
    req.quizIndex = index;
    next();
};

let mockQuizzes;

fs.readFile(path.join(__dirname, 'mockQuizzes.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the mockQuizzes file:', err);
        return;
    }
    mockQuizzes = JSON.parse(data);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get("/api/quizzes", (req, res) => {
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

app.post("/api/quizzes", (req, res) => {
    const { title, questions } = req.body;
    if (!title || !questions) {
        res.status(400).send("Title and questions are required");
        return;
    }
    const newQuiz = {
        id: mockQuizzes.length + 1,
        title,
        questions,
    };
    mockQuizzes.push(newQuiz);
    res.status(201).send(newQuiz);
});

app.get("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    const quiz = mockQuizzes[quizIndex];
    return res.send(quiz);
});

app.patch("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    let quiz = mockQuizzes[quizIndex];
    quiz = { ...quiz, ...req.body };
    res.send(quiz);
});

app.delete("/api/quizzes/:id", resolveIndexByQuizId, (req, res) => {
    const { quizIndex } = req;
    mockQuizzes.splice(quizIndex, 1);
    res.status(200).send("Quiz deleted successfully");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});
