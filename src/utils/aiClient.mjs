import { generateQuizWithLM } from './lmstudioModel.mjs';
import { generateQuizWithOpenAI } from './openaiModel.mjs';

function parseQuizLM(prediction) {
    try {
        const parsed = JSON.parse(prediction.content);
        console.info("The questions are", parsed.questions);
        return parsed;
    } catch (e) {
        console.error(e);
    }
}

function parseQuizOpenAI(prediction) {
    try {
        const parsed = JSON.parse(prediction);
        console.info("The questions are", parsed.questions);
        return parsed;
    } catch (e) {
        console.error(e);
    }
}

async function generateQuiz(text, numQuestions = 5, questionLanguage = "jp", answerLanguage = "jp", modelChoice = "lm") {
    switch (modelChoice) {
        case "lm":
            console.log("LM model");
            return parseQuizLM(await generateQuizWithLM(text, numQuestions, questionLanguage, answerLanguage));
        case "openai":
            console.log("OpenAI model");
            return parseQuizOpenAI(await generateQuizWithOpenAI(text, numQuestions, questionLanguage, answerLanguage));
        case "none":
            // Directly take user's input as JSON
            const userQuiz = JSON.parse(text);
            return userQuiz;
        default:
            return parseQuizLM(await generateQuizWithLM(text, numQuestions, questionLanguage, answerLanguage));

    }
}

export { generateQuiz };