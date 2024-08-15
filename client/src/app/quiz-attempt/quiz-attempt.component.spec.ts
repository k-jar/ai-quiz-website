import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAttemptComponent } from './quiz-attempt.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('QuizAttemptComponent', () => {
  let component: QuizAttemptComponent;
  let fixture: ComponentFixture<QuizAttemptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizAttemptComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizAttemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
