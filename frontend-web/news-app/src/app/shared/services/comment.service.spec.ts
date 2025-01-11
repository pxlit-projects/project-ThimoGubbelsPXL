import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/comment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser = {
    username: 'testUser',
    password: 'hashedPassword123',
    role: 'user'
  };

  const mockComment: Comment = {
    id: 1,
    postId: 1,
    content: 'Test Comment',
    author: 'testUser',
    date: new Date()
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    spy.getCurrentUser.and.returnValue(mockUser);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommentService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a comment', () => {
    service.createComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Role')).toBe('user');
    expect(req.request.body).toEqual(mockComment);
    req.flush(mockComment);
  });

  it('should update a comment', () => {
    const updatedComment = { ...mockComment, content: 'Updated content' };

    service.updateComment(updatedComment).subscribe(comment => {
      expect(comment).toEqual(updatedComment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comment/${updatedComment.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.headers.get('Role')).toBe('user');
    expect(req.request.body).toEqual({
      content: updatedComment.content,
      author: updatedComment.author
    });
    req.flush(updatedComment);
  });

  it('should delete a comment', () => {
    service.deleteComment(mockComment.id).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comment/${mockComment.id}/delete`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Role')).toBe('user');
    expect(req.request.headers.get('Author')).toBe('testUser');
    req.flush(null);
  });

  it('should handle error when user is not authenticated', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);

    service.createComment(mockComment).subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comment`);
    req.error(new ErrorEvent('Network error'));
  });
});