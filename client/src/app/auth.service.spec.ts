import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const user = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    };

    service.register(user).subscribe((response) => {
      expect(response).toEqual(user);
    });

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/auth/register'
    );
    expect(req.request.method).toEqual('POST');
    req.flush(user);
  });

  it('should login a user', () => {
    const user = {
      username: 'testuser',
      password: 'password',
    };

    const response = {
      token: 'testToken',
    };

    service.login(user).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpTesting.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toEqual('POST');
    req.flush(response);
  });

  it('should return decoded token if token exists', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    spyOn(service, 'getToken').and.returnValue(mockToken);

    const result = service.getCurrentUser();

    expect(service.getToken).toHaveBeenCalled();
    expect(result).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 });
  });

  it('should return null if no token exists', () => {
    spyOn(service, 'getToken').and.returnValue(null);

    const result = service.getCurrentUser();

    expect(service.getToken).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should logout a user', () => {
    spyOn(localStorage, 'removeItem');

    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
