import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post';
import { Page } from '../models/page';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    spy.getCurrentUser.and.returnValue({ username: 'testUser', role: 'EDITOR' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a post by id', () => {
    const mockPost: Post = { 
      id: 1, 
      title: 'Test Post',
      content: 'Test Content',
      author: 'testUser',
      date: new Date(),
      concept: false,
      approved: false,
      published: false,
      review: null
    };

    service.getPost(1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    req.flush(mockPost);
  });

  it('should publish a post', () => {
    service.publishPost(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1/publish`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    req.flush({});
  });

  it('should create a post', () => {
    const mockPost: Post = {
      title: 'New Post',
      content: 'New Content',
      author: 'testUser',
      date: new Date(),
      concept: false,
      approved: false,
      published: false,
      review: null
    };

    service.createPost(mockPost).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should get all posts', () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Test Post',
        content: 'Test Content',
        author: 'testUser',
        date: new Date(),
        concept: false,
        approved: false,
        published: false,
        review: null
      }
    ];

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should handle errors when user is not authenticated', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    service.getPosts().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    req.error(new ErrorEvent('Network error'));
  });
});