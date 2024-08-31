import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingQuestionFormComponent } from './matching-question-form.component';

describe('MatchingQuestionFormComponent', () => {
  let component: MatchingQuestionFormComponent;
  let fixture: ComponentFixture<MatchingQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
