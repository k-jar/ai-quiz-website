import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizFormComponent } from './quiz-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('QuizFormComponent', () => {
  let component: QuizFormComponent;
  let fixture: ComponentFixture<QuizFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizFormComponent, BrowserAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
