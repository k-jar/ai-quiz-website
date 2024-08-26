import { Component } from '@angular/core';
import { QuestionFormBaseComponent } from '../question-form-base/question-form-base.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MultipleChoiceQuestionFormComponent } from '../multiple-choice-question-form/multiple-choice-question-form.component';

@Component({
  selector: 'app-ordering-question-form',
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
  ],
  templateUrl: './ordering-question-form.component.html',
  styleUrl: './ordering-question-form.component.css',
})
export class OrderingQuestionFormComponent extends QuestionFormBaseComponent {
  constructor(fb: FormBuilder) {
    super(fb);
  }
}
