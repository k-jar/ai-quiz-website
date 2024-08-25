import { Component } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base.component';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-multiple-choice-question',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    MatExpansionModule
  ],
  templateUrl: './multiple-choice-question.component.html',
  styleUrl: './multiple-choice-question.component.css'
})
export class MultipleChoiceQuestionComponent extends QuestionBaseComponent{
  isAnswerCorrect(): boolean {
    console.log(this.userAnswer);
    console.log(this.question);
    return this.userAnswer === this.question.answer;
  }
}
