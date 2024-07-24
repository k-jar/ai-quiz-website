import { Component, Input, OnInit } from '@angular/core';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
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

  constructor(private authService: AuthService, private quizAttemptService: QuizAttemptService) { }

  ngOnInit() {
    this.getLatestAttempt();
  }

  getLatestAttempt() {
    const userId = this.authService.getCurrentUser()?.userId;
    this.quizAttemptService.getLatestAttempt(this.quiz._id, userId).subscribe(attempt => {
      this.attempt = attempt; // Assign the entire attempt to attempt
    });
  }
}
