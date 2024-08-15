import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayQuizComponent } from './play-quiz.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { routes } from '../app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('PlayQuizComponent', () => {
  let component: PlayQuizComponent;
  let fixture: ComponentFixture<PlayQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayQuizComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes)
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
