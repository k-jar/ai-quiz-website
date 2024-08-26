import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingQuestionFormComponent } from './ordering-question-form.component';

describe('OrderingQuestionFormComponent', () => {
  let component: OrderingQuestionFormComponent;
  let fixture: ComponentFixture<OrderingQuestionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderingQuestionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderingQuestionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
