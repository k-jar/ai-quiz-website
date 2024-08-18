import { TestBed } from '@angular/core/testing';

import { QuizEventsService } from './quiz-events.service';
import { take } from 'rxjs';

describe('QuizEventsService', () => {
  let service: QuizEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify subscribers when quizDeletedSource emits', (done) => {
    // Subscribe to the quizDeleted$ observable and check if it emits when notifyQuizDeleted() is called
    service.quizDeleted$.pipe(take(1)).subscribe(() => {
      // If this block is executed, the test passes
      expect(true).toBe(true);
      done();
    });

    service.notifyQuizDeleted();
  });
});
