// src/app/shared/services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createReview(review: any): Observable<void> {
    const headers = new HttpHeaders().set('Role', this.authService.getCurrentUser()?.role!);
    return this.http.post<void>(`${this.api}review/api/review`, review, { headers });
  }

  getReview(reviewId: number): Observable<any> {
    return this.http.get(`${this.api}review/api/review/${reviewId}`);
  }
}