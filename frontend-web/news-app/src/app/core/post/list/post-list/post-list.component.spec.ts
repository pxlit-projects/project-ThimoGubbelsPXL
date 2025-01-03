import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { Page } from '../../../../shared/models/page';
import { Post } from '../../../../shared/models/post';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['filterPosts']);

    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        ReactiveFormsModule,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        RouterModule
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

  it('should load posts on init', () => {
    const mockPage: Page<Post> = {
      content: [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false, approved: false, published: false, review: null }],
      totalElements: 1,
      pageable: { pageNumber: 0, pageSize: 10 },
      totalPages: 1
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.ngOnInit();
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPage.content);
    expect(component.totalPosts).toEqual(mockPage.totalElements);
  });

  it('should handle error when loading posts', () => {
    postServiceSpy.filterPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
    expect(component.posts).toEqual([]);
    expect(component.totalPosts).toEqual(0);
  });

  it('should update posts on page change', () => {
    const mockPage: Page<Post> = {
      content: [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false, approved: false, published: false, review: null }],
      totalElements: 1,
      pageable: { pageNumber: 1, pageSize: 5 },
      totalPages: 1
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 1 });
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPage.content);
    expect(component.totalPosts).toEqual(mockPage.totalElements);
  });

  it('should update posts on search', () => {
    const mockPage: Page<Post> = {
      content: [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false, approved: false, published: false, review: null }],
      totalElements: 1,
      pageable: { pageNumber: 0, pageSize: 10 },
      totalPages: 1
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.filterForm.setValue({ content: 'Test', author: 'Author', startDate: '', endDate: '' });
    component.onSearch();
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPage.content);
    expect(component.totalPosts).toEqual(mockPage.totalElements);
  });
});