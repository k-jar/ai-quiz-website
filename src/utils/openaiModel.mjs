import OpenAI from 'openai';
import { quizSchema } from './constants.mjs';
import { config } from 'dotenv';
config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
export async function generateQuizWithOpenAI(text, numQuestions, questionLanguage, answerLanguage) {
try {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": `Generate ${numQuestions} multiple choice quiz questions in ${questionLanguage} (answers in ${answerLanguage}) from the provided text, formatted in JSON with title, questions, options, and answers. The JSON schmema should be as follows: ${quizSchema}`
      },
      {
        "role": "user",
        "content": text
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    response_format: { type: "json_object" },
  });
    console.log(response)
    return response.choices[0].message.content;
} catch (error) {
    console.error('Error calling OpenAI API:', error);
}
}
