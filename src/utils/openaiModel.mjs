import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { config } from "dotenv";
config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MultipleChoiceQuestion = z.object({
  type: z.literal("multiple-choice"),
  question: z.string(),
  options: z.array(z.string()),
  answer: z.number(),
});

const MatchingQuestion = z.object({
  type: z.literal("matching"),
  question: z.string(),
  options: z.array(z.object({ left: z.string(), right: z.string() })),
});

const OrderingQuestion = z.object({
  type: z.literal("ordering"),
  question: z.string(),
  options: z.array(z.string()),
});

const Quiz = z.object({
  title: z.string(),
  questions: z.array(
    z.union([MultipleChoiceQuestion, MatchingQuestion, OrderingQuestion])
  ),
});

export async function generateQuizWithOpenAI(
  text,
  numQuestions,
  questionLanguage,
  answerLanguage
) {
  try {
    const basePrompt = `Create ${numQuestions} quiz questions in ${questionLanguage} (options in ${answerLanguage}).`;
    const details = `Based on the text, choose appropriate question types (multiple-choice, matching, ordering).`;
    const prompt = `${basePrompt} ${details}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      response_format: zodResponseFormat(Quiz, "quiz"),
    });
    console.log("OpenAI response:", response);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
  }
}
