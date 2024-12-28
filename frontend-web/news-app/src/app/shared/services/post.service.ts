import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  api: string = environment.apiUrl;
  http: HttpClient = inject(HttpClient);
  authService: AuthService = inject(AuthService);
   posts :Post[] =[];
   errorMessage : WritableSignal<string|null> =signal(null);

 

  createPost(post: Post) {
    console.log("posting");
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Post>(this.api + 'post/api/post', post,{ headers });

  }
  
  updatePost(post: Post, postId: Number): Observable<Post>{
    console.log(post);
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.put<Post>(this.api + `post/api/post/${postId}`, post, { headers });

 
    
  }

  getPosts(){
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return  this.http.get<Post[]>(this.api + 'post/api/post', { headers });

  }
  
}
