import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-play-quiz',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatButtonModule, MatRadioModule],
  templateUrl: './play-quiz.component.html',
  styleUrl: './play-quiz.component.css'
})
export class PlayQuizComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  quiz: Quiz | undefined;
  showQuestions: boolean = true;

  constructor() {
    const quizId = parseInt(this.route.snapshot.params['id'], 10);
    this.quizService.getQuizById(quizId).then((quiz) => {
      this.quiz = quiz;
    });
  }

  viewQuestions() {

  }

  submitQuiz() {

  }
}
