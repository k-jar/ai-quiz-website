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
import { SnackbarService } from '../services/snackbar.service';
import { MatSelectModule } from '@angular/material/select';
import { MultipleChoiceQuestionFormComponent } from '../multiple-choice-question-form/multiple-choice-question-form.component';
import { OrderingQuestionFormComponent } from '../ordering-question-form/ordering-question-form.component';
import { MatchingQuestionFormComponent } from '../matching-question-form/matching-question-form.component';

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
    MatSelectModule,
    MultipleChoiceQuestionFormComponent,
    OrderingQuestionFormComponent,
    MatchingQuestionFormComponent
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
        type: [question.type || 'multiple-choice', Validators.required],
        question: [question.question, [Validators.required, Validators.minLength(1)]],
        pairs: question.type === 'matching' ? this.fb.array(
          question.pairs.map((pair: any) =>
            this.fb.group({
              left: [pair.left, Validators.required],
              right: [pair.right, Validators.required]
            })
          )
        ) : this.fb.array([]),
        options: question.type === 'multiple-choice' ? this.fb.array(
          question.options.map((option: string) =>
            this.fb.control(option, [Validators.required, Validators.minLength(1)])
          )
        ) : this.fb.array([]),
        answer: this.getAnswerControl(question),
      })
    );
    const questionFormArray = this.fb.array(questionFGs);
    this.quizForm.setControl('questions', questionFormArray);
  }
  
  
  getAnswerControl(question: any) {
    if (question.type === 'multiple-choice') {
      return this.fb.control(question.answer);
    } else if (question.type === 'ordering') {
      return null;
    } else if (question.type === 'matching') {
      return null;
    } else {
      return null;
    }
  }

  addQuestion() {
    const questionForm = this.fb.group({
      type: ['multiple-choice', Validators.required],
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      answer: this.fb.control(null),
    });
    this.questions.push(questionForm);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // addOption(questionIndex: number) {
  //   const options = this.questions
  //     .at(questionIndex)
  //     .get('options') as FormArray;
  //   options.push(this.fb.control('', Validators.required));
  // }

  // removeOption(questionIndex: number, optionIndex: number) {
  //   const options = this.questions
  //     .at(questionIndex)
  //     .get('options') as FormArray;
  //   options.removeAt(optionIndex);

  //   const answerControl = this.questions.at(questionIndex).get('answer');
  //   if (answerControl !== null && Array.isArray(answerControl.value)) {
  //     answerControl.setValue(answerControl.value.filter((val: number) => val !== optionIndex));
  //   } else if (answerControl !== null && answerControl.value === optionIndex) {
  //     answerControl.setValue(null);
  //   } else if (answerControl !== null && answerControl.value > optionIndex) {
  //     answerControl.setValue(answerControl.value - 1);
  //   }
  // }

  // getOptions(questionIndex: number): FormArray {
  //   return this.questions.at(questionIndex).get('options') as FormArray;
  // }

  getQuestionFormGroup(index: number): FormGroup {
    return this.questions.at(index) as FormGroup;
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const formValue = this.quizForm.value;
      formValue.questions = formValue.questions.map((question: any) => {
        console.log(question);
        if (question.type === 'multiple-choice' && !question.answer) {
          this.snackbarService.show('Please provide an answer for all multiple choice questions');
        }
        return question;
      });
      console.log("quizForm Value", this.quizForm.value);
      console.log("Form Value", formValue);
      this.submitQuiz.emit(formValue);
    }
    else {
      this.snackbarService.show('Please fill out all required fields');
    }
  }
}
