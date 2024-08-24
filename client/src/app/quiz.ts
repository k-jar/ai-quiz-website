export interface Quiz {
    _id: string;
    title: string;
    reading: string;
    questions: Question[];
    createdBy: any;
    username: string;
}

interface Question {
    type: string;
    question: string;
    options: string[];
    answer: number;
}