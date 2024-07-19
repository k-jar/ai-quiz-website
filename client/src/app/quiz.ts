export interface Quiz {
    _id: string;
    title: string;
    reading: string;
    questions: Question[];
}

interface Question {
    question: string;
    options: string[];
    answer: string;
}