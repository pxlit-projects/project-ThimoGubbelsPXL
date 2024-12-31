import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { PostService } from '../../../../shared/services/post.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Post } from '../../../../shared/models/post';
import { CommonModule } from '@angular/common';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const postServiceMock = {
      createPost: jasmine.createSpy('createPost'),
      updatePost: jasmine.createSpy('updatePost'),
      getPosts: jasmine.createSpy('getPosts'),
      posts: [],
      errorMessage: signal<string | null>(null)
    };
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreatePostComponent, ReactiveFormsModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls', () => {
    expect(component.postForm.get('title')).toBeTruthy();
    expect(component.postForm.get('content')).toBeTruthy();
    expect(component.postForm.get('concept')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.postForm;
    expect(form.valid).toBeFalsy();

    form.controls['title'].setValue('Test Title');
    form.controls['content'].setValue('Test Content');
    
    expect(form.valid).toBeTruthy();
  });

  it('should handle unauthorized user submission', () => {
    authServiceSpy.getCurrentUser.and.returnValue(null);
    component.onSubmit();
    expect(component.errorMessage).toBe('User not authenticated');
  });

  it('should handle successful post creation', () => {
    const mockPost: Post = {
      title: 'Test Post',
      content: 'Content',
      author: 'user1',
      date: new Date(),
      concept: false
    };
    
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.createPost.and.returnValue(of(mockPost));

    component.onSubmit();

    expect(postServiceSpy.createPost).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when updating a post', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.updatePost.and.returnValue(throwError(() => new Error('Error occurred')));
    
    component.postId = 1;
    component.onSubmit();

    expect(postServiceSpy.updatePost).toHaveBeenCalled();
    expect(postServiceSpy.errorMessage()).toBe('Error occurred');
  });
});