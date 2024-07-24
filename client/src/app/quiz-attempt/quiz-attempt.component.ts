import { Component } from '@angular/core';
import { QuizAttemptService } from '../quiz-attempt.service';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { QuizService } from '../quiz.service';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private quizAttemptService: QuizAttemptService, private authService: AuthService, private quizService: QuizService) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.userId;
      this.getAttempts();
    }
  }

getAttempts() {
  this.quizAttemptService.getAttemptsByUserId(this.userId).subscribe((attempts: any[]) => {
    this.attempts = attempts;
    this.attempts.forEach(attempt => {
      this.quizService.getQuizById(attempt.quiz).then(quiz => {
        attempt.quizData = quiz;
      });
    });
  });
}
}
