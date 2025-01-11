import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, Subscription, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
   posts :Post[] = [];

   errorMessage :string|null =null;

 

 
  
  publishPost(postId: Number): Observable<void> {
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.patch<void>(`${this.api}post/api/post/${postId}/publish`, {}, { headers }).pipe(catchError(this.handleError));
  }
  createPost(post: Post) {
    console.log("posting");
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Post>(this.api + 'post/api/post', post,{ headers }).pipe(catchError(this.handleError));

  }
  
  updatePost(post: Post, postId: Number): Observable<Post>{
    console.log(post);
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.put<Post>(this.api + `post/api/post/${postId}`, post, { headers }).pipe(catchError(this.handleError));

 
    
  }

  getPosts(){
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return  this.http.get<Post[]>(this.api + 'post/api/post', { headers }).pipe(catchError(this.handleError));

  }
  getPublicPosts(page: number = 0, size: number = 10): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${this.api}post/api/post/public`, {
      params: {
        page: page.toString(),
        size: size.toString()
      }
    }).pipe(catchError(this.handleError));
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

    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    
    return this.http.get<Page<Post>>(`${this.api}post/api/post/public`, {
      headers,
      params
    }).pipe(
      map((page: Page<Post>) => {
        const filteredContent = page.content.filter(post => 
          this.isPostMatchingFilters(post, content, author, startDate, endDate)
        );
        return {
          ...page,
          content: filteredContent,
          totalElements: filteredContent.length
        };
      }), catchError(this.handleError)
    );
  }

  private isPostMatchingFilters(
    post: Post, 
    content?: string, 
    author?: string, 
    startDate?: Date, 
    endDate?: Date
  ): boolean {
    const matchesContent = !content || post.content.toLowerCase().includes(content.toLowerCase());
    const matchesAuthor = !author || post.author.toLowerCase().includes(author.toLowerCase());
    
    const postDate = new Date(post.date);
    const matchesDateRange = (!startDate || postDate >= startDate) && 
                           (!endDate || postDate <= endDate);

    return matchesContent && matchesAuthor && matchesDateRange;
  }

  private handleError(error: HttpErrorResponse) {
    
    if (error.error instanceof ErrorEvent) {
      this.errorMessage = `Error: ${error.error.message}`;
    } else {
      this.errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(this.errorMessage);
    return throwError(this.errorMessage);
  }
  
}
