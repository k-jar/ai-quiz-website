export interface Quiz {
    createdBy: any;
    _id: string;
    title: string;
    reading: string;
    questions: Question[];
    username: string;
}

interface Question {
    question: string;
    options: string[];
    answer: number;
}