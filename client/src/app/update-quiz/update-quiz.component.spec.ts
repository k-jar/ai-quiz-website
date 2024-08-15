import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuizComponent } from './update-quiz.component';
import { provideRouter } from '@angular/router';
import { routes } from '../app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UpdateQuizComponent', () => {
  let component: UpdateQuizComponent;
  let fixture: ComponentFixture<UpdateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuizComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
