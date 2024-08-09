import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-update-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule
  ],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.css'
})
export class UpdateQuizComponent {
  quizForm!: FormGroup;
  quizId: string = '';
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      reading: ['', Validators.required],
      questions: this.fb.array([]),
    });

    this.quizId = this.route.snapshot.paramMap.get('id') || '';

    this.loadQuiz();
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

  loadQuiz() {
    if (this.quizId) {
      this.quizService.getQuizById(this.quizId).subscribe(
        (quiz: Quiz) => {
          this.quizForm.patchValue({
            title: quiz.title,
            reading: quiz.reading,
          });

          this.setQuestions(quiz.questions);
        },
        (error) => {
          console.error('Failed to load quiz:', error);
          alert('Failed to load quiz');
        }
      );
    }
  }

  setQuestions(questions: any[]) {
    const questionFGs = questions.map((question) =>
      this.fb.group({
        question: [question.question, Validators.required],
        options: this.fb.array(
          question.options.map((option: string) =>
            this.fb.control(option, Validators.required)
          )
        ),
        answer: [question.answer, Validators.required] // Store the index of the correct option
      })
    );
    const questionFormArray = this.fb.array(questionFGs);
    this.quizForm.setControl('questions', questionFormArray);
  }

  addQuestion() {
    const questionForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      answer: [null, Validators.required], // Set answer as null initially
    });
    this.questions.push(questionForm);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(optionIndex);

    // If the removed option was the correct answer, reset the answer index
    const answerControl = this.questions.at(questionIndex).get('answer');
    if (answerControl !== null && answerControl.value === optionIndex) {
      answerControl.setValue(null); // Reset the answer
    } else if (answerControl !== null && answerControl.value > optionIndex) {
      answerControl.setValue(answerControl.value - 1); // Adjust the answer index
    }
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const formValue = this.quizForm.value;

      // Adjust the answer field to ensure it holds the index of the correct option
      formValue.questions = formValue.questions.map((question: any) => ({
        ...question,
        answer: question.answer, // Store the index directly
      }));

      this.quizService.updateQuiz(this.quizId, formValue).subscribe(
        () => {
          alert('Quiz updated successfully');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Failed to update quiz:', error);
          alert('Failed to update quiz');
        }
      );
    }
  }
}
