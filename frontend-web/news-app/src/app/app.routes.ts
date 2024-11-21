import { Routes } from '@angular/router';
import { CreatePostComponent } from './core/post/forms/create-post/create-post.component';
import { HomeComponent } from './core/home/home.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './core/login/login.component';

export const routes: Routes = [
    {path: 'create-post', component: CreatePostComponent,canActivate: [AuthGuard]},
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
   
];
