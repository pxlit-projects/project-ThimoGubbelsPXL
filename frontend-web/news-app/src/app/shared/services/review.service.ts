// src/app/shared/services/review.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api = environment.apiUrl;
  errorMessage :string|null =null;
    private http: HttpClient = inject(HttpClient);
    private authService: AuthService = inject(AuthService);
 

  createReview(review: any): Observable<void> {
    this.errorMessage = null;
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<void>(`${this.api}review/api/review`, review, { headers }).pipe(catchError((error)=>this.handleError(error)));;
  }

  getReview(reviewId: number): Observable<any> {
    this.errorMessage = null;
    return this.http.get(`${this.api}review/api/review/${reviewId}`).pipe(catchError((error)=>this.handleError(error)));;
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