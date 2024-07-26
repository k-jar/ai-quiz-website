import { generateQuizWithLM } from './lmstudioModel.mjs';
import { generateQuizWithOpenAI } from './openaiModel.mjs';

function parseQuizLM(prediction) {
    try {
        const parsed = JSON.parse(prediction.content);
        console.info("The questions are", parsed.questions);
        return parsed;
    } catch (e) {
        console.error("Error parsing LM model response:", e);
        throw new Error("Failed to parse LM model response");
    }
}

function parseQuizOpenAI(prediction) {
    try {
        console.log("OpenAI prediction:", prediction);
        const parsed = JSON.parse(prediction);
        return parsed;
    } catch (e) {
        console.error("Error parsing OpenAI response:", e);
        throw new Error("Failed to parse OpenAI response");
    }
}

async function generateQuiz(text, numQuestions = 5, questionLanguage = "jp", answerLanguage = "jp", modelChoice = "lm") {
    try {
        switch (modelChoice) {
            case "lm":
                console.log("Using LM model");
                return parseQuizLM(await generateQuizWithLM(text, numQuestions, questionLanguage, answerLanguage));
                
            case "openai":
                console.log("Using OpenAI model");
                return parseQuizOpenAI(await generateQuizWithOpenAI(text, numQuestions, questionLanguage, answerLanguage));
                
            case "none":
                // Directly take user-provided JSON
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error("Error parsing user-provided JSON:", e);
                    throw new Error("Invalid JSON provided by user");
                }
                
            default:
                console.warn("Unknown modelChoice, defaulting to LM model");
                return parseQuizLM(await generateQuizWithLM(text, numQuestions, questionLanguage, answerLanguage));
        }
    } catch (e) {
        console.error("Error generating quiz:", e);
        throw new Error("Failed to generate quiz");
    }
}

export { generateQuiz };
