import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-play-quiz',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatRadioModule, FormsModule, MatCardModule],
  templateUrl: './play-quiz.component.html',
  styleUrl: './play-quiz.component.css'
})
export class PlayQuizComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  quiz: Quiz | undefined;
  showQuestions: boolean = false;
  userAnswers: string[] = [];
  score: number = 0;
  questionResults: boolean[] = [];
  quizSubmitted: boolean = false;

  constructor(public dialog: MatDialog) { };

  ngOnInit() {
    const quizId = this.route.snapshot.params['id'];
    this.quizService.getQuizById(quizId).then((quiz) => {
      this.quiz = quiz;
      if (quiz) {
        this.userAnswers = new Array(quiz.questions.length).fill('');
      }
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
    const correctAnswers = this.quiz.questions.map(q => q.answer);
    this.questionResults = this.userAnswers.map((answer, index) => answer === correctAnswers[index]);
    this.score = this.userAnswers.filter((answer, index) => answer === correctAnswers[index]).length;
  }

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.submitQuiz();
      }
    });
  }

  resetQuiz() {
    this.userAnswers = Array(this.quiz?.questions?.length).fill(null);
    this.questionResults = [];
    this.score = 0;
    this.quizSubmitted = false;
  }

}