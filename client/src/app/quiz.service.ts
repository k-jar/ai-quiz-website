import { Injectable } from '@angular/core';
import { Quiz } from './quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:3000/api/quizzes';

  // Consider HttpClient instead of fetch
  async getAllQuizzes(): Promise<Quiz[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
  async getQuizById(id: number): Promise<Quiz | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }
}
