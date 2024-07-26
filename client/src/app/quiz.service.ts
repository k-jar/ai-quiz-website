import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Quiz } from './quiz';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:3000/api/quizzes';
  generateUrl = 'http://localhost:3000/api/generate-quiz';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    // Retrieve token from local storage
    const token = this.authService.getToken();
  
    // Create headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return headers;
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    return lastValueFrom(this.http.get<Quiz[]>(this.url));
  }

  async getQuizById(id: string): Promise<Quiz | undefined> {
    return lastValueFrom(this.http.get<Quiz>(`${this.url}/${id}`));
  }

  // Generate quiz
  async generateQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice: string): Promise<Quiz> {
    console.log('Generating quiz for text:', text);

    const headers = this.createAuthHeaders();

    const createdBy = this.authService.getCurrentUser().userId;
    console.log('Created by:', createdBy);

    // Body of the request
    const body = {
      text,
      numQuestions,
      questionLanguage,
      answerLanguage,
      modelChoice,
      createdBy
    };

    return lastValueFrom(this.http.post<Quiz>(this.generateUrl, body, { headers }));
  }

  // Add quiz
  async addQuiz(quiz: Quiz): Promise<Quiz> {
    const headers = this.createAuthHeaders();
    return lastValueFrom(this.http.post<Quiz>(this.url, quiz, { headers }));
  }

  // Generate and add quiz
  async generateAndAddQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice: string): Promise<Quiz> {
    const quiz = await this.generateQuiz(text, numQuestions, questionLanguage, answerLanguage, modelChoice);
    console.log('Generated quiz:', quiz);
    return await this.addQuiz(quiz);
  }
}
