import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

describe('AppComponent', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;


  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['show']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
        { provide: AuthService, useValue: authServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'quizzes' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('quizzes');
  });

  it('should call logout on AuthService when logout is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });

  it('should show snackbar message when logout is called', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(snackbarServiceMock.show).toHaveBeenCalledWith('Logged out successfully');
  });
});
