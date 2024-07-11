import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from '../quiz/quiz.component';
import { Quiz } from '../quiz';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, QuizComponent],
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
