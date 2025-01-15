import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorPostListComponent } from './editor-post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Post } from '../../../../shared/models/post';
import { CreatePostComponent } from '../../forms/create-post/create-post.component';
import { CreateReviewComponent } from '../../review/create-review/create-review.component';

describe('EditorPostListComponent', () => {
  let component: EditorPostListComponent;
  let fixture: ComponentFixture<EditorPostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'testAuthor',
    date: new Date(),
    concept: false,
    approved: false,
    published: false,
    review: null,
    comments: []
  };

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPosts']);
    postServiceMock.posts = [];
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        EditorPostListComponent,
        RouterModule,
        CommonModule,
        MatDialogModule,
        MatListModule,
        MatCardModule,
        MatButtonModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorPostListComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    const mockPosts = [mockPost];
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(postServiceSpy.posts).toEqual(mockPosts);
  });

  it('should handle error when loading posts', () => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();

    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(postServiceSpy.errorMessage).toBeTruthy();
  });

  

  

  it('should not open review dialog for published post', () => {
    const publishedPost = { ...mockPost, published: true };
    
    component.openReviewModal(publishedPost);

    expect(dialogSpy.open).not.toHaveBeenCalled();
  });

  it('should cleanup subscriptions on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['subs'] = [subscription];

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});