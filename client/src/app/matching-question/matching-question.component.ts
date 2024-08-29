import { Component } from '@angular/core';
import { QuestionBaseComponent } from '../question-base/question-base.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-matching-question',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatExpansionModule, MatButtonModule],
  templateUrl: './matching-question.component.html',
  styleUrl: './matching-question.component.css'
})
export class MatchingQuestionComponent extends QuestionBaseComponent {
  selectedPairs: { left: string, right: string }[] = [];
  selectedLeft: string | null = null;
  selectedRight: string | null = null;
  shuffledPairs: { left: string, right: string }[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    const leftSide = this.question.pairs.map((pair: { left: string, right: string }) => pair.left);
    const rightSide = this.question.pairs.map((pair: { left: string, right: string }) => pair.right);
  
    this.shuffle(leftSide);
    this.shuffle(rightSide);
  
    this.shuffledPairs = leftSide.map((left : string, index : number) => ({ left, right: rightSide[index] }));
  }

  shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  selectLeft(left: string) {
    this.selectedLeft = left;
    if (this.selectedRight) {
      this.onPairSelected(this.selectedLeft, this.selectedRight);
      this.selectedLeft = null;
      this.selectedRight = null;
    }
  }

  selectRight(right: string) {
    this.selectedRight = right;
    if (this.selectedLeft) {
      this.onPairSelected(this.selectedLeft, this.selectedRight);
      this.selectedLeft = null;
      this.selectedRight = null;
    }
  }

  onPairSelected(left: string, right: string) {
    const pair = { left, right };
    this.selectedPairs.push(pair);
    this.onAnswerSelected(this.selectedPairs);
  }

  isAnswerCorrect(): boolean {
    if (!this.userAnswer || !Array.isArray(this.userAnswer)) {
      return false;
    }

    return this.userAnswer.every((pair: any) => {
      return this.question.pairs.some((qPair: any) => {
        return qPair.left === pair.left && qPair.right === pair.right;
      });
    });
  }

  isMatched(option: string): boolean {
    return this.selectedPairs.some(pair => pair.left === option || pair.right === option);
  }

  // This is so the user can identify which options are matched
  getMatchNumber(option: string): number {
    return this.selectedPairs.findIndex(pair => pair.left === option || pair.right === option) + 1;
  }

  // Allows the user to undo their chosen pairs
  localReset() {
    this.selectedPairs = [];
    this.selectedLeft = null;
    this.selectedRight = null;
  }

  override reset() {
    super.reset();
    this.localReset();
  }
}
