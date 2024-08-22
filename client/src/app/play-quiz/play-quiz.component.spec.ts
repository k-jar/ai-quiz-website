import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayQuizComponent } from './play-quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from '../quiz';
import { QuizService } from '../services/quiz.service';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { QuizAttemptService } from '../services/quiz-attempt.service';

describe('PlayQuizComponent', () => {
  let component: PlayQuizComponent;
  let fixture: ComponentFixture<PlayQuizComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quizAttemptServiceSpy: jasmine.SpyObj<QuizAttemptService>;

  let mockQuiz: Quiz = {
    _id: 'quiz1',
    title: 'Mock Quiz',
    reading: 'Mock Reading',
    username: 'Test user',
    createdBy: '123',
    questions: [
      { question: 'Question 1', options: ['Option 1', 'Option 2'], answer: 0 },
      { question: 'Question 2', options: ['Option 1', 'Option 2'], answer: 1 },
    ],
  };
  let mockActivatedRoute: any = {
    snapshot: {
      params: {
        id: 'quiz1',
      },
    },
  };

  beforeEach(async () => {
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getQuizById']);
    quizServiceSpy.getQuizById.and.returnValue(of(mockQuiz));

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    quizAttemptServiceSpy = jasmine.createSpyObj('QuizAttemptService', ['createAttempt']);

    await TestBed.configureTestingModule({
      imports: [PlayQuizComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: QuizAttemptService, useValue: quizAttemptServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayQuizComponent);
    component = fixture.componentInstance;
    component.quiz = mockQuiz;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with a quiz', () => {
    expect(component.quiz).toEqual(mockQuiz);
  });

  it('should view questions', () => {
    component.viewQuestions();
    expect(component.showQuestions).toBeTrue();
  });

  it('should submit a quiz', () => {
    const mockAttempt = { userId: '123', quizId: 'quiz1', score: 2 };
    authServiceSpy.getCurrentUser.and.returnValue({ userId: '123' });
    quizAttemptServiceSpy.createAttempt.and.returnValue(of(mockAttempt));

    component.userAnswers = [0, 1];
    component.submitQuiz();
    expect(component.quizSubmitted).toBeTrue();
    expect(component.questionResults).toEqual([true, true]);
    expect(component.score).toEqual(2);
  });

  it('should reset a quiz', () => {
    const mockAttempt = { userId: '123', quizId: 'quiz1', score: 2 };
    authServiceSpy.getCurrentUser.and.returnValue({ userId: '123' });
    quizAttemptServiceSpy.createAttempt.and.returnValue(of(mockAttempt));

    component.userAnswers = [0, 1];
    component.submitQuiz();
    component.resetQuiz();
    expect(component.questionResults).toEqual([]);
    expect(component.score).toEqual(0);
    expect(component.quizSubmitted).toBeFalse();
  });
});
