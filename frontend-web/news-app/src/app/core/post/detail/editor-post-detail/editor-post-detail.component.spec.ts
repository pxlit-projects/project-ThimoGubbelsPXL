import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorPostDetailComponent } from './editor-post-detail.component';
import { PostService } from '../../../../shared/services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { Post } from '../../../../shared/models/post';
import { Comment } from '../../../../shared/models/comment';

describe('EditorPostDetailComponent', () => {
  let component: EditorPostDetailComponent;
  let fixture: ComponentFixture<EditorPostDetailComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockComment: Comment = {
    id: 1,
    postId: 1,
    content: 'Test Comment',
    author: 'Commenter',
    date: new Date()
  };

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Content',
    author: 'Author',
    date: new Date(),
    concept: false,
    approved: true,
    published: false,
    review: null,
    comments: [mockComment]
  };

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPosts', 'publishPost']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routeMock = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [EditorPostDetailComponent, MatCardModule, MatButtonModule, RouterTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPostDetailComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post details with comments on init', () => {
    postServiceSpy.getPosts.and.returnValue(of([mockPost]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.post).toEqual(mockPost);
    expect(component.post?.comments?.length).toBe(1);
  });

  it('should handle error when loading post details', () => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.post).toBeNull();
  });

  it('should publish post successfully', () => {
    component.post = mockPost;
    postServiceSpy.publishPost.and.returnValue(of(void 0));

    component.publishPost();

    expect(postServiceSpy.publishPost).toHaveBeenCalledWith(mockPost.id);
    expect(component.post.published).toBeTrue();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Post published successfully',
      'Close',
      { duration: 3000 }
    );
  });

  it('should handle publish post error', () => {
    component.post = mockPost;
    postServiceSpy.publishPost.and.returnValue(throwError(() => new Error('Error occurred')));

    component.publishPost();

    expect(postServiceSpy.publishPost).toHaveBeenCalledWith(mockPost.id);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Error publishing post',
      'Close',
      { duration: 3000 }
    );
  });

  it('should not attempt to publish without post id', () => {
    component.post = null;
    component.publishPost();
    expect(postServiceSpy.publishPost).not.toHaveBeenCalled();
  });

});