import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { Quiz } from '../quiz';
import { CommonModule } from '@angular/common';
import { QuizFormComponent } from '../quiz-form/quiz-form.component';

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

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.loadQuiz();
  }

  loadQuiz() {
    if (this.quizId) {
      this.quizService.getQuizById(this.quizId).subscribe(
        (quiz: Quiz) => {
          this.quiz = quiz;
        },
        (error) => {
          console.error('Failed to load quiz:', error);
          alert('Failed to load quiz');
        }
      );
    }
  }

  onSubmitQuiz(formValue: Quiz) {
    this.quizService.updateQuiz(this.quizId, formValue).subscribe(
      () => {
        alert('Quiz updated successfully');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Failed to update quiz:', error);
        alert('Failed to update quiz');
      }
    );
  }
}