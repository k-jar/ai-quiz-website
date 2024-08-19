import { Component, Input, OnInit, inject } from '@angular/core';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizAttemptService } from '../quiz-attempt.service';
import { AuthService } from '../auth.service';
import { QuizService } from '../quiz.service';
import { QuizEventsService } from '../quiz-events.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet,
    MatCardModule, MatButtonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  @Input() quiz!: Quiz;
  attempt: any = null;
  loggedIn = false;
  userId: string | null = null;
  authService: AuthService = inject(AuthService);
  quizService: QuizService = inject(QuizService);
  quizAttemptService: QuizAttemptService = inject(QuizAttemptService);
  quizEventsService: QuizEventsService = inject(QuizEventsService);
  snackbarService: SnackbarService = inject(SnackbarService);
  router: Router = inject(Router);

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      if (loggedIn) {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.userId = currentUser.userId;
        }
        this.getLatestAttempt();
      }
    });
  }

  getLatestAttempt() {
    this.quizAttemptService.getLatestAttempt(this.quiz._id).subscribe({
      next: attempt => {
        this.attempt = attempt; // Assign the entire attempt to attempt
      },
      error: error => {
        console.error(error);
      }
    });
  }

  deleteQuiz(quizId: string) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      const token = this.authService.getToken();
      this.quizService.deleteQuiz(quizId).subscribe({
        next: () => {
          this.quizEventsService.notifyQuizDeleted();
          this.snackbarService.show('Quiz deleted successfully');
        },
        error: error => {
          console.error(error);
          this.snackbarService.show('Failed to delete quiz');
        }
      });
    }
  }

  updateQuiz(quizId: string) {
    this.router.navigate(['/update-quiz', quizId]);
  }
}
