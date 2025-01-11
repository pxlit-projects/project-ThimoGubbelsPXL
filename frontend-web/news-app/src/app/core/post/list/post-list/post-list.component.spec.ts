import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { Page } from '../../../../shared/models/page';
import { Post } from '../../../../shared/models/post';
import { Comment } from '../../../../shared/models/comment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

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
    const postServiceMock = jasmine.createSpyObj('PostService', ['filterPosts']);
    postServiceMock.posts = [];

    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        ReactiveFormsModule,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        RouterModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pageSize).toBe(10);
    expect(component.pageIndex).toBe(0);
    expect(component.totalPosts).toBe(0);
    expect(component.filterForm.value).toEqual({
      content: '',
      author: '',
      startDate: '',
      endDate: ''
    });
  });

 

  it('should handle error when loading posts', () => {
    postServiceSpy.filterPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();

    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
    expect(postServiceSpy.posts).toEqual([]);
    expect(component.totalPosts).toBe(0);
  });

 

  it('should cleanup subscriptions on destroy', () => {
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));
    component.ngOnInit();
    
    const subscription = component['subs'][0];
    spyOn(subscription, 'unsubscribe');
    
    component.ngOnDestroy();
    
    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});