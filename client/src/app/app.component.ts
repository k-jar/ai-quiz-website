import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    QuizComponent,
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'quizzes';
  isOpened = true;
  isLoggedIn = false;
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  snackbarService: SnackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(
      (status) => (this.isLoggedIn = status)
    );
  }

  logout(): void {
    try {
      this.authService.logout();
      this.isLoggedIn = false;
      this.snackbarService.show('Logged out successfully');
    } catch (error) {
      console.error('Failed to logout:', error);
      this.snackbarService.show('Failed to logout');
    }
  }
}
