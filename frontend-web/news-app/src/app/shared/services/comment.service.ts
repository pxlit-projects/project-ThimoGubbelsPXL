import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
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

  createComment(comment: Comment): Observable<Comment> {
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<Comment>(`${this.api}comment/api/comment`, comment, { headers });
  }

  updateComment(comment: Comment): Observable<Comment> {
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.patch<Comment>(`${this.api}comment/api/comment/${comment.id}`, {content: comment.content, author: comment.author}, { headers });
  }

  deleteComment(commentId: Number): Observable<void> {
    const headers = new HttpHeaders()
      .set('Role', this.authService.getCurrentUser()?.role!)
      .set('Author', this.authService.getCurrentUser()?.username!);
      
    return this.http.delete<void>(
      `${this.api}comment/api/comment/${commentId}/delete`,
      { headers }
    );
  }
}