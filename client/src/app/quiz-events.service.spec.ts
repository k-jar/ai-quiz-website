import { TestBed } from '@angular/core/testing';

import { QuizEventsService } from './quiz-events.service';

describe('QuizEventsService', () => {
  let service: QuizEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
