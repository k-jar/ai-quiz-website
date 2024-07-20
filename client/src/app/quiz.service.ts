import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Quiz } from './quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:3000/api/quizzes';
  generateUrl = 'http://localhost:3000/api/generate-quiz';

  constructor(private http: HttpClient) { }

  async getAllQuizzes(): Promise<Quiz[]> {
    return lastValueFrom(this.http.get<Quiz[]>(this.url));
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    return lastValueFrom(this.http.get<Quiz>(`${this.url}/${id}`));
  }

  // Generate quiz
  async generateQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice:string): Promise<Quiz> {
    console.log('Generating quiz for text:', text);
    return lastValueFrom(this.http.post<Quiz>(this.generateUrl, { text, numQuestions, questionLanguage, answerLanguage, modelChoice }));
  }

  // Add quiz
  async addQuiz(quiz: Quiz): Promise<Quiz> {
    return lastValueFrom(this.http.post<Quiz>(this.url, quiz));
  }

  async generateAndAddQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice:string): Promise<Quiz> {
    const quiz = await this.generateQuiz(text, numQuestions, questionLanguage, answerLanguage, modelChoice);
    console.log('Generated quiz:', quiz);
    return await this.addQuiz(quiz);
  }
}
