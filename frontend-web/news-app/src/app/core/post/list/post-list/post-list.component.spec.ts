import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['filterPosts']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PostListComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
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
    const mockPage = {
      content: [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false }],
      totalElements: 1,
      pageable: { pageNumber: 0, pageSize: 10 },
      totalPages: 1
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.posts).toEqual(mockPage.content);
    expect(component.totalPosts).toBe(mockPage.totalElements);
  });

  it('should handle page changes', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 20 };
    const mockPage = {
      content: [{ id: 2, title: 'Test Post 2', content: 'Content 2', author: 'Author', date: new Date(), concept: false }],
      totalElements: 20,
      pageable: { pageNumber: 1, pageSize: 10 },
      totalPages: 2
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(pageEvent.pageIndex);
    expect(component.pageSize).toBe(pageEvent.pageSize);
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
  });

  it('should handle search', () => {
    const mockPage = {
      content: [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false }],
      totalElements: 1,
      pageable: { pageNumber: 0, pageSize: 10 },
      totalPages: 1
    };
    postServiceSpy.filterPosts.and.returnValue(of(mockPage));

    component.filterForm.patchValue({
      content: 'test',
      author: 'author'
    });
    component.onSearch();

    expect(component.pageIndex).toBe(0);
    expect(postServiceSpy.filterPosts).toHaveBeenCalled();
  });
});