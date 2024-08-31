import { Component } from '@angular/core';
import { QuestionFormBaseComponent } from '../question-form-base/question-form-base.component';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-matching-question-form',
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
  ],
  templateUrl: './matching-question-form.component.html',
  styleUrl: './matching-question-form.component.css',
})
export class MatchingQuestionFormComponent extends QuestionFormBaseComponent {
  constructor(fb: FormBuilder) {
    super(fb);
  }

  addPair() {
    this.pairs.push(this.fb.group({
      left: ['', Validators.required],
      right: ['', Validators.required]
    }));
  }

  removePair(index: number) {
    this.pairs.removeAt(index);
  }

  get pairs(): FormArray {
    return this.questionForm.get('pairs') as FormArray;
  }
}
