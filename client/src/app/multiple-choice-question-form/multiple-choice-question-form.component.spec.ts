import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceQuestionFormComponent } from './multiple-choice-question-form.component';

describe('MultipleChoiceQuestionFormComponent', () => {
  let component: MultipleChoiceQuestionFormComponent;
  let fixture: ComponentFixture<MultipleChoiceQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleChoiceQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultipleChoiceQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
