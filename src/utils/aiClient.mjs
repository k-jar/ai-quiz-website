import sdk from '@lmstudio/sdk';
const LMStudioClient = sdk.LMStudioClient;
import OpenAI from 'openai';
import { config } from 'dotenv';
import { quizSchema } from './constants.mjs';
config();

// // LM studio mimics the OpenAI API
// const openai = new OpenAI({
//     baseURL: "http://localhost:1234/v1",
//     apiKey: 'lm-studio',
// })

const client = new LMStudioClient();

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
    const loadedModels = await client.llm.listLoaded();
    if (loadedModels.length === 0) {
        console.log("Model not loaded, loading model");
        await loadModel();
    }
    return await client.llm.get({});
}

async function predictQuiz(model, text) {
    const prediction = model.respond(
        [
            {
                role: "system", content: "You take in text and output\
             multiple choice quiz questions based on the text in JSON format.\
              Include a suitable amount of detail and questions depending\
               on the text. Also include a title. Tailor the quiz towards language learning. " },
            { role: "user", content: text },
        ],
        {
            maxPredictedTokens: 1000,
            structured: { type: 'json', jsonSchema: quizSchema },
        },
    );

    return prediction;
}

async function parseQuiz(prediction) {
    const result = await prediction;
    try {
        const parsed = JSON.parse(result.content);
        console.info("The questions are", parsed.questions);
        return parsed;
    } catch (e) {
        console.error(e);
    }
}

async function generateQuiz(text) {
    const model = await getModel();
    const prediction = await predictQuiz(model, text);
    const quiz = await parseQuiz(prediction);
    return quiz;
}

export { generateQuiz };