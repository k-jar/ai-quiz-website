import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { PlayQuizComponent } from './play-quiz/play-quiz.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { QuizAttemptComponent } from './quiz-attempt/quiz-attempt.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'All quizzes',
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Quiz details',
    },
    {
        path: 'create-quiz',
        component: CreateQuizComponent,
        title: 'Create a quiz',
    },
    {
        path: 'quiz/:id',
        component: PlayQuizComponent, 
        title: 'Play a quiz',
    },
    {
        path: '', redirectTo: '/', pathMatch: 'full'
    },
    {
        path: 'login', 
        component: LoginComponent,
        title: 'Login page',
    },
    {
        path: 'register', 
        component: RegisterComponent,
        title: 'Register page',
    },
    {
        path: 'quiz-attempts',
        component: QuizAttemptComponent,
        title: 'Quiz attempts',
    }
];
