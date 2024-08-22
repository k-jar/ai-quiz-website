import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  registerForm: FormGroup = new FormGroup({});
  snackbarService: SnackbarService = inject(SnackbarService)
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);

  ngOnInit() { 
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.snackbarService.show('Please enter a valid username and password.');
      return;
    }

    console.log('Register form:', this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        this.snackbarService.show('Registration successful. Please log in.');
        this.registerForm.reset();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Register error:', error);
        if (error.status === 409) {
          this.snackbarService.show('Username already exists. Please choose another one.');
        } else {
          this.snackbarService.show('Registration failed. Please try again.');
        }
      }
    );
  }
}
