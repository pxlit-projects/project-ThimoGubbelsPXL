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
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.patch<void>(`${this.api}post/api/post/${postId}/publish`, {}, { headers }).pipe(catchError((error)=>this.handleError(error)));
  }
  createPost(post: Post) {
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Post>(this.api + 'post/api/post', post,{ headers }).pipe(catchError((error)=>this.handleError(error)));

  }
  
  updatePost(post: Post, postId: Number): Observable<Post>{
    this.errorMessage = null;
   
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.put<Post>(this.api + `post/api/post/${postId}`, post, { headers }).pipe(catchError((error)=>this.handleError(error)));

 
    
  }

  getPosts(){
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return  this.http.get<Post[]>(this.api + 'post/api/post', { headers }).pipe(catchError((error)=>this.handleError(error)));

  }
  getPublicPosts(page: number = 0, size: number = 10): Observable<Page<Post>> {
    this.errorMessage = null;
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
      }), catchError((error)=>this.handleError(error))
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
    
    // Convert all dates to start of day for proper comparison
    const postDate = new Date(post.date);
    postDate.setHours(0, 0, 0, 0);
  
    let start = startDate ? new Date(startDate) : null;
    if (start) start.setHours(0, 0, 0, 0);
    
    let end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);
  
    const matchesDateRange = (!start || postDate >= start) && 
                           (!end || postDate <= end);
  
    return matchesContent && matchesAuthor && matchesDateRange;
  }

  private handleError(error: HttpErrorResponse) {
    
    if (error.error instanceof ErrorEvent) {
      this.errorMessage = `Client side error`;
    } else {
      this.errorMessage = `Backend error`;
    }
   
    

    if (error.status === 0) {
      // Handle CORS or network issues
      return throwError(() => new Error('The backend is offline or unreachable.'));
    }

    // Return a more user-friendly error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
  
}
