import express from 'express';
import cors from 'cors';
import quizzesRouter from './routes/quizzes.mjs';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const server = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
server.use(cors({
    origin: 'http://localhost:4200'
}));
server.use(express.json());
server.use(quizzesRouter);

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
