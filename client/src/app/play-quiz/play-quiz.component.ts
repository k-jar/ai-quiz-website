import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  QueryList,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../quiz';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { QuizAttemptService } from '../services/quiz-attempt.service';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';
import { MultipleChoiceQuestionComponent } from '../multiple-choice-question/multiple-choice-question.component';
import { OrderingQuestionComponent } from '../ordering-question/ordering-question.component';
import { QuestionBaseComponent } from '../question-base/question-base.component';

@Component({
  selector: 'app-play-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    MatCardModule,
    MultipleChoiceQuestionComponent,
    OrderingQuestionComponent,
  ],
  templateUrl: './play-quiz.component.html',
  styleUrl: './play-quiz.component.css',
})
export class PlayQuizComponent {
  // For ViewChildren, do not set static to true
  @ViewChildren('container', { read: ViewContainerRef })
  viewContainerRefs!: QueryList<ViewContainerRef>;
  route: ActivatedRoute = inject(ActivatedRoute);
  quizService: QuizService = inject(QuizService);
  quizAttemptService: QuizAttemptService = inject(QuizAttemptService);
  snackbarService: SnackbarService = inject(SnackbarService);
  changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  quiz: Quiz | undefined;
  showQuestions: boolean = false;
  userAnswers: number[] = [];
  score: number = 0;
  questionResults: boolean[] = [];
  quizSubmitted: boolean = false;
  userId: string = '';
  quizId: string = '';
  dialog: MatDialog = inject(MatDialog);
  authService: AuthService = inject(AuthService);
  questionComponents: any[] = [];
  componentRefs: ComponentRef<any>[] = [];
  showAnswer: boolean = false;

  ngOnInit() {
    this.quizId = this.route.snapshot.params['id'];
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        if (quiz) {
          this.userAnswers = new Array(quiz.questions.length).fill(null);
        }
      },
    });
  }

  viewQuestions() {
    this.showQuestions = true;

    // Manually trigger change detection to update the view
    this.changeDetectorRef.detectChanges();

    // Use setTimeout to allow the DOM to update
    setTimeout(() => {
      if (this.quiz && this.viewContainerRefs) {
        this.quiz.questions.forEach((question: any, index: number) => {
          this.loadComponent(question, index);
        });
      }
    }, 0);
  }

  showAnswers() {
    // Update the local showAnswer property
    this.showAnswer = true;

    // Update the showAnswer property for each dynamic component
    this.componentRefs.forEach((ref) => {
      ref.instance.showAnswer = this.showAnswer;
    });
  }

  onAnswerChange(index: number, answer: any) {
    this.userAnswers[index] = answer;
  }

  loadComponent(question: any, index: number) {
    if (!this.componentRefs[index]) {
      const viewContainerRef = this.viewContainerRefs.toArray()[index];

      if (!viewContainerRef) {
        console.error(`ViewContainerRef at index ${index} is undefined`);
        return;
      }

      let componentType: any;
      switch (question.type) {
        case 'multiple-choice':
          componentType = MultipleChoiceQuestionComponent;
          break;
        case 'ordering':
          componentType = OrderingQuestionComponent;
          break;
        default:
          throw new Error('Unknown question type');
      }

      const componentRef =
        viewContainerRef.createComponent<QuestionBaseComponent>(componentType);

      // This is the modern way to set inputs
      componentRef.setInput('question', question);
      componentRef.setInput('userAnswer', this.userAnswers[index]);
      componentRef.setInput('disabled', this.quizSubmitted);
      componentRef.setInput('showAnswer', this.showAnswer);

      componentRef.instance.answerChange.subscribe(
        (answer: any) => (this.userAnswers[index] = answer)
      );

      // Store the component reference so we can access it later
      this.componentRefs[index] = componentRef;
    }
  }

  submitQuiz() {
    if (!this.quiz) {
      return;
    }
    this.quizSubmitted = true;

    this.questionResults = this.quiz.questions.map(
      (question: any, index: number) => {
        const componentRef = this.componentRefs[index];

        if (componentRef) {
          const component = componentRef.instance as QuestionBaseComponent;
          component.disabled = true;
          return component.isAnswerCorrect();
        } else {
          console.error(`Component at index ${index} is not available.`);
          return false; // Default to incorrect if the component is not available
        }
      }
    );

    this.score = this.questionResults.filter((result) => result).length;

    this.submitQuizAttempt();
  }

  submitQuizAttempt() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.userId;
    }
    const attempt = {
      userId: this.userId,
      quizId: this.quizId,
      score: this.score,
    };

    this.quizAttemptService.createAttempt(attempt).subscribe({
      next: (response) => {
        this.snackbarService.show('Quiz attempt saved successfully');
      },
      error: (error) => {
        console.error('Error saving quiz attempt', error);
        this.snackbarService.show('Failed to save quiz attempt');
      },
    });
  }

  openConfirmationDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.submitQuiz();
        }
      },
    });
  }

  resetQuiz() {
    this.userAnswers = Array(this.quiz?.questions?.length).fill(null);
    this.questionResults = [];
    this.score = 0;
    this.quizSubmitted = false;
    this.showQuestions = false;
    this.showAnswer = false;

    // Clear the ViewContainerRef for each dynamic component and reset disabled property
    this.componentRefs.forEach((ref) => {
      ref.instance.reset();
    });

    this.componentRefs = [];
  }
}
