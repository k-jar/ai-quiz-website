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
import { MatTabsModule } from '@angular/material/tabs';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { Router } from '@angular/router';
import { Quiz } from '../quiz';
import { SnackbarService } from '../snackbar.service';

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
    MatTabsModule,
    QuizFormComponent
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent {
  formChoiceIndex = 0;
  modelChoice = 'none'; // Options: 'none', 'lm', 'openai'
  numQuestions = 5;
  questionLanguage = 'Japanese';
  answerLanguage = 'Japanese';
  quizService: QuizService = inject(QuizService);
  router: Router = inject(Router);
  snackbarService: SnackbarService = inject(SnackbarService);
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

  onTabChange(index: number){
    this.formChoiceIndex = index;
    this.modelChoice = index === 0 ? 'none' : 'lm';
  }

  onSettingsChange() {
    this.updatePrompt();
  }

  onSubmitQuiz(formValue: Quiz) {
    this.quizService.addQuiz(formValue).subscribe(
      () => {
        this.snackbarService.show('Quiz created successfully');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Failed to create quiz:', error);
        this.snackbarService.show('Failed to create quiz');
      }
    );
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
          this.snackbarService.show('Quiz created successfully');
        },
        (error) => {
          console.error('Error:', error);
          this.snackbarService.show('Failed to create quiz');
        }
      );
  }
}
