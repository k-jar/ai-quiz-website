import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionFormBaseComponent } from './question-form-base.component';

describe('QuestionFormBaseComponent', () => {
  let component: QuestionFormBaseComponent;
  let fixture: ComponentFixture<QuestionFormBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFormBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionFormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
