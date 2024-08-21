import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormField,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginForm: FormGroup = new FormGroup({});
  errorMessage: string = '';
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  snackbarService: SnackbarService = inject(SnackbarService);
  reason: string = '';

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.route.queryParams.subscribe((params) => {
      this.reason = params['reason'];
    });
    if (this.reason) {
      this.snackbarService.show(this.reason);
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.snackbarService.show('Please enter a valid username and password.');
      return; // Prevent submission if form is invalid
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.token) {
          this.snackbarService.show('Logged in successfully.');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.snackbarService.show(
          'Login failed. Please check your username and password.'
        );
      }
    });
  }
}
