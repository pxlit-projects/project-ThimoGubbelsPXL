import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorPostListComponent } from './editor-post-list.component';
import { PostService } from '../../../../shared/services/post.service';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { CreatePostComponent } from '../../forms/create-post/create-post.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

describe('EditorPostListComponent', () => {
  let component: EditorPostListComponent;
  let fixture: ComponentFixture<EditorPostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const postServiceMock = {
      getPosts: jasmine.createSpy('getPosts'),
      deletePost: jasmine.createSpy('deletePost'),
      posts: [],
      errorMessage: signal<string | null>(null)
    };

    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const dialogRefMock = {
      afterClosed: () => of(true)
    };
    dialogMock.open.and.returnValue(dialogRefMock);

    await TestBed.configureTestingModule({
      imports: [
        EditorPostListComponent, 
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        CommonModule
      ],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
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
    const mockPosts = [
      { id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false }
    ];
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();
    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.postService.posts).toEqual(mockPosts);
  });

  it('should handle error when loading posts', () => {
    postServiceSpy.getPosts.and.returnValue(throwError(() => new Error('Error occurred')));
    
    component.ngOnInit();
    expect(postServiceSpy.errorMessage()).toBe('Error occurred');
  });

  it('should open create post dialog', () => {
    component.openCreateModal();

    expect(dialogSpy.open).toHaveBeenCalledWith(CreatePostComponent, {
      width: '80vw',
      height: '80vh',
      panelClass: 'custom-dialog-container',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
  });

  it('should refresh posts after dialog closes', () => {
    const mockPosts = [{ id: 1, title: 'New Post', content: 'Content', author: 'Author', date: new Date(), concept: false }];
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));

    component.openCreateModal();
    expect(postServiceSpy.getPosts).toHaveBeenCalled();
  });


});