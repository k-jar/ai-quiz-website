import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizEventsService {
  private quizDeletedSource = new Subject<void>();

  quizDeleted$ = this.quizDeletedSource.asObservable();

  notifyQuizDeleted() {
    this.quizDeletedSource.next();
  }
}
