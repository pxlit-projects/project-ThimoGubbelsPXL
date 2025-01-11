import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../../../../shared/services/post.service';
import { CommentService } from '../../../../shared/services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Post } from '../../../../shared/models/post';
import { Comment } from '../../../../shared/models/comment';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { Page } from '../../../../shared/models/page';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

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
    approved: false,
    published: false,
    review: null,
    comments: [mockComment]
  };

  const mockPage: Page<Post> = {
    content: [mockPost],
    pageable: {
      pageNumber: 0,
      pageSize: 10
    },
    totalElements: 1,
    totalPages: 1
  };

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPublicPosts']);
    const commentServiceMock = jasmine.createSpyObj('CommentService', ['updateComment', 'deleteComment', 'createComment']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const routeMock = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, MatCardModule, MatButtonModule, RouterTestingModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: CommentService, useValue: commentServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    commentServiceSpy = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 

  it('should handle error when loading post details', () => {
    postServiceSpy.getPublicPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.post).toBeNull();
  });


  it('should delete comment', () => {
    component.post = mockPost;
    commentServiceSpy.deleteComment.and.returnValue(of(void 0));

    component.onCommentDeleted(mockComment.id);

    expect(commentServiceSpy.deleteComment).toHaveBeenCalledWith(mockComment.id);
    expect(component.post.comments.length).toBe(0);
  });

 
});