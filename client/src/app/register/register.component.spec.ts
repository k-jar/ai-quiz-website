import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { RegisterComponent } from './register.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SnackbarService } from '../services/snackbar.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let mockActivatedRoute: any = {
    snapshot: {
      paramMap: {
        get: () => 'testId',
      },
    },
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, BrowserAnimationsModule],
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const form = component.registerForm;
    expect(form).toBeDefined();
    expect(form.get('username')?.value).toEqual('');
    expect(form.get('password')?.value).toEqual('');
  });

  it('should make the form invalid if empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should make the form invalid if the username is too short', () => {
    component.registerForm.setValue({ username: 'ab', password: 'password123' });
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('should make the form invalid if the password is too short', () => {
    component.registerForm.setValue({ username: 'username', password: '12345' });
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('should make the form valid if the inputs meet the requirements', () => {
    component.registerForm.setValue({ username: 'username', password: 'password123' });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('should call the register method on the AuthService when the form is submitted', () => {
    authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.setValue({ username: 'username', password: 'password123' });
    component.register();
    expect(authServiceSpy.register).toHaveBeenCalled();
  });

  it('should show a success message and reset the form on successful registration', () => {
    authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.setValue({ username: 'username', password: 'password123' });
    component.register();
    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Registration successful. Please log in.');
    expect(component.registerForm.value).toEqual({ username: null, password: null });
  });

  it('should show an error message if the username already exists', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    component.registerForm.setValue({ username: 'username', password: 'password123' });
    component.register();
    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Username already exists. Please choose another one.');
  });
});