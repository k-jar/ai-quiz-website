import { Component } from '@angular/core';
import { QuestionFormBaseComponent } from '../question-form-base/question-form-base.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-multiple-choice-question-form',
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
  ],
  templateUrl: './multiple-choice-question-form.component.html',
  styleUrl: './multiple-choice-question-form.component.css',
})
export class MultipleChoiceQuestionFormComponent extends QuestionFormBaseComponent {
  constructor(fb: FormBuilder) {
    super(fb);
  }
}
