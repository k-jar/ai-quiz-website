import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth.service';
import { QuizEventsService } from '../quiz-events.service';
import { QuizService } from '../quiz.service';
import { SnackbarService } from '../snackbar.service';
import { EMPTY, Subject, of, throwError } from 'rxjs';
import { Quiz } from '../quiz';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { QuizComponent } from '../quiz/quiz.component';

let mockActivatedRoute = {
  queryParams: of({ reason: 'test-reason' }),
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quizEventsServiceSpy: jasmine.SpyObj<QuizEventsService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  const users = [
    { _id: 'user1', username: 'User1' },
    { _id: 'user2', username: 'User2' },
  ];

  const quizzes: Quiz[] = [
    {
      createdBy: 'user1', // createdBy is user id
      _id: '1',
      title: 'Test Quiz',
      reading: 'Test Reading',
      questions: [
        {
          question: 'Test Question',
          options: ['A', 'B', 'C'],
          answer: 1,
        },
      ],
      username: 'User1',
    },
    {
      createdBy: 'user2',
      _id: '2',
      title: 'Test Quiz 2',
      reading: 'Test Reading 2',
      questions: [
        {
          question: 'Test Question 2',
          options: ['A', 'B', 'C'],
          answer: 1,
        },
      ],
      username: 'User2',
    },
  ];

  beforeEach(async () => {
    quizServiceSpy = jasmine.createSpyObj('QuizService', [
      'getAllQuizzes',
      'getUsernames',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getToken',
      'getCurrentUser',
    ]);
    authServiceSpy.getToken.and.returnValue('testToken');

    quizEventsServiceSpy = jasmine.createSpyObj('QuizEventsService', [], {
      quizDeleted$: new Subject<void>().asObservable(),
    });
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);
    quizServiceSpy.getAllQuizzes.and.returnValue(of([]));
    quizServiceSpy.getUsernames.and.returnValue(of(users));
    authServiceSpy.getCurrentUser.and.returnValue({ userId: 'user1' });

    await TestBed.configureTestingModule({
      imports: [HomeComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: QuizEventsService, useValue: quizEventsServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quizzes', () => {
    const quizzesMock = [...quizzes];
    const usersMock = [...users];
    quizServiceSpy.getAllQuizzes.and.returnValue(of(quizzesMock));
    quizServiceSpy.getUsernames.and.returnValue(of(usersMock));

    component.loadQuizzes();

    expect(quizServiceSpy.getAllQuizzes).toHaveBeenCalled();
    expect(quizServiceSpy.getUsernames).toHaveBeenCalled();
    expect(component.myQuizList).toEqual(
      quizzesMock.filter((quiz) => quiz.createdBy === 'user1')
    );
    expect(component.otherQuizList).toEqual(
      quizzesMock.filter((quiz) => quiz.createdBy !== 'user1')
    );
  });

  it('should filter quizzes', () => {
    const searchTerm = 'Test Quiz';
    component.originalQuizList = [...quizzes];
    component.filterQuizzes(searchTerm);

    expect(component.myQuizList).toEqual(
      quizzes.filter(
        (quiz) => quiz.title.includes(searchTerm) && quiz.createdBy === 'user1'
      )
    );
    expect(component.otherQuizList).toEqual(
      quizzes.filter(
        (quiz) => quiz.title.includes(searchTerm) && quiz.createdBy !== 'user1'
      )
    );
  });

  it('should initialize', () => {
    const loadQuizzesSpy = spyOn(component, 'loadQuizzes');
    const quizDeletedSubscriptionSpy = spyOn(
      quizEventsServiceSpy.quizDeleted$,
      'subscribe'
    );

    component.ngOnInit();

    expect(loadQuizzesSpy).toHaveBeenCalled();
    expect(quizDeletedSubscriptionSpy).toHaveBeenCalled();
  });
});
