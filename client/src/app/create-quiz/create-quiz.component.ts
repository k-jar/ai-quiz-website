import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { QuizService } from '../quiz.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    MatSelectModule,
    MatSliderModule,
    FormsModule
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  numQuestions = 10;
  questionLanguage = 'jp';
  answerLanguage = 'jp';
  quizService: QuizService = inject(QuizService);  // This is used in the template (create-quiz.component.html

  constructor() { }

  submitText(text: string) {
    this.quizService.generateAndAddQuiz(text, this.numQuestions, this.questionLanguage, this.answerLanguage);
  }
}
