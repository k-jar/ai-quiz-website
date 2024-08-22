import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { UpdateQuizComponent } from './update-quiz.component';
import { QuizService } from '../services/quiz.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { EMPTY, of, throwError } from 'rxjs';
import { Quiz } from '../quiz';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const paramMapMock: ParamMap = {
  has: (key: string) => key === 'id',
  get: (key: string) => (key === 'id' ? 'testQuizId' : null),
  getAll: (key: string) => (key === 'id' ? ['testQuizId'] : []),
  keys: ['id']
};

const mockQuiz: Quiz = {
  createdBy: 'testUser',
  _id: 'testQuizId',
  title: 'Updated Quiz',
  reading: 'Updated Reading',
  questions: [{
    question: 'Updated Question',
    options: ['Option 1', 'Option 2'],
    answer: 0
  }],
  username: 'testUser'
};

describe('UpdateQuizComponent', () => {
  let component: UpdateQuizComponent;
  let fixture: ComponentFixture<UpdateQuizComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async() => {
    quizServiceSpy = jasmine.createSpyObj('QuizService', ['getQuizById', 'updateQuiz']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    const activatedRouteStub = {
      snapshot: {
        paramMap: paramMapMock
      }
    };

    // This spy will return an empty observable, like the real service would.
    // This prevents an undefined error when the component tries to access the observable in ngOnInit
    quizServiceSpy.getQuizById.and.returnValue(EMPTY);
    
    TestBed.configureTestingModule({
      imports: [UpdateQuizComponent, BrowserAnimationsModule],
      providers: [
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    quizServiceSpy.updateQuiz.calls.reset();
    quizServiceSpy.getQuizById.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load quiz on init', () => {
    // Change spy return value to mock quiz from EMPTY in beforeEach
    quizServiceSpy.getQuizById.and.returnValue(of(mockQuiz));

    component.ngOnInit();

    expect(quizServiceSpy.getQuizById).toHaveBeenCalledWith('testQuizId');
    expect(component.quiz).toEqual(mockQuiz);
  });

  it('should handle error if quiz loading fails', () => {
    const errorResponse = new Error('Test Error');
    // Change spy return value to error response from EMPTY in beforeEach
    quizServiceSpy.getQuizById.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();

    expect(quizServiceSpy.getQuizById).toHaveBeenCalledWith('testQuizId');
    expect(component.quiz).toBeNull();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Failed to load quiz');
  });

  it('should update quiz on submit', () => {
    const formValue: Quiz = {
      createdBy: 'testUser',
      _id: 'testQuizId',
      title: 'Updated Quiz',
      reading: 'Updated Reading',
      questions: [{
        question: 'Updated Question',
        options: ['Option 1', 'Option 2'],
        answer: 0
      }],
      username: 'testUser'
    };
    quizServiceSpy.updateQuiz.and.returnValue(of({}));

    component.onSubmitQuiz(formValue);

    expect(quizServiceSpy.updateQuiz).toHaveBeenCalledWith('testQuizId', formValue);
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Quiz updated successfully');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error if quiz update fails', () => {
    const formValue: Quiz = {
      createdBy: 'testUser',
      _id: 'testQuizId',
      title: 'Updated Quiz',
      reading: 'Updated Reading',
      questions: [{
        question: 'Updated Question',
        options: ['Option 1', 'Option 2'],
        answer: 0
      }],
      username: 'testUser'
    };
    const errorResponse = new Error('Update Error');
    quizServiceSpy.updateQuiz.and.returnValue(throwError(() => errorResponse));

    component.onSubmitQuiz(formValue);

    expect(quizServiceSpy.updateQuiz).toHaveBeenCalledWith('testQuizId', formValue);
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Failed to update quiz');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
