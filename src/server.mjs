import express from 'express';
import cors from 'cors';
import quizzesRouter from './routes/quizzes.mjs';

const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors({
    origin: 'http://localhost:4200'
}));
server.use(express.json());
server.use(quizzesRouter);

server.get("/", (req, res) => {
    res.send("Hello, world!");
});

server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});
