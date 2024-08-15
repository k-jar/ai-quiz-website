import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateQuizComponent } from './create-quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let fixture: ComponentFixture<CreateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuizComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
