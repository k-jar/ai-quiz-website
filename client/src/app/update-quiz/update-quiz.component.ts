import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-update-quiz',
  standalone: true,
  imports: [
    CommonModule,
    QuizFormComponent
  ],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.css'
})
export class UpdateQuizComponent {
  quizId: string = '';
  quiz: Quiz | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  router: Router = inject(Router);
  snackbarService: SnackbarService = inject(SnackbarService);

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.loadQuiz();
  }

  loadQuiz() {
    if (this.quizId) {
      this.quizService.getQuizById(this.quizId).subscribe({
        next: (quiz: Quiz) => {
          this.quiz = quiz;
        },
        error: (error) => {
          console.error('Failed to load quiz:', error);
          this.snackbarService.show('Failed to load quiz');
        },
        complete: () => {
          console.log('Quiz loaded successfully');
        }
      });
    }
    else {
      console.error('No quiz ID provided');
      this.snackbarService.show('No quiz ID provided');
    }
  }  

  onSubmitQuiz(formValue: Quiz) {
    const updatedQuiz = {...this.quiz, ...formValue};
  
    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: () => {
        this.snackbarService.show('Quiz updated successfully');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Failed to update quiz:', error);
        this.snackbarService.show('Failed to update quiz');
      },
      complete: () => {
        console.log('Quiz update operation completed.');
      }
    });
  }
}