import OpenAI from 'openai';
import { quizSchema } from './constants.mjs';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
export async function generateQuizWithOpenAI(text, numQuestions, questionLanguage, answerLanguage) {
try {
  // const basePrompt = `Create ${numQuestions} quiz questions in ${questionLanguage} (options in ${answerLanguage}).`;
  // const details = `Based on the text, choose appropriate question types (multiple-choice, matching, ordering).`;
  // const prompt = `${basePrompt} ${details} Format in JSON based on this schema:`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        "role": "system",
        "content": prompt
      },
      {
        "role": "user",
        "content": text
      }
    ],
    temperature: 0.7,
    max_tokens: 1500,
    top_p: 1,
    response_format: { type: "json_object" },
  });
    console.log("OpenAI response:", response);
    return response.choices[0].message.content;
} catch (error) {
    console.error('Error calling OpenAI API:', error);
}
}
