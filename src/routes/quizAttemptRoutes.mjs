import { Router } from 'express';
import { createQuizAttempt, getAttemptsByUser, getAttemptsByQuiz, getAttemptsByUserAndQuiz, getLatestAttempt } from '../controllers/quizAttemptController.mjs';

const router = Router();

router.post('/', createQuizAttempt);
router.get('/user/:userId', getAttemptsByUser);
router.get('/quiz/:quizId', getAttemptsByQuiz);
router.get('/:userId/:quizId', getAttemptsByUserAndQuiz);
router.get('/quiz/:quizId/user/:userId/latest', getLatestAttempt);

export default router;