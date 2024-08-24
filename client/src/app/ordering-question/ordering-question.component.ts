import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base.component';

@Component({
  selector: 'app-ordering-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordering-question.component.html',
  styleUrl: './ordering-question.component.css'
})
export class OrderingQuestionComponent extends QuestionBaseComponent {
  isAnswerCorrect(): boolean {
    // Update this
    return false
  }
}
