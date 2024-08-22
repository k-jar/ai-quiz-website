import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockActivatedRoute = {
    queryParams: of({ reason: 'test-reason' }),
  };
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form valid when filled correctly', () => {
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpassword');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login method', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'testtoken' }));
    
    component.loginForm.controls['username'].setValue('testuser');
    component.loginForm.controls['password'].setValue('testpassword');
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith('Logged in successfully.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
