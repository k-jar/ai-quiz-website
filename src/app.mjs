import express from 'express';
import quizzesRouter from './routes/quizzes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(quizzesRouter);

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});
