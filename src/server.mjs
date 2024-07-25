import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import quizzesRouter from './routes/quizRoutes.mjs';
import authRouter from './routes/authRoutes.mjs';
import quizAttemptRouter from './routes/quizAttemptRoutes.mjs';

import { config } from 'dotenv';
config();

const server = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

server.use(cors({
    origin: 'http://localhost:4200'
}));
server.use(express.json());

server.use("/api", quizzesRouter);
server.use("/api/auth", authRouter);
server.use("/api/quiz-attempts", quizAttemptRouter);

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB")
});

server.get("/", (req, res) => {
    res.send("Hello, world!");
});

server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
});
