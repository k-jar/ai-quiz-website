import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { PlayQuizComponent } from './play-quiz/play-quiz.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { QuizAttemptComponent } from './quiz-attempt/quiz-attempt.component';
import { UpdateQuizComponent } from './update-quiz/update-quiz.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'All quizzes',
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
        component: QuizAttemptComponent, canActivate: [AuthGuard],
        title: 'Quiz attempts',
    },
    {
        path: 'update-quiz/:id', component: UpdateQuizComponent, canActivate: [AuthGuard],
        title: 'Update a quiz',
    }
];
