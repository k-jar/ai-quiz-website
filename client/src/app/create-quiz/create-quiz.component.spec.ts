import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateQuizComponent } from './create-quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Quiz } from '../quiz';
import { of } from 'rxjs';
import { QuizService } from '../services/quiz.service';
import { Router } from '@angular/router';

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let fixture: ComponentFixture<CreateQuizComponent>;
  let quizServiceSpy: jasmine.SpyObj<QuizService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const testQuiz: Quiz = {
    createdBy: '123',
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
    username: 'Test User',
  };

  beforeEach(async () => {
    quizServiceSpy = jasmine.createSpyObj('QuizService', [
      'addQuiz',
      'generateAndAddQuiz',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateQuizComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: QuizService, useValue: quizServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize', () => {
    component.ngOnInit();
    expect(component.prompt).toEqual(
      `Generate ${component.numQuestions} multiple choice quiz questions in ${component.questionLanguage} (options should be in ${component.answerLanguage}) from the provided text, formatted in JSON with title, questions, options, and answers. The JSON schema should be as follows: ${component.quizTemplate}`
    );
  });

  it('should update prompt', () => {
    component.updatePrompt();
    expect(component.prompt).toEqual(
      `Generate ${component.numQuestions} multiple choice quiz questions in ${component.questionLanguage} (answers in ${component.answerLanguage}) from the provided text: ${component.reading}, formatted in JSON with title, questions, options, and answers. The JSON schema should be as follows: ${component.quizTemplate}`
    );
  });

  it('should change tab', () => {
    component.onTabChange(1);
    expect(component.formChoiceIndex).toEqual(1);
    expect(component.modelChoice).toEqual('lm');
  });

  it('should change settings', () => {
    const updatePromptSpy = spyOn(component, 'updatePrompt');
    component.onSettingsChange();
    expect(updatePromptSpy).toHaveBeenCalled();
  });

  it('should submit quiz', () => {
    const quizMock = { ...testQuiz };
    quizServiceSpy.addQuiz.and.returnValue(of(quizMock));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.onSubmitQuiz(quizMock);

    expect(quizServiceSpy.addQuiz).toHaveBeenCalledWith(quizMock);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should submit text', () => {
    const textMock = 'Test text';
    quizServiceSpy.generateAndAddQuiz.and.returnValue(of(testQuiz));

    component.submitText(textMock);

    expect(quizServiceSpy.generateAndAddQuiz).toHaveBeenCalledWith(
      textMock,
      component.numQuestions,
      component.questionLanguage,
      component.answerLanguage,
      component.modelChoice
    );
  });
});
