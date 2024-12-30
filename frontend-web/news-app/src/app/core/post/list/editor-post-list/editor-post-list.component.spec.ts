import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorPostListComponent } from './editor-post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('EditorPostListComponent', () => {
  let component: EditorPostListComponent;
  let fixture: ComponentFixture<EditorPostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['getPosts']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [EditorPostListComponent],
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

  it('should fetch posts on init', () => {
    const mockPosts = [{ id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false }];
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.postService.posts).toEqual(mockPosts);
  });

  it('should handle error when fetching posts', () => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Error occurred')));

    component.ngOnInit();

    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.postService.errorMessage.get()).toBe('Error occurred');
  });

  it('should open create post modal', () => {
    component.openCreateModal();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});