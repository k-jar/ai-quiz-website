import { TestBed } from '@angular/core/testing';

import { QuizAttemptService } from './quiz-attempt.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QuizAttemptService', () => {
  let service: QuizAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(QuizAttemptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
