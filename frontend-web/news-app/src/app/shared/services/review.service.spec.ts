import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    spy.getCurrentUser.and.returnValue({ username: 'testUser', role: 'EDITOR' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewService,
        { provide: AuthService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a review', () => {
    const mockReview = {
      postId: 1,
      content: 'Test review',
      author: 'testUser',
      postAuthor: 'originalAuthor',
      approved: true
    };

    service.createReview(mockReview).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/review`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    expect(req.request.body).toEqual(mockReview);
  });

  it('should get a review', () => {
    const reviewId = 1;
    const mockReview = {
      content: 'Test review',
      author: 'testUser'
    };

    service.getReview(reviewId).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/review/${reviewId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReview);
  });

  it('should handle error when creating review without auth', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    
    const mockReview = {
      postId: 1,
      content: 'Test review',
      author: 'testUser',
      postAuthor: 'originalAuthor',
      approved: true
    };

    service.createReview(mockReview).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/review`);
    req.error(new ErrorEvent('Network error'));
  });
});