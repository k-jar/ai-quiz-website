import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../auth.service';
import { QuizEventsService } from '../quiz-events.service';
import { QuizService } from '../quiz.service';
import { SnackbarService } from '../snackbar.service';
import { Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

let mockActivatedRoute = {
  queryParams: of({ reason: 'test-reason' }),
};
  
const mockQuizzes = [
  {
    title: 'Quiz 1', createdBy: 'user1',
    _id: '',
    reading: '',
    questions: [],
    username: 'Username 1'
  },
  {
    title: 'Quiz 2', createdBy: 'user1',
    _id: '',
    reading: '',
    questions: [],
    username: 'Username 1'
  },
  {
    title: 'Quiz 3', createdBy: 'user2',
    _id: '',
    reading: '',
    questions: [],
    username: 'Username 2'
  },
  {
    title: 'Quiz 4', createdBy: 'user2',
    _id: '',
    reading: '',
    questions: [],
    username: 'Username 2'
  }
];

const users = [
  { _id: 'user1', username: 'Username 1' },
  { _id: 'user2', username: 'Username 2' },
];


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let quizEventsServiceSpy: jasmine.SpyObj<QuizEventsService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

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
    quizServiceSpy.getAllQuizzes.and.returnValue(of(mockQuizzes));
    quizServiceSpy.getUsernames.and.returnValue(of(users));

    component.loadQuizzes();

    expect(quizServiceSpy.getAllQuizzes).toHaveBeenCalled();
    expect(quizServiceSpy.getUsernames).toHaveBeenCalled();
    expect(component.myQuizList).toEqual(
      mockQuizzes.filter((quiz) => quiz.createdBy === 'user1')
    );
    expect(component.otherQuizList).toEqual(
      mockQuizzes.filter((quiz) => quiz.createdBy !== 'user1')
    );
  });

  it('should filter myQuizList and otherQuizList when searchTerm is provided', () => {
    component.originalMyQuizList = mockQuizzes.filter((quiz) => quiz.createdBy === 'user1');
    component.originalOtherQuizList = mockQuizzes.filter((quiz) => quiz.createdBy === 'user2');
    component.user = { userId: 'user1' };

    component.filterQuizzes('Quiz 1');

    expect(component.myQuizList).toEqual(mockQuizzes.filter((quiz) => quiz.title === 'Quiz 1'));
    expect(component.otherQuizList).toEqual([]);
  });

  it('should reset myQuizList and otherQuizList when searchTerm is empty', () => {
    component.originalMyQuizList = mockQuizzes.filter((quiz) => quiz.createdBy === 'user1');
    component.originalOtherQuizList = mockQuizzes.filter((quiz) => quiz.createdBy === 'user2');
    component.user = { userId: 'user1' };

    component.filterQuizzes('');

    expect(component.myQuizList).toEqual(component.originalMyQuizList);
    expect(component.otherQuizList).toEqual(component.originalOtherQuizList);
  });

  it('should filter otherQuizList when searchTerm is provided and user is not defined', () => {
    component.originalOtherQuizList = mockQuizzes.filter((quiz) => quiz.createdBy === 'user2');
    component.user = null;

    component.filterQuizzes('Quiz 3');

    expect(component.otherQuizList).toEqual(mockQuizzes.filter((quiz) => quiz.title === 'Quiz 3'));
  });

  it('should call loadQuizzes and subscribe to quizDeleted$ on initialization', () => {
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