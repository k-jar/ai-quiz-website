import { mockQuizzes } from "./constants.mjs";

export const resolveIndexByQuizId = (req, res, next) => {
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