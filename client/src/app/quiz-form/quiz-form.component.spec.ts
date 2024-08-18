import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFormComponent } from './quiz-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';
import { SnackbarService } from '../snackbar.service';

describe('QuizFormComponent', () => {
  let component: QuizFormComponent;
  let fixture: ComponentFixture<QuizFormComponent>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;


  beforeEach(async () => {
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);

    await TestBed.configureTestingModule({
      imports: [QuizFormComponent, BrowserAnimationsModule],
      providers: [
        { provide: SnackbarService, useValue: snackbarServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.quizForm).toBeDefined();
    expect(component.quizForm.get('title')).toBeDefined();
    expect(component.quizForm.get('reading')).toBeDefined();
    expect(component.quizForm.get('questions')).toBeDefined();
  });

  it('should add question', () => {
    component.addQuestion();
    expect(component.questions.length).toBe(1);
  });

  it('should remove question', () => {
    component.addQuestion();
    component.removeQuestion(0);
    expect(component.questions.length).toBe(0);
  });

  it('should add option to a question', () => {
    component.addQuestion();
    component.addOption(0);
    expect(component.getOptions(0).length).toBe(5); // Assuming there are 4 options by default
  });

  it('should remove option from a question', () => {
    component.addQuestion();
    component.removeOption(0, 0);
    expect(component.getOptions(0).length).toBe(3); // Assuming there are 4 options by default
  });

  it('should initialize form with quiz data', () => {
    component.quiz = {
      _id: 'testId',
      createdBy: 'testUser',
      username: 'testUser',
      title: 'Test Quiz',
      reading: 'Test Reading',
      questions: [
        {
          question: 'Test Question',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          answer: 0
        }
      ]
    };
    component.ngOnChanges({quiz: new SimpleChange(null, component.quiz, true)});
    expect(component.quizForm!.get('title')!.value).toBe('Test Quiz');
    expect(component.quizForm!.get('reading')!.value).toBe('Test Reading');
    expect(component.questions.length).toBe(1);
  });

  it('should error on submission with invalid form', () => {
    spyOn(component.submitQuiz, 'emit');
    component.onSubmit();

    // Expect there to be no snack bar message
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Please fill out all required fields');
    expect(component.submitQuiz.emit).not.toHaveBeenCalled();
  });

  it('should emit form value on submission of valid form', () => {
    const submitQuizSpy = spyOn(component.submitQuiz, 'emit');
    component.addQuestion();
    component.quizForm.setValue({
      title: 'Test Quiz',
      reading: 'Test Reading',
      questions: [
        {
          question: 'Test Question',
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          answer: 0
        }
      ]
    });
  
    component.onSubmit();
  
    expect(submitQuizSpy).toHaveBeenCalledWith(jasmine.any(Object));
  });
});
