import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-question-base',
  standalone: true,
  imports: [],
  templateUrl: './question-base.component.html',
  styleUrl: './question-base.component.css'
})
export abstract class QuestionBaseComponent {
  @Input() question: any;
  @Input() userAnswer: any;
  @Input() disabled: boolean = false; // Disable input when the quiz is submitted
  @Input() showAnswer: boolean = false;

  @Output() answerChange = new EventEmitter<any>();

  abstract isAnswerCorrect(): boolean;

  onAnswerSelected(answer: any) {
    this.userAnswer = answer;
    this.answerChange.emit(this.userAnswer);
  }

  reset() {
    this.userAnswer = null;
    this.disabled = false;
  }
}
