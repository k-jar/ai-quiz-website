import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { QuizAttemptService } from '../quiz-attempt.service';
import { QuizEventsService } from '../quiz-events.service';
import { QuizService } from '../quiz.service';
import { SnackbarService } from '../snackbar.service';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let mockQuizAttemptService: jasmine.SpyObj<QuizAttemptService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockQuizService: jasmine.SpyObj<QuizService>;
  let mockQuizEventsService: jasmine.SpyObj<QuizEventsService>;
  let mockSnackbarService: jasmine.SpyObj<SnackbarService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any = {
    snapshot: {
      paramMap: {
        get: () => 'testId',
      },
    },
  };
  

  beforeEach(async () => {
    mockQuizAttemptService = jasmine.createSpyObj(['getLatestAttempt']);
    mockAuthService = jasmine.createSpyObj(
      ['isLoggedIn', 'getCurrentUser', 'getToken'],
      { isLoggedIn: of(true) }
    );

    mockQuizService = jasmine.createSpyObj(['deleteQuiz']);
    mockQuizEventsService = jasmine.createSpyObj(['notifyQuizDeleted']);
    mockSnackbarService = jasmine.createSpyObj(['show']);
    mockRouter = jasmine.createSpyObj(['navigate']);

    await TestBed.configureTestingModule({
      imports: [QuizComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: QuizAttemptService, useValue: mockQuizAttemptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: QuizService, useValue: mockQuizService },
        { provide: QuizEventsService, useValue: mockQuizEventsService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;

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

  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get latest attempt on init if user is logged in', () => {
    const user = { userId: '123' };
    const attempt = { quiz: 'testId' };

    mockAuthService.getCurrentUser.and.returnValue(user);
    mockQuizAttemptService.getLatestAttempt.and.returnValue(of(attempt));

    fixture.detectChanges();

    expect(component.attempt).toEqual(attempt);
  });

  it('should delete quiz', () => {
    fixture.detectChanges();

    const quizId = 'quiz1';
    const token = 'token';

    // Mock confirm
    spyOn(window, 'confirm').and.returnValue(true);

    mockAuthService.getToken.and.returnValue(token);
    mockQuizService.deleteQuiz.and.returnValue(of(null));

    component.deleteQuiz(quizId);

    expect(mockQuizService.deleteQuiz).toHaveBeenCalledWith(quizId);
    expect(mockQuizEventsService.notifyQuizDeleted).toHaveBeenCalled();
    expect(mockSnackbarService.show).toHaveBeenCalledWith(
      'Quiz deleted successfully'
    );
  });

  it('should navigate to update quiz', () => {
    fixture.detectChanges();
    const quizId = 'quiz1';

    component.updateQuiz(quizId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/update-quiz', quizId]);
  });
});
