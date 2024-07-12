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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuizComponent, MatCardModule, MatListModule, 
    MatGridListModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  quizList: Quiz[] = [];
  quizService: QuizService = inject(QuizService);
  filteredQuizList: Quiz[] = [];

  constructor() {
    this.quizService.getAllQuizzes().then((quizList: Quiz[]) => {
      this.quizList = quizList;
      this.filteredQuizList = quizList;  // This is iterated over in the template
    });
  }

  filterQuizzes(searchTerm: string) {
    if (!searchTerm) {
      this.filteredQuizList = this.quizList;
      return;
    }

    this.filteredQuizList = this.quizList.filter((quiz) => {
      return quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
