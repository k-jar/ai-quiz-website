import { Component, Input, OnInit } from '@angular/core';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizAttemptService } from '../quiz-attempt.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet,
    MatCardModule, MatButtonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  @Input() quiz!: Quiz;
  attempt: any = null;
  loggedIn = false;

  constructor(private authService: AuthService, private quizAttemptService: QuizAttemptService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
      if (loggedIn) {
        this.getLatestAttempt();
      }
    });
  }

  getLatestAttempt() {
    this.quizAttemptService.getLatestAttempt(this.quiz._id).subscribe(
      attempt => {
        this.attempt = attempt; // Assign the entire attempt to attempt
      },
      error => {
        console.error(error);
      }
    );
  }
}
