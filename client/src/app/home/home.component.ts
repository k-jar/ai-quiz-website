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
  filteredQuizList: Quiz[] = [];
  user: any = this.authService.getCurrentUser();

  ngOnInit() {
    this.quizService.getAllQuizzes().subscribe((quizList: Quiz[]) => {
      const userIds = quizList.map(quiz => quiz.createdBy);
      this.quizService.getUsernames(userIds).subscribe(users => {
        const userMap = new Map(users.map(user => [user._id, user.username]));

        const quizzesWithUsernames = quizList.map(quiz => ({
          ...quiz,
          username: userMap.get(quiz.createdBy)
        }));

        if (this.user) {
          this.myQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy === this.user.userId);
          this.otherQuizList = quizzesWithUsernames.filter(quiz => quiz.createdBy !== this.user.userId);
        } else {
          this.otherQuizList = quizzesWithUsernames;
        }
      });
    });
  }

  filterQuizzes(searchTerm: string) {
    let filteredQuizList = [];
    if (!searchTerm) {
      filteredQuizList = [...this.originalQuizList];
    } else {
      filteredQuizList = this.originalQuizList.filter((quiz) => {
        return quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (this.user) {
      this.myQuizList = filteredQuizList.filter(quiz => quiz.createdBy === this.user.userId);
      this.otherQuizList = filteredQuizList.filter(quiz => quiz.createdBy !== this.user.userId);
    } else {
      this.otherQuizList = filteredQuizList;
    }
  }
}
