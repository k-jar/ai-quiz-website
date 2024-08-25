export interface Quiz {
    _id: string;
    title: string;
    reading: string;
    questions: (MultipleChoiceQuestion | OrderingQuestion)[];
    createdBy: any;
    username: string;
}

interface Question {
    type: string;
    question: string;
    options: string[];
}

interface MultipleChoiceQuestion extends Question {
    answer: number;
}

interface OrderingQuestion extends Question {
}