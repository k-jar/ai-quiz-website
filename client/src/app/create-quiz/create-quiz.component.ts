import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { QuizService } from '../quiz.service';

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
    MatTooltip
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  quizService: QuizService = inject(QuizService);  // This is used in the template (create-quiz.component.html
  constructor() { }
  submitText(text: string) {
    this.quizService.generateAndAddQuiz(text);
  }
}
