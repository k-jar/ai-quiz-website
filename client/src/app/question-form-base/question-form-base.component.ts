import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
  FormsModule,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-question-form-base',
  standalone: true,
  imports: [],
  templateUrl: './question-form-base.component.html',
  styleUrl: './question-form-base.component.css',
})
export class QuestionFormBaseComponent {
  @Input() questionForm!: FormGroup;
  @Output() remove = new EventEmitter<void>();

  constructor(protected fb: FormBuilder) {}

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }
}
