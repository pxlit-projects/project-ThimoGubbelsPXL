import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, Subscription } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from './auth.service';
import { Page } from '../models/page';

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
  getPublicPosts(page: number = 0, size: number = 10): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.api}post/api/post/public`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    });
  }
  
  filterPosts(
    content?: string,
    author?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 0,
    size: number = 10
  ): Observable<Page<Post>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (content) params = params.set('content', content);
    if (author) params = params.set('author', author);
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
  
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    
    return this.http.get<Page<Post>>(`${this.api}post/api/post/filter`, {
      headers,
      params
    });
  }
  
}
