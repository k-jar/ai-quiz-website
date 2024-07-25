import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { addQuizSchema, generateQuizSchema } from '../utils/validationSchemas.mjs';
import { verifyToken } from '../utils/middlewares.mjs';
import { getAllQuizzes, createQuiz, getQuizById, updateQuiz, deleteQuiz, generateQuizRoute } from '../controllers/quizController.mjs';

const router = Router();

router.get("/quizzes", getAllQuizzes);
router.post("/quizzes", verifyToken, checkSchema(addQuizSchema), createQuiz);
router.get("/quizzes/:id", getQuizById);
router.patch("/quizzes/:id", verifyToken, updateQuiz);
router.delete("/quizzes/:id", verifyToken, deleteQuiz);
router.post("/generate-quiz", verifyToken, checkSchema(generateQuizSchema), generateQuizRoute);

export default router;