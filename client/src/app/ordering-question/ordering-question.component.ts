import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base.component';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-ordering-question',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    FormsModule,
    MatExpansionModule,
  ],
  templateUrl: './ordering-question.component.html',
  styleUrl: './ordering-question.component.css',
})
export class OrderingQuestionComponent extends QuestionBaseComponent {
  ngOnInit(): void {
    // Shuffle the options so that they are not in the correct order
    this.userAnswer = this.shuffle([...this.question.options.keys()]);
  }

  isAnswerCorrect(): boolean {
    return this.userAnswer.every((value: any, index: any) => value === index);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.userAnswer, event.previousIndex, event.currentIndex);
    this.answerChange.emit(this.userAnswer);
  }

  shuffle(array: any[]): any[] {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  getOptionText(index: number): string {
    return this.question.options[index];
  }
}
