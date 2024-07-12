import { Injectable } from '@angular/core';
import { Quiz } from './quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:3000/api/quizzes';
  generateUrl = 'http://localhost:3000/api/generate-quiz';

  // Consider HttpClient instead of fetch
  async getAllQuizzes(): Promise<Quiz[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
  async getQuizById(id: number): Promise<Quiz | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  // Generate quiz
  async generateQuiz(text: string): Promise<Quiz> {
    console.log('Generating quiz for text:', text);
    const response = await fetch(this.generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });
    return await response.json();
  }

  // Add quiz
  async addQuiz(quiz: Quiz): Promise<Quiz> {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quiz)
    });
    return await response.json();
  }

  async generateAndAddQuiz(text: string): Promise<Quiz> {
    const quiz = await this.generateQuiz(text);
    console.log('Generated quiz:', quiz);
    return await this.addQuiz(quiz);
  }
}
