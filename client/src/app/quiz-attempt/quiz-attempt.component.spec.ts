import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAttemptComponent } from './quiz-attempt.component';
import { QuizAttemptService } from '../services/quiz-attempt.service';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../quiz';
import { ActivatedRoute } from '@angular/router';

describe('QuizAttemptComponent', () => {
  let component: QuizAttemptComponent;
  let fixture: ComponentFixture<QuizAttemptComponent>;
  let mockQuizAttemptService: jasmine.SpyObj<QuizAttemptService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockQuizService: jasmine.SpyObj<QuizService>;
  let mockActivatedRoute: any = {
    snapshot: {
      paramMap: {
        get: () => 'testId',
      },
    },
  };

  beforeEach(async () => {
    mockQuizAttemptService = jasmine.createSpyObj(['getAttemptsByUserId']);
    mockAuthService = jasmine.createSpyObj(['getCurrentUser']);
    mockQuizService = jasmine.createSpyObj(['getQuizById']);

    await TestBed.configureTestingModule({
      imports: [QuizAttemptComponent],
      providers: [
        { provide: QuizAttemptService, useValue: mockQuizAttemptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: QuizService, useValue: mockQuizService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAttemptComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get attempts on init if user exists', () => {
    const user = { userId: '123' };
    const attempts = [{ quiz: 'quiz1' }, { quiz: 'quiz2' }];
    const quizzes: Partial<Quiz>[] = [{ _id: 'quiz1' }, { _id: 'quiz2' }];

    mockAuthService.getCurrentUser.and.returnValue(user);
    mockQuizAttemptService.getAttemptsByUserId.and.returnValue(of(attempts));
    mockQuizService.getQuizById.and.returnValues(of(quizzes[0] as Quiz), of(quizzes[1] as Quiz));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.attempts).toEqual([
      { ...attempts[0], quizData: quizzes[0] },
      { ...attempts[1], quizData: quizzes[1] }
    ]);
  });

  it('should not get attempts on init if user does not exist', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockQuizAttemptService.getAttemptsByUserId).not.toHaveBeenCalled();
  });
});
