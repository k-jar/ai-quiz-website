import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatFormField, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/quizzes']);
        }
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }
}