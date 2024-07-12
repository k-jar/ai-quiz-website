export function addQuiz(mockQuizzes, title, reading, questions) {
    const newQuiz = {
        id: mockQuizzes.length + 1,
        title,
        reading,
        questions,
    };
    mockQuizzes.push(newQuiz);
    return newQuiz;
}