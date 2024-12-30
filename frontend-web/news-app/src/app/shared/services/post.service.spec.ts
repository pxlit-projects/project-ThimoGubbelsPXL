import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment.development';
import { Post } from '../models/post';
import { AuthService } from './auth.service';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostService,
        { provide: AuthService, useValue: authServiceMock }
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

  it('should create a post', () => {
    const mockPost: Post = { title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), isConcept: false };
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });

    service.createPost(mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });

  it('should update a post', () => {
    const mockPost: Post = { title: 'Updated Post', content: 'Updated Content', author: 'Author', date: new Date(), isConcept: false };
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });

    service.updatePost(mockPost, 1).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  it('should get posts', () => {
    const mockPosts: Post[] = [{ title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), isConcept: false }];
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});