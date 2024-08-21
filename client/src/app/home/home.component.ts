import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from '../quiz/quiz.component';
import { Quiz } from '../quiz';
import { QuizService } from '../quiz.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuizEventsService } from '../quiz-events.service';
import { SnackbarService } from '../snackbar.service';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuizComponent, MatCardModule, MatListModule,
    MatGridListModule, MatInputModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  originalMyQuizList: Quiz[] = [];
  originalOtherQuizList: Quiz[] = [];
  myQuizList: Quiz[] = [];
  otherQuizList: Quiz[] = [];
  quizService: QuizService = inject(QuizService);
  authService: AuthService = inject(AuthService);
  quizEventsService: QuizEventsService = inject(QuizEventsService);
  snackbarService: SnackbarService = inject(SnackbarService);
  filteredQuizList: Quiz[] = [];
  user: any;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    console.log("user",this.user);
    this.loadQuizzes();

    // Subscribe to the quizDeleted event
    this.quizEventsService.quizDeleted$.subscribe(() => {
      this.loadQuizzes();
    });
  }

  loadQuizzes() {
    this.quizService.getAllQuizzes().pipe(
      switchMap((quizList: Quiz[]) => {
        const userIds = quizList.map(quiz => quiz.createdBy);
        return forkJoin({
          quizzes: [quizList],
          users: this.quizService.getUsernames(userIds)
        });
      }),
    ).subscribe({
      next: ({ quizzes, users }) => {
        const userMap = new Map(users.map(user => [user._id, user.username]));
  
        const quizzesWithUsernames = quizzes.map(quiz => ({
          ...quiz,
          username: userMap.get(quiz.createdBy)
        }));
  
        if (this.user) {
          this.myQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy === this.user.userId);
          this.otherQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy !== this.user.userId);
        } else {
          this.otherQuizList = quizzesWithUsernames;
        }
        
        this.originalMyQuizList = [...this.myQuizList]; // Keep the original list for filtering
        this.originalOtherQuizList = [...this.otherQuizList];
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }
  
  private handleError(error: any) {
    this.snackbarService.show('Failed to load quizzes or usernames');
    console.error('Error:', error);
  }

  filterQuizzes(searchTerm: string) {
    if (!searchTerm) {
      this.myQuizList = [...this.originalMyQuizList];
      this.otherQuizList = [...this.originalOtherQuizList];
      return;
    }
  
    if (this.user) {
      this.myQuizList = this.originalMyQuizList.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) && quiz.createdBy === this.user.userId
      );
      this.otherQuizList = this.originalOtherQuizList.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) && quiz.createdBy !== this.user.userId
      );
    } else {
      this.otherQuizList = this.originalOtherQuizList.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
}
