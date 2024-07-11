export interface Quiz {
    id: number;
    title: string;
    reading: string;
    questions: Question[];
}

interface Question {
    question: string;
    options: string[];
    answer: string;
}