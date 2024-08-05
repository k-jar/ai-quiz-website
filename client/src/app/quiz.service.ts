import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, switchMap } from 'rxjs';
import { Quiz } from './quiz';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  url = 'http://localhost:3000/api/quizzes';
  generateUrl = 'http://localhost:3000/api/generate-quiz';
  authUrl = 'http://localhost:3000/api/auth';

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

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.url);
  }

  getQuizById(id: string): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.url}/${id}`);
  }

  getUsernames(userIds : string[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.authUrl}/usernames`, { userIds });
  }

  // Generate quiz
  generateQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice: string): Observable<Quiz> {
    console.log('Generating quiz for text:', text);

    const headers = this.createAuthHeaders();

    // Body of the request
    const body = {
      text,
      numQuestions,
      questionLanguage,
      answerLanguage,
      modelChoice,
    };

    return this.http.post<Quiz>(this.generateUrl, body, { headers });
  }

  // Add quiz
  addQuiz(quiz: Quiz): Observable<Quiz> {
    const headers = this.createAuthHeaders();
    return this.http.post<Quiz>(this.url, quiz, { headers });
  }

  // Generate and add quiz
  generateAndAddQuiz(text: string, numQuestions: number, questionLanguage: string, answerLanguage: string, modelChoice: string): Observable<Quiz> {
    return this.generateQuiz(text, numQuestions, questionLanguage, answerLanguage, modelChoice).pipe(
      switchMap(quiz => {
        const createdBy = this.authService.getCurrentUser().userId;
        quiz.createdBy = createdBy;
        console.log(quiz.createdBy);
        return this.addQuiz(quiz);
      })
    );
  }
}
