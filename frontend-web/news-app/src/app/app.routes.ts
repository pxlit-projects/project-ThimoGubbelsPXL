import { Routes } from '@angular/router';
import { CreatePostComponent } from './core/post/forms/create-post/create-post.component';
import { HomeComponent } from './core/home/home.component';

export const routes: Routes = [
    {path: 'create-post', component: CreatePostComponent},
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
   
];
