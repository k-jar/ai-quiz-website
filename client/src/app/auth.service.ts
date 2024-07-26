import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/auth';
  private jwtHelper = new JwtHelperService();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> { 
    return this.http.post(`${this.url}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.url}/login`, user).pipe(
      tap((response: any) => {
        if (response.token && typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
        }
        return response;
      })
    );
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUser(): any {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken;
    }
    return null;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      this.loggedIn.next(false);
    }
  }

  private hasToken(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
