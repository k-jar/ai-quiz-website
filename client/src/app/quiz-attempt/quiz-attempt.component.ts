import { Component, inject } from '@angular/core';
import { QuizAttemptService } from '../services/quiz-attempt.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { QuizService } from '../services/quiz.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-quiz-attempt',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule, MatButtonModule],
  templateUrl: './quiz-attempt.component.html',
  styleUrl: './quiz-attempt.component.css'
})
export class QuizAttemptComponent {
  attempts: any[] = [];
  userId: string = '';
  quizAttemptService: QuizAttemptService = inject(QuizAttemptService);
  authService: AuthService = inject(AuthService);
  quizService: QuizService = inject(QuizService);

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.userId;
      this.getAttempts();
    }
  }

  getAttempts() {
    this.quizAttemptService.getAttemptsByUserId(this.userId).subscribe((attempts: any[]) => {
      const quizObservables = attempts.map(attempt => 
        this.quizService.getQuizById(attempt.quiz).pipe(
          map(quiz => {
            return {...attempt, quizData: quiz};
          })
        )
      );
  
      forkJoin(quizObservables).subscribe(results => {
        this.attempts = results;
      });
    });
  }
}
