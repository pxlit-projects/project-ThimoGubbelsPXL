import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
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
  private postsSignal = signal<Post[]>([]);
  posts = computed(() => this.postsSignal());
  

  createPost(post: Post) {
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Post>(this.api + 'post/api/post', post,{ headers });
  }
  
  updatePost(post: Post): Observable<Post>{
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
     return this.http.put<Post>(this.api + `post/api/post/${post.id}`, post);
    
  }

  getPosts(){
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.get<Post[]>(this.api + 'post/api/posts');
  }
  
}
