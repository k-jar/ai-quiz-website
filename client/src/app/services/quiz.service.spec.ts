import { TestBed } from '@angular/core/testing';
import { QuizService } from './quiz.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Quiz } from '../quiz';

describe('QuizService', () => {
  let service: QuizService;
  let httpTesting: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getCurrentUser']);
    authServiceSpy.getToken.and.returnValue('testToken');
    authServiceSpy.getCurrentUser.and.returnValue({ userId: 'testUserId' });

    TestBed.configureTestingModule({
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
            { provide: AuthService, useValue: authServiceSpy }
        ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(QuizService);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    })

    it('should get all quizzes', () => {
        const testData: Quiz[] = [{ 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        }];

        service.getAllQuizzes().subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/quizzes');
        expect(req.request.method).toEqual('GET');
        req.flush(testData);
    });

    it('should get a quiz by id', () => {
        const testData: Quiz = { 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        };

        service.getQuizById('1').subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/quizzes/1');
        expect(req.request.method).toEqual('GET');
        req.flush(testData);
    });

    it('should get usernames', () => {
        const testData = ['Test User'];

        service.getUsernames(['123']).subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/auth/usernames');
        expect(req.request.method).toEqual('POST');
        req.flush(testData);
    });

    it('should generate a quiz', () => {
        const testData: Quiz = { 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        };

        service.generateQuiz('Test Text', 1, 'en', 'jp', 'lmstudio').subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/generate-quiz');
        expect(req.request.method).toEqual('POST');
        req.flush(testData);
    });

    it('should add a quiz when logged in', () => {
        const testData: Quiz = { 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        };

        service.addQuiz(testData).subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/quizzes');
        expect(req.request.method).toEqual('POST');
        req.flush(testData);
    });

    it('should throw an error when adding a quiz without a user', () => {
        const testData: Quiz = { 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        };

        authServiceSpy.getCurrentUser.and.returnValue(null);

        expect(() => service.addQuiz(testData)).toThrowError('User not logged in');
    });

    it('should delete a quiz', () => {
        service.deleteQuiz('1').subscribe();

        const req = httpTesting.expectOne('http://localhost:3000/api/quizzes/1');
        expect(req.request.method).toEqual('DELETE');
        req.flush({});
    });

    it('should update a quiz', () => {
        const testData: Quiz = { 
            createdBy: '123',
            _id: '1',
            title: 'Test Quiz',
            reading: 'Test Reading',
            questions: [{
                question: 'Test Question',
                options: ['A', 'B', 'C'],
                answer: 1
            }],
            username: 'Test User'
        };

        service.updateQuiz('1', testData).subscribe(data =>
            expect(data).toEqual(testData)
        );

        const req = httpTesting.expectOne('http://localhost:3000/api/quizzes/1');
        expect(req.request.method).toEqual('PATCH');
        req.flush(testData);
    });
});
