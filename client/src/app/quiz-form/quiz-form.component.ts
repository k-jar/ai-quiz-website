import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-quiz-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
  ],
  templateUrl: './quiz-form.component.html',
  styleUrl: './quiz-form.component.css',
})
export class QuizFormComponent {
  @Input() quiz: Quiz | null = null;
  @Output() submitQuiz = new EventEmitter<Quiz>();

  quizForm!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  snackbarService: SnackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.initForm();
    if (this.quiz) {
      this.setQuestions(this.quiz.questions);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quiz'] && this.quiz) {
      this.initForm(); // Reinitialize the form with new data
    }
  }

  private initForm(): void {
    this.quizForm = this.fb.group({
      title: [this.quiz?.title || '', [Validators.required, Validators.minLength(1)]],
      reading: [this.quiz?.reading || '', [Validators.required, Validators.minLength(1)]],
      questions: this.fb.array([], [Validators.required, Validators.minLength(1)]),
    });
  
    if (this.quiz && this.quiz.questions) {
      this.setQuestions(this.quiz.questions);
    }
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

  setQuestions(questions: any[]) {
    const questionFGs = questions.map((question) =>
      this.fb.group({
        question: [question.question, [Validators.required, Validators.minLength(1)]],
        options: this.fb.array(
          question.options.map((option: string) =>
            this.fb.control(option, [Validators.required, Validators.minLength(1)])
          )
        ),
        answer: [question.answer, [Validators.required, Validators.minLength(1)]],
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
      answer: [null, Validators.required],
    });
    this.questions.push(questionForm);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const options = this.questions
      .at(questionIndex)
      .get('options') as FormArray;
    options.removeAt(optionIndex);

    const answerControl = this.questions.at(questionIndex).get('answer');
    if (answerControl !== null && answerControl.value === optionIndex) {
      answerControl.setValue(null);
    } else if (answerControl !== null && answerControl.value > optionIndex) {
      answerControl.setValue(answerControl.value - 1);
    }
  }

  getOptions(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const formValue = this.quizForm.value;
      formValue.questions = formValue.questions.map((question: any) => ({
        ...question,
        answer: question.answer,
      }));
      this.submitQuiz.emit(formValue);
    }
    else {
      this.snackbarService.show('Please fill out all required fields');
    }
  }
}
