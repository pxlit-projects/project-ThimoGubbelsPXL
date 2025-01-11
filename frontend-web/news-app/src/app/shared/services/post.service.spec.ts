import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post';
import { Page } from '../models/page';
import { Comment } from '../models/comment';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockComment: Comment = {
    id: 1,
    postId: 1,
    content: 'Test Comment',
    author: 'commentUser',
    date: new Date()
  };

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'testUser',
    date: new Date(),
    concept: false,
    approved: false,
    published: false,
    review: null,
    comments: [mockComment]
  };

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

  it('should create a post', () => {
    service.createPost(mockPost).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should update a post', () => {
    const updatedPost = { ...mockPost, content: 'Updated Content' };
    service.updatePost(updatedPost, mockPost.id).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/${mockPost.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    expect(req.request.body).toEqual(updatedPost);
    req.flush(updatedPost);
  });

  it('should get all posts', () => {
    const mockPosts: Post[] = [mockPost];
    service.getPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    req.flush(mockPosts);
  });

  it('should get public posts with pagination', () => {
    const mockPage: Page<Post> = {
      content: [mockPost],
      pageable: {
        pageNumber: 0,
        pageSize: 10
      },
      totalElements: 1,
      totalPages: 1
    };

    service.getPublicPosts(0, 10).subscribe(page => {
      expect(page).toEqual(mockPage);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/public?page=0&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  

  it('should publish a post', () => {
    service.publishPost(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/post/1/publish`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Role')).toBe('EDITOR');
    req.flush({});
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

  describe('FilterPosts', () => {
    it('should filter posts correctly', () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Test Post 1',
          content: 'First content',
          author: 'author1',
          date: new Date('2024-01-01'),
          concept: false,
          approved: false,
          published: false,
          review: null,
          comments: []
        }
      ];
  
      const mockPage = {
        content: mockPosts,
        pageable: { pageNumber: 0, pageSize: 10 },
        totalElements: 1,
        totalPages: 1
      };
  
      // Test 1: Content filter
      service.filterPosts('First', undefined, undefined, undefined, 0, 10)
        .subscribe(result => {
          expect(result.content[0].content).toContain('First');
          testNext();
        });
  
      const req1 = httpMock.expectOne(`${environment.apiUrl}post/api/post/public?page=0&size=10`);
      req1.flush(mockPage);
  
      function testNext() {
        // Test 2: Author filter
        service.filterPosts(undefined, 'author1', undefined, undefined, 0, 10)
          .subscribe(result => {
            expect(result.content[0].author).toBe('author1');
            testDateRange();
          });
  
        const req2 = httpMock.expectOne(`${environment.apiUrl}post/api/post/public?page=0&size=10`);
        req2.flush(mockPage);
      }
  
      function testDateRange() {
        // Test 3: Date range
        service.filterPosts(
          undefined,
          undefined,
          new Date('2024-01-01'),
          new Date('2024-01-02'),
          0,
          10
        ).subscribe(result => {
          expect(result.content.length).toBe(1);
        });
  
        const req3 = httpMock.expectOne(`${environment.apiUrl}post/api/post/public?page=0&size=10`);
        req3.flush(mockPage);
      }
    });
  });
});