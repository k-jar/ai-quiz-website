import { mockQuizzes } from "./constants.mjs";
import jwt from "jsonwebtoken";

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

// Verify jwt token
export const verifyToken = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("No token provided");
    }

    // The token is usually sent in the format: "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send("Token is invalid");
        }

        // Attach the decoded user ID to the request object
        req.userId = decoded.userId;
        next();
    });
};