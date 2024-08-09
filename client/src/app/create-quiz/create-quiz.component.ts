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
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    MatSelectModule,
    MatSliderModule,
    FormsModule,
    ClipboardModule,
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  modelChoice = 'none'; // Options: 'none', 'lm', 'openai'
  numQuestions = 5;
  questionLanguage = 'Japanese';
  answerLanguage = 'Japanese';
  quizService: QuizService = inject(QuizService);
  public prompt: string = '';
  public reading: string = '';
  public quizTemplate: string = `{
    "title": "",
    "reading": "",
    "questions": [
      {
        "question": "",
        "options": ["", "", "", ""],
        "answer": number // index of correct answer in options
      }
    ]
  }`;

  constructor() {}

  ngOnInit() {
    this.prompt = `Generate ${this.numQuestions} multiple choice quiz questions in ${this.questionLanguage} (options should be in ${this.answerLanguage}) from the provided text, formatted in JSON with title, questions, options, and answers. The JSON schema should be as follows: ${this.quizTemplate}`;
  }

  updatePrompt() {
    this.prompt = `Generate ${this.numQuestions} multiple choice quiz questions in ${this.questionLanguage} (answers in ${this.answerLanguage}) from the provided text: ${this.reading}, formatted in JSON with title, questions, options, and answers. The JSON schema should be as follows: ${this.quizTemplate}`;
  }

  onSettingsChange() {
    this.updatePrompt();
  }

  submitText(text: string) {
    console.log(
      'Text:',
      text,
      'NumQ:',
      this.numQuestions,
      'Qlang:',
      this.questionLanguage,
      'Alang:',
      this.answerLanguage,
      'Model:',
      this.modelChoice
    );
    this.quizService
      .generateAndAddQuiz(
        text,
        this.numQuestions,
        this.questionLanguage,
        this.answerLanguage,
        this.modelChoice
      )
      .subscribe(
        (quiz) => {
          console.log('Quiz added:', quiz);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
