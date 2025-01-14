import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private api: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);
  private authService: AuthService = inject(AuthService);
  errorMessage :string|null =null;
  createComment(comment: Comment): Observable<Comment> {
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Comment>(`${this.api}comment/api/comment`, comment, { headers }).pipe(catchError((error)=>this.handleError(error)));;
  }

  updateComment(comment: Comment): Observable<Comment> {
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.patch<Comment>(`${this.api}comment/api/comment/${comment.id}`, {content: comment.content, author: comment.author}, { headers }).pipe(catchError((error)=>this.handleError(error)));;
  }

  deleteComment(commentId: Number): Observable<void> {
    this.errorMessage = null;
    const headers = new HttpHeaders()
      .set('Role', this.authService.getCurrentUser()?.role!)
      .set('Author', this.authService.getCurrentUser()?.username!);
      
    return this.http.delete<void>(
      `${this.api}comment/api/comment/${commentId}/delete`,
      { headers }
    ).pipe(catchError((error)=>this.handleError(error)));;
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