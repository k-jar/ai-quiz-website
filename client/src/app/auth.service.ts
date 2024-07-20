import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/api/auth';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> { 
    return this.http.post(`${this.url}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.url}/login`, user);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
