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
import { forkJoin, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuizComponent, MatCardModule, MatListModule,
    MatGridListModule, MatInputModule, MatButtonModule, MatIconModule, MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  originalQuizList: Quiz[] = [];
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

  // loadQuizzes() {
  //   this.quizService.getAllQuizzes().subscribe({
  //     next: (quizList: Quiz[]) => {
  //       const userIds = quizList.map(quiz => quiz.createdBy);
  //       this.quizService.getUsernames(userIds).subscribe({
  //         next: users => {
  //           const userMap = new Map(users.map(user => [user._id, user.username]));
  
  //           const quizzesWithUsernames = quizList.map(quiz => ({
  //             ...quiz,
  //             username: userMap.get(quiz.createdBy)
  //           }));
  
  //           if (this.user) {
  //             this.myQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy === this.user.userId);
  //             // this.otherQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy !== this.user.userId);
  //           } else {
  //             this.otherQuizList = quizzesWithUsernames;
  //           }
  
  //           this.originalQuizList = [...this.otherQuizList]; // Keep the original list for filtering
  //         },
  //         error: error => {
  //           console.error('Failed to fetch usernames:', error);
  //         }
  //       });
  //     },
  //     error: error => {
  //       this.snackbarService.show('Failed to fetch quizzes');
  //       console.error('Failed to fetch quizzes:', error);
  //     }
  //   });
  // }

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
  
        this.originalQuizList = [...this.otherQuizList]; // Keep the original list for filtering
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
      this.filteredQuizList = [...this.originalQuizList];
    } else {
      this.filteredQuizList = this.originalQuizList.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (this.user) {
      this.myQuizList = this.filteredQuizList.filter(quiz => quiz.createdBy === this.user.userId);
      this.otherQuizList = this.filteredQuizList.filter(quiz => quiz.createdBy !== this.user.userId);
    } else {
      this.otherQuizList = this.filteredQuizList;
    }
  }
}
