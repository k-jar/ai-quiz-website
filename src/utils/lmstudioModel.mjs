import sdk from '@lmstudio/sdk';
import { quizSchema } from './constants.mjs';

let client;

// load client funtion
async function loadClient() {
    client = new sdk.LMStudioClient();
}

async function loadModel() {
    await client.llm.load("lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF", {
        config: {
            gpuOffload: "max",
            contextLength: 1024,
        },
        identifier: "Llama 3 8B Instruct",
        noHup: true,
    });
}

async function getModel() {
    if (!client) {
        await loadClient();
    }
    const loadedModels = await client.llm.listLoaded();
    if (loadedModels.length === 0) {
        console.log("Model not loaded, loading model");
        await loadModel();
    }
    return await client.llm.get({});
}

async function predictQuiz(model, text,
    numQuestions,
    questionLanguage,
    answerLanguage) {
    const prediction = await model.respond(
        [
            {
                role: "system", content: `Generate ${numQuestions} multiple choice quiz questions in ${questionLanguage} (answers in ${answerLanguage}) from the provided text, formatted in JSON with title, questions, options, and answers.`
            },
            { role: "user", content: text },
        ],
        {
            maxPredictedTokens: 1500,
            structured: { type: 'json', jsonSchema: quizSchema },
        },
    );

    return prediction;
}

export async function generateQuizWithLM(text, numQuestions, questionLanguage, answerLanguage) {
    const model = await getModel();
    return await predictQuiz(model, text, numQuestions, questionLanguage, answerLanguage);
}