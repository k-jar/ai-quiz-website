import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizAttemptService {
  private baseUrl = 'http://localhost:3000/api/quiz-attempts';

  constructor(private http: HttpClient) { }

  createAttempt(attempt: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, attempt);
  }

  getAttemptsByQuizId(quizId: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/quiz/${quizId}`);
  }

  getAttemptsByUserId(userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  getAttemptsByQuizIdAndUserId(quizId: string, userId: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/quiz/${quizId}/user/${userId}`);
  }

  // Get latest attempt for a quiz by a user
  getLatestAttempt(quizId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/quiz/${quizId}/user/${userId}/latest`);
  }
}
