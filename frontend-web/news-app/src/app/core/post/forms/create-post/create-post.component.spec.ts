import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePostComponent } from './create-post.component';
import { PostService } from '../../../../shared/services/post.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

describe('CreatePostComponent', () => {
  let component: CreatePostComponent;
  let fixture: ComponentFixture<CreatePostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const postServiceMock = jasmine.createSpyObj('PostService', ['createPost', 'updatePost', 'getPosts']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const routeMock = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: { get: () => '1' } } });

    await TestBed.configureTestingModule({
      imports: [CreatePostComponent],
      providers: [
        FormBuilder,
        { provide: PostService, useValue: postServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePostComponent);
    component = fixture.componentInstance;
    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routeSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with post data if postId is present', () => {
    const mockPost = { id: 1, title: 'Test Post', content: 'Content', author: 'Author', date: new Date(), concept: false };
    postServiceSpy.posts = [mockPost];
    postServiceSpy.getPosts.and.returnValue(of([mockPost]));

    component.ngOnInit();

    expect(component.postForm.value).toEqual({ title: 'Test Post', content: 'Content', concept: false });
  });

  it('should create a new post', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.createPost.and.returnValue(of({}));

    component.onSubmit();

    expect(postServiceSpy.createPost).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when creating a new post', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.createPost.and.returnValue(throwError(() => new Error('Error occurred')));

    component.onSubmit();

    expect(postServiceSpy.createPost).toHaveBeenCalled();
    expect(component.postService.errorMessage.get()).toBe('Error occurred');
  });

  it('should update an existing post', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.updatePost.and.returnValue(of({}));

    component.postId = 1;
    component.onSubmit();

    expect(postServiceSpy.updatePost).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  });

  it('should handle error when updating an existing post', () => {
    authServiceSpy.getCurrentUser.and.returnValue({ username: 'user1', password: 'password1', role: 'editor' });
    postServiceSpy.updatePost.and.returnValue(throwError(() => new Error('Error occurred')));

    component.postId = 1;
    component.onSubmit();

    expect(postServiceSpy.updatePost).toHaveBeenCalled();
    expect(component.postService.errorMessage.get()).toBe('Error occurred');
  });
});