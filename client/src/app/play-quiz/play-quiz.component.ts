import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../quiz';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { QuizAttemptService } from '../services/quiz-attempt.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-play-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './play-quiz.component.html',
  styleUrl: './play-quiz.component.css',
})
export class PlayQuizComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  quizAttemptService: QuizAttemptService = inject(QuizAttemptService);
  snackbarService: SnackbarService = inject(SnackbarService);
  quiz: Quiz | undefined;
  showQuestions: boolean = false;
  userAnswers: number[] = [];
  score: number = 0;
  questionResults: boolean[] = [];
  quizSubmitted: boolean = false;
  userId: string = '';
  quizId: string = '';
  dialog: MatDialog = inject(MatDialog);
  authService: AuthService = inject(AuthService);

  ngOnInit() {
    this.quizId = this.route.snapshot.params['id'];
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        if (quiz) {
          this.userAnswers = new Array(quiz.questions.length).fill(null);
        }
      },
    });
  }

  viewQuestions() {
    this.showQuestions = true;
  }

  submitQuiz() {
    if (!this.quiz) {
      return;
    }
    this.quizSubmitted = true;
    const correctAnswers = this.quiz.questions.map((q) => q.answer);
    this.questionResults = this.userAnswers.map(
      (answer, index) => answer === correctAnswers[index]
    );
    this.score = this.questionResults.filter((result) => result).length;

    this.submitQuizAttempt();
  }

  submitQuizAttempt() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.userId;
    }
    const attempt = {
      userId: this.userId,
      quizId: this.quizId,
      score: this.score,
    };

    this.quizAttemptService.createAttempt(attempt).subscribe({
      next: (response) => {
        this.snackbarService.show('Quiz attempt saved successfully');
      },
      error: (error) => {
        console.error('Error saving quiz attempt', error);
        this.snackbarService.show('Failed to save quiz attempt');
      },
    });
  }

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.submitQuiz();
        }
      },
    });
  }

  resetQuiz() {
    this.userAnswers = Array(this.quiz?.questions?.length).fill(null);
    this.questionResults = [];
    this.score = 0;
    this.quizSubmitted = false;
  }
}
