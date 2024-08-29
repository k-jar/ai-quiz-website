/*
mockQuizzes json structure:
[
    {
        "id": int,
        "title": string,
        "reading": string,
        "questions": [
            {
                "question": string,
                "options": [
                    string,
                    string,
                    string,
                    string
                ],
                "answer": string from options
            },
            ... more questions
        ]
    }
    ... more quizzes
]
*/

/* 
There is an additional reading property that is not generated by the model
so it is not included in the quizSchema.
*/
// export const quizSchema = {
//     type: "object",
//     properties: {
//         title: { type: "string" },
//         questions: {
//             type: "array",
//             items: {
//                 type: "object",
//                 properties: {
//                     question: { type: "string" },
//                     options: {
//                         type: "array",
//                         items: { type: "string" }
//                     },
//                     answer: { type: "number" } // Index of the correct answer in the options array
//                 },
//                 required: ["question", "options", "answer"]
//             },
//         }
//     },
//     required: ["questions"]
// };

// Compacter version of the schema
export const quizSchema = `
type QuizSchema = {
    title?: string;
    questions: {
        question: string;
        options: string[];
        answer: number; // Index of the correct answer in the options array
    }[];
};
`;

export const mockQuizzes = [
  {
    title: "Test Quiz",
    reading: "Test reading",
    questions: [
      {
        type: "multiple-choice",
        question: "Test question",
        options: ["A", "B", "C"],
        answer: 0,
      },
    ],
  },
  {
    title: "General Knowledge Quiz",
    reading: "Placeholder reading",
    questions: [
      {
        type: "multiple-choice",
        question: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: 0,
      },
      {
        type: "multiple-choice",
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: 1,
      },
      {
        type: "multiple-choice",
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          "William Shakespeare",
          "Charles Dickens",
          "J.K. Rowling",
          "Ernest Hemingway",
        ],
        answer: 0,
      },
    ],
  },
  {
    title: "Science Quiz",
    reading: "Placeholder reading",
    questions: [
      {
        type: "multiple-choice",
        question: "What is the chemical symbol for water?",
        options: ["H2O", "O2", "CO2", "NaCl"],
        answer: 0,
      },
      {
        type: "multiple-choice",
        question: "What planet is known as the Earth's twin?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        answer: 1,
      },
      {
        type: "multiple-choice",
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        answer: 2,
      },
    ],
  },
  {
    title: "Ordering Quiz",
    reading: "Placeholder reading",
    questions: [
      {
        type: "ordering",
        question: "Order the numbers in ascending order",
        options: ["1", "2", "3", "4"],
      },
      {
        type: "ordering",
        question: "Order the letters in alphabetical order",
        options: ["A", "B", "C", "D"],
      },
    ],
  },
  {
    title: "Matching quiz",
    reading: "Placeholder reading",
    questions: [
      {
        type: "matching",
        question: "Match the countries with their capitals",
        pairs: [
          { left: "France", right: "Paris" },
          { left: "Germany", right: "Berlin" },
          { left: "Spain", right: "Madrid" },
        ],
      },
    ],
  }
];

export const mockUsers = [
  {
    username: "admin",
    password: "password",
  },
];
