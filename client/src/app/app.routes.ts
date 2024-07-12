import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home page',
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
    }
];
