import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { QuizService } from '../services/quiz.service';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTabsModule } from '@angular/material/tabs';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { Router } from '@angular/router';
import { Quiz } from '../quiz';
import { SnackbarService } from '../services/snackbar.service';

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
    QuizFormComponent,
    ReactiveFormsModule
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
  readingControl = new FormControl('', Validators.required);
  public prompt: string = '';
  
  private readonly quizTemplate: string = `{
    "title": "",
    "questions": [
      {
        "type": "multiple-choice",
        "question": "",
        "options": ["", "", "", ""],
        "answer": 0
      },
      {
        "type": "matching",
        "question": "",
        "options": [
          { "left": "", "right": "" },
          { "left": "", "right": "" }
        ]
      },
      {
        "type": "ordering",
        "question": "",
        "options": ["", "", ""]
      }
    ]
  }`;


  ngOnInit() {
    this.updatePrompt(); // Initialize the prompt on load
  }

  private generatePrompt(): string {
    const basePrompt = `Create ${this.numQuestions} quiz questions in ${this.questionLanguage} (options in ${this.answerLanguage}).`;
    const textSource = this.readingControl.value ? ` Text: "${this.readingControl.value}".` : '';
    const details = `Based on the text, choose appropriate question types (multiple-choice, matching, ordering).`;
  
    return `${basePrompt}${textSource} ${details} Format in JSON based on this schema: ${this.quizTemplate}`;
  }

  updatePrompt() {
    this.prompt = this.generatePrompt();
  }

  onTabChange(index: number) {
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
    // console.log(
    //   'Text:',
    //   text,
    //   'NumQ:',
    //   this.numQuestions,
    //   'Qlang:',
    //   this.questionLanguage,
    //   'Alang:',
    //   this.answerLanguage,
    //   'Model:',
    //   this.modelChoice
    // );
    if (this.modelChoice === 'none') {
      try {
        const quiz: Quiz = JSON.parse(text);
        quiz.reading = this.readingControl.value ?? '';
        this.quizService.addQuiz(quiz).subscribe(
          () => {
            this.snackbarService.show('Quiz created successfully');
          },
          (error) => {
            console.error('Failed to create quiz:', error);
            this.snackbarService.show('Failed to create quiz');
          }
        );
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        this.snackbarService.show('Failed to parse JSON');
      }
    } else {
      this.quizService
        .generateAndAddQuiz(
          text,
          this.numQuestions,
          this.questionLanguage,
          this.answerLanguage,
          this.modelChoice
        )
        .subscribe({
          next: (quiz) => {
            console.log('Quiz added:', quiz);
            this.snackbarService.show('Quiz created successfully');
          },
          error: (error) => {
            console.error('Error:', error);
            this.snackbarService.show('Failed to create quiz');
          },
        });
    }
  }
}
